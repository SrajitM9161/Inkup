'use client';
import React, { useEffect, useRef } from 'react';
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
import { useToolStore } from '../../lib/store';
import { IBrush } from '../types/brush';
import { lerp, lerpPoints } from '../utils/brushUtils';
import { defaultBrush } from '../../lib/brushes';

export default function BrushCanvas() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const drawingTextureRef = useRef<RenderTexture | null>(null);
  const drawingSpriteRef = useRef<Sprite | null>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container || appRef.current) {
      return;
    }

    let app: Application;
    let resizeObserver: ResizeObserver;

    const setupPixiApp = async () => {
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        requestAnimationFrame(setupPixiApp);
        return;
      }

      app = new Application();
      await app.init({
        width: container.clientWidth,
        height: container.clientHeight,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
      });

      appRef.current = app;
      container.appendChild(app.canvas);

      const drawingTexture = RenderTexture.create({
        width: app.screen.width,
        height: app.screen.height,
        // ✅ FIX: Using the modern string literal for alphaMode
        alphaMode: 'premultiplied-alpha',
      });
      drawingTextureRef.current = drawingTexture;

      const drawingSprite = new Sprite(drawingTexture);
      drawingSpriteRef.current = drawingSprite;
      app.stage.addChild(drawingSprite);

      const brushStampContainer = new Container();
      app.stage.addChild(brushStampContainer);

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
          const maxSize = size;
          const minSize = maxSize * (1 - variation);
          x = lerp(prev[0], x, 1 - streamline);
          y = lerp(prev[1], y, 1 - streamline);
          const dist = Math.hypot(x - prev[0], y - prev[1]);
          if (type !== 'pen') { p = 1 - Math.min(1, dist / size); }
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
          
          if (type === 'eraser') {
            dab.tint = 0xFFFFFF;
            // ✅ FIX: Using the modern string literal for blend modes
            dab.blendMode = 'erase';
          } else {
            dab.tint = nColor;
            dab.blendMode = 'normal';
          }

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
          brushStampContainer.removeChild(currentMarkDabs);
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

      app.stage.eventMode = 'static';
      app.stage.hitArea = app.screen;
      app.stage.on('pointerdown', onPointerDown);
      app.stage.on('pointermove', onPointerMove);
      app.stage.on('pointerup', onPointerUp);
      app.stage.on('pointerupoutside', onPointerUp);

      resizeObserver = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        if (app.renderer && drawingTextureRef.current && drawingSpriteRef.current) {
          app.renderer.resize(width, height);
          
          drawingTextureRef.current.resize(width, height);
          drawingSpriteRef.current.width = width;
          drawingSpriteRef.current.height = height;
        }
      });
      resizeObserver.observe(container);
    };

    setupPixiApp();

    return () => {
      if (resizeObserver && container) {
        resizeObserver.unobserve(container);
      }
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
        drawingTextureRef.current = null;
        drawingSpriteRef.current = null;
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return <div ref={canvasContainerRef} className="w-full h-full" />;
}