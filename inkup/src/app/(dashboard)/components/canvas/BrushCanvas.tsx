'use client';

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Application,
  RenderTexture,
  Sprite,
  Container,
  Color,
  AlphaFilter,
  FederatedPointerEvent,
  Texture,
} from 'pixi.js';
import toast from 'react-hot-toast';
import { useToolStore } from '../../lib/store';
import { IBrush } from '../types/brush';
import { lerp, lerpPoints } from '../utils/brushUtils';
import { defaultBrush } from '../../lib/brushes';
import {
  exportCanvasAsImage,
  exportCanvasAsImageV2,
  exportCanvasSimple,
  downloadRenderTexture,
  exportCanvasAsBase64, 
} from '../utils/exportUtils';
import { ProjectFile, Stroke } from '../types/canvas';

interface BrushCanvasProps {
  imageRect: DOMRect;
  baseImageSrc: string;
  initialProject?: ProjectFile | null;
}
export type ExportMethod = 'html' | 'pixi' | 'simple' | 'debug_layer';
export interface BrushCanvasHandle {
  exportImage: (method: ExportMethod) => Promise<void>;
  exportToBase64: () => Promise<string | null>;
  getProjectData: () => Partial<ProjectFile> | null;
}

const BrushCanvas = forwardRef<BrushCanvasHandle, BrushCanvasProps>(
  ({ imageRect, baseImageSrc, initialProject }, ref) => {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const currentStrokeRef = useRef<Stroke | null>(null);

    useImperativeHandle(ref, () => ({
      getProjectData(): Partial<ProjectFile> | null {
          if (!imageRect) return null;
          console.log('Getting project data. Total strokes:', strokes.length, strokes); // Debug log
          return {
              baseImageSrc,
              projectData: {
                  version: 1,
                  baseImageSrc,
                  dimensions: { width: imageRect.width, height: imageRect.height },
                  strokes: strokes,
              }
          };
      },
      async exportImage(method: ExportMethod) {
          if (!appRef.current) return;
          const { current: app } = appRef;
          const texture = (app.stage.children[1] as Sprite).texture as RenderTexture;
          await exportCanvasAsImage(baseImageSrc, app, texture);
      },
      async exportToBase64(): Promise<string | null> {
          if (!appRef.current) return null;
          const { current: app } = appRef;
          const texture = (app.stage.children[1] as Sprite).texture as RenderTexture;
          return await exportCanvasAsBase64(baseImageSrc, app, texture, 'png');
      },
    }), [strokes, imageRect, baseImageSrc]); 

    useEffect(() => {
      const container = canvasContainerRef.current;
      if (!container || !imageRect || imageRect.width === 0) {
        return;
      }

      const app = new Application();
      app.init({
        width: imageRect.width, height: imageRect.height, backgroundAlpha: 0,
        antialias: true, autoDensity: true, resolution: window.devicePixelRatio || 1,
      }).then(() => {
        appRef.current = app;
        container.innerHTML = '';
        container.appendChild(app.canvas);
        container.style.left = `${imageRect.x}px`;
        container.style.top = `${imageRect.y}px`;

        const background = new Sprite(Texture.WHITE);
        background.width = app.screen.width; background.height = app.screen.height;
        background.alpha = 0; background.eventMode = 'static';
        app.stage.addChild(background);

        const drawingTexture = RenderTexture.create({ width: app.screen.width, height: app.screen.height, alphaMode: 'premultiplied-alpha' });
        const drawingSprite = new Sprite(drawingTexture);
        app.stage.addChild(drawingSprite);

        const brushStampContainer = new Container();
        app.stage.addChild(brushStampContainer);

        let pixiMark: ReturnType<typeof createPixiMark> | null = null;
        
        const createPixiMark = (initialBrush: IBrush) => {
          const brush: IBrush = { ...defaultBrush, ...initialBrush };
          const { color, opacity, alpha, size, streamline, variation, jitter, sizeJitter, speed, type, spacing } = brush;
          const nColor = new Color(color).toNumber();
          let prev: number[]; 
          let error = 0;
          const pts: number[][] = [];
          const currentMarkDabs = new Container();
          brushStampContainer.addChild(currentMarkDabs);

          if (opacity < 1) {
            currentMarkDabs.filters = [new AlphaFilter({ alpha: opacity })];
          }

          const addPoint = (curr: number[]) => {
            pts.push([...curr]);
            if (!prev) { prev = [...curr]; drawPoint(prev); return; }
            let [x, y, p] = curr;
            const maxSize = size; const minSize = maxSize * (1 - variation);
            x = lerp(prev[0], x, 1 - streamline); 
            y = lerp(prev[1], y, 1 - streamline);
            const dist = Math.hypot(x - prev[0], y - prev[1]);
            if (type !== 'pen') p = 1 - Math.min(1, dist / size);
            p = lerp(prev[2], p, speed);
            let trav = error;
            while (trav <= dist) {
              const [tx, ty, tp] = lerpPoints(prev, [x, y, p], trav / dist);
              const ts = lerp(minSize, maxSize, tp);
              trav += ts * spacing;
              const jx = lerp(-jitter * (size / 2), jitter * (size / 2), Math.random());
              const jy = lerp(-jitter * (size / 2), jitter * (size / 2), Math.random());
              const js = lerp(-sizeJitter * (size / 2), sizeJitter * (size / 2), Math.random());
              drawPoint([tx + jx, ty + jy, ts + js]);
            }
            error = trav - dist;
            prev = [x, y, p];
          };

          const drawPoint = ([x, y, r]: number[]) => {
            if (isNaN(r) || r <= 0) return;
            const dab = new Sprite(Texture.WHITE);
            dab.tint = type === 'eraser' ? 0xffffff : nColor;
            dab.blendMode = type === 'eraser' ? 'erase' : 'normal';
            dab.anchor.set(0.5); 
            dab.x = x; 
            dab.y = y; 
            dab.width = dab.height = r; 
            dab.alpha = alpha;
            currentMarkDabs.addChild(dab);
          };

          const complete = () => {
            if (pts.length < 3 && pts.length > 0) { addPoint([...pts[pts.length - 1]]); }
            app.renderer.render({
                target: drawingTexture,
                container: currentMarkDabs,
                clear: false,
            });
            drawingSprite.texture.update();
            brushStampContainer.removeChild(currentMarkDabs);
            currentMarkDabs.destroy({ children: true });
          };
          
          return { addPoint, complete };
        };

        if (initialProject) {
            console.log("useEffect: Loading initial project", initialProject);
            const strokesToLoad = initialProject.projectData?.strokes || [];
            const loadedStrokes: Stroke[] = [];
            strokesToLoad.forEach((stroke) => {
                if (stroke) {
                    loadedStrokes.push(stroke);
                    const mark = createPixiMark(stroke.brush);
                    stroke.points.forEach((point) => mark.addPoint(point));
                    mark.complete();
                }
            });
            setStrokes(loadedStrokes);
        }

        const onPointerDown = (e: FederatedPointerEvent) => {
            const point = e.getLocalPosition(app.stage);
            const currentBrush = useToolStore.getState().brush;
            pixiMark = createPixiMark(currentBrush);
            pixiMark.addPoint([point.x, point.y, e.pressure || 0.5]);
            currentStrokeRef.current = {
                brush: { ...currentBrush },
                points: [[point.x, point.y, e.pressure || 0.5]],
            };
        };

        const onPointerMove = (e: FederatedPointerEvent) => {
            if (!pixiMark) return;
            const point = e.getLocalPosition(app.stage);
            pixiMark.addPoint([point.x, point.y, e.pressure || 0.5]);
            currentStrokeRef.current?.points.push([point.x, point.y, e.pressure || 0.5]);
        };

        const onPointerUp = () => {
            if (!pixiMark) return;

            pixiMark.complete();
            pixiMark = null;
            
            const completedStroke = currentStrokeRef.current;
            
            currentStrokeRef.current = null;

            if (completedStroke && completedStroke.points.length > 0) {
                setStrokes(prevStrokes => [...prevStrokes, completedStroke]);
            }
        };

        background.on('pointerdown', onPointerDown);
        background.on('pointermove', onPointerMove);
        background.on('pointerup', onPointerUp);
        background.on('pointerupoutside', onPointerUp);
      });

      return () => {
        if (appRef.current) {
          appRef.current.destroy(true, { children: true, texture: true });
          appRef.current = null;
        }
      };
    }, [imageRect.width, imageRect.height, imageRect.x, imageRect.y, initialProject]);

    return <div ref={canvasContainerRef} className="absolute z-10" />;
  }
);

BrushCanvas.displayName = 'BrushCanvas';
export default BrushCanvas;