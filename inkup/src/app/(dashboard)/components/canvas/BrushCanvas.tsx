'use client';
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { useToolStore } from '../../lib/store';
import { IBrush } from '../types/brush';
import { lerp, lerpPoints } from '../utils/brushUtils';
import { defaultBrush } from '../../lib/brushes';

export default function BrushCanvas() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container || appRef.current) {
      return;
    }

    let app: PIXI.Application;
    let resizeObserver: ResizeObserver;

    const setupPixiApp = async () => {
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        requestAnimationFrame(setupPixiApp);
        return;
      }

      app = new PIXI.Application();
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

      const prevSurface = new PIXI.Graphics();
      app.stage.addChild(prevSurface);
      const currSurface = new PIXI.Graphics();
      app.stage.addChild(currSurface);

      // --- **THE WORKING SOLUTION: USE A GUARANTEED VALID TEXTURE** ---
      // This bypasses custom texture generation and is the most reliable method.
      const brushTexture = PIXI.Texture.WHITE;
      // --- End of Solution ---

      let pixiMark: ReturnType<typeof createPixiMark> | null = null;
      
      const createPixiMark = (initialBrush: IBrush) => {
        const brush: IBrush = { ...defaultBrush, ...initialBrush };
        const { color, opacity, alpha, size, streamline, variation, jitter, sizeJitter, speed, type, spacing } = brush;
        const nColor = new PIXI.Color(color).toNumber();
        let prev: number[];
        let error = 0;
        const pts: number[][] = [];
        const markContainer = new PIXI.Container();
        currSurface.addChild(markContainer);

        if (opacity < 1) {
            markContainer.filters = [new PIXI.AlphaFilter({ alpha: opacity })];
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
          // A safety check to prevent drawing if the radius is invalid
          if (isNaN(r) || r <= 0) return;
        
          const dab = new PIXI.Sprite(brushTexture);
          dab.tint = nColor;
          dab.anchor.set(0.5);
          dab.x = x;
          dab.y = y;
          // The size is controlled by width/height, since the base texture is 1x1
          dab.width = dab.height = r;
          dab.alpha = alpha;
          markContainer.addChild(dab);
        };

        const complete = () => {
          if (pts.length < 3 && pts.length > 0) { addPoint([...pts[pts.length - 1]]); }
          currSurface.removeChild(markContainer);
          prevSurface.addChild(markContainer);
        };

        return { addPoint, complete };
      };

      const onPointerDown = (e: PIXI.FederatedPointerEvent) => {
        const point = e.getLocalPosition(app.stage);
        pixiMark = createPixiMark(useToolStore.getState().brush);
        pixiMark.addPoint([point.x, point.y, e.pressure || 0.5]);
      };
      const onPointerMove = (e: PIXI.FederatedPointerEvent) => {
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
        if (app.renderer) {
          app.renderer.resize(width, height);
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
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return <div ref={canvasContainerRef} className="w-full h-full" />;
}