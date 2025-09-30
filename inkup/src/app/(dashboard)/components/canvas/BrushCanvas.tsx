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

interface BrushCanvasProps {
  imageRect: DOMRect;
  baseImageSrc: string;
}

export type ExportMethod = 'html' | 'pixi' | 'simple' | 'debug_layer';

export interface BrushCanvasHandle {
  exportImage: (method: ExportMethod) => Promise<void>;
  exportToBase64: () => Promise<string | null>;
}

const BrushCanvas = forwardRef<BrushCanvasHandle, BrushCanvasProps>(
  ({ imageRect, baseImageSrc }, ref) => {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const drawingTextureRef = useRef<RenderTexture | null>(null);
    const drawingSpriteRef = useRef<Sprite | null>(null);
    const [reinitTrigger, setReinitTrigger] = useState(0);
    const hasReinitialized = useRef(false);

    useImperativeHandle(ref, () => ({
      async exportImage(method: ExportMethod) {
        if (!appRef.current || !drawingTextureRef.current || !baseImageSrc) {
          toast.error('Cannot export. Canvas not ready.');
          return;
        }
        toast.loading(`Exporting with method: ${method}...`);
        try {
          const app = appRef.current;
          const texture = drawingTextureRef.current;
          switch (method) {
            case 'html':
              await exportCanvasAsImage(baseImageSrc, app, texture);
              break;
            case 'pixi':
              await exportCanvasAsImageV2(baseImageSrc, app, texture);
              break;
            case 'simple':
              await exportCanvasSimple(baseImageSrc, app, texture);
              break;
            case 'debug_layer':
              downloadRenderTexture(app, texture);
              break;
            default:
              throw new Error('Unknown export method');
          }
          toast.dismiss();
          toast.success(`Export successful with method: ${method}!`);
        } catch (error) {
          toast.dismiss();
          toast.error(`Export failed with method: ${method}.`);
          console.error(`Export failed with method: ${method}`, error);
        }
      },
      async exportToBase64(): Promise<string | null> {
        if (!appRef.current || !drawingTextureRef.current || !baseImageSrc) {
          toast.error('Cannot export. Canvas not ready.');
          return null;
        }
        try {
          const base64 = await exportCanvasAsBase64(
            baseImageSrc,
            appRef.current,
            drawingTextureRef.current,
            'png'
          );
          return base64;
        } catch (error) {
          console.error("Failed to export to Base64", error);
          toast.error("Could not prepare image for saving.");
          return null;
        }
      }
    }));

    useEffect(() => {
      const container = canvasContainerRef.current;
      if (!container || appRef.current) return;

      let app: Application;

      const setupPixiApp = async () => {
        const { width, height, x, y } = imageRect;
        if (width === 0 || height === 0) return;

        app = new Application();
        await app.init({ 
          width, 
          height, 
          backgroundColor: 0x000000, 
          backgroundAlpha: 0, 
          antialias: true, 
          autoDensity: true, 
          resolution: window.devicePixelRatio || 1 
        });
        
        appRef.current = app;
        
        container.style.width = `${width}px`; 
        container.style.height = `${height}px`; 
        container.style.left = `${x}px`; 
        container.style.top = `${y}px`;
        container.appendChild(app.canvas);
        
        const background = new Sprite(Texture.WHITE);
        background.width = app.screen.width; 
        background.height = app.screen.height; 
        background.alpha = 0; 
        background.eventMode = 'static';
        app.stage.addChild(background);

        const drawingTexture = RenderTexture.create({ 
          width: app.screen.width, 
          height: app.screen.height, 
          alphaMode: 'premultiplied-alpha' 
        });
        drawingTextureRef.current = drawingTexture;

        const drawingSprite = new Sprite(drawingTexture);
        drawingSpriteRef.current = drawingSprite;
        app.stage.addChild(drawingSprite);
        
        const brushStampContainer = new Container();
        app.stage.addChild(brushStampContainer);

        if (!hasReinitialized.current && reinitTrigger === 0) {
          hasReinitialized.current = true;
          
          setTimeout(() => {
            if (appRef.current) {
              appRef.current.destroy(true, { children: true, texture: true });
              appRef.current = null;
              drawingTextureRef.current = null;
              drawingSpriteRef.current = null;
            }
            if (container) {
              while (container.firstChild) {
                container.removeChild(container.firstChild);
              }
            }
            setReinitTrigger(1);
          }, 100);
          return;
        }

        const brushTexture = Texture.WHITE;
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
            const dab = new Sprite(brushTexture);
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
            if (pts.length < 3 && pts.length > 0) {
              addPoint([...pts[pts.length - 1]]);
            }
            
            if (drawingTextureRef.current && appRef.current && drawingSpriteRef.current) {
              app.renderer.render({
                target: drawingTextureRef.current,
                container: currentMarkDabs,
                clear: false,
              });
              
              drawingSpriteRef.current.texture.update();
              app.renderer.render(app.stage);
            }
            
            brushStampContainer.removeChild(currentMarkDabs);
            currentMarkDabs.destroy({ children: true });
          };
          
          return { addPoint, complete };
        };

        const onPointerDown = (e: FederatedPointerEvent) => {
          const point = e.getLocalPosition(app.stage);
          pixiMark = createPixiMark(useToolStore.getState().brush);
          pixiMark.addPoint([point.x, point.y, e.pressure || 0.5]);
        };
        
        const onPointerMove = (e: FederatedPointerEvent) => {
          if (pixiMark) {
            const point = e.getLocalPosition(app.stage);
            pixiMark.addPoint([point.x, point.y, e.pressure || 0.5]);
          }
        };
        
        const onPointerUp = () => {
          if (pixiMark) {
            pixiMark.complete();
            pixiMark = null;
          }
        };

        background.on('pointerdown', onPointerDown);
        background.on('pointermove', onPointerMove);
        background.on('pointerup', onPointerUp);
        background.on('pointerupoutside', onPointerUp);
      };
      
      setupPixiApp();

      return () => {
        if (appRef.current) { 
          appRef.current.destroy(true, { children: true, texture: true }); 
          appRef.current = null; 
          drawingTextureRef.current = null;
          drawingSpriteRef.current = null;
        }
        if (container) { 
          while (container.firstChild) { 
            container.removeChild(container.firstChild); 
          } 
        }
      };
    }, [imageRect, reinitTrigger]);

    return <div ref={canvasContainerRef} className="absolute z-10" />;
  }
);

BrushCanvas.displayName = 'BrushCanvas';
export default BrushCanvas;
