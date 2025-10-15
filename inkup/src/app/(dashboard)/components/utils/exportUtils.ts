import {
  Application,
  RenderTexture,
  Sprite,
  Container,
  Texture,
  Assets,
} from 'pixi.js';

/**
 * Exports the canvas as an image by compositing the base image with PixiJS drawing
 * Uses HTML5 Canvas for compositing to ensure proper scaling and quality
 */
export const exportCanvasAsImage = async (
  baseImageSrc: string,
  pixiApp: Application,
  drawingTexture: RenderTexture,
  filename: string = 'tattoo-design'
): Promise<void> => {
  try {
    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d', { alpha: true });
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    const baseImage = new Image();
    baseImage.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      baseImage.onload = () => resolve();
      baseImage.onerror = (error) => {
        console.error('Failed to load base image:', error);
        reject(new Error('Failed to load base image'));
      };
      baseImage.src = baseImageSrc;
    });

    exportCanvas.width = baseImage.naturalWidth;
    exportCanvas.height = baseImage.naturalHeight;

    ctx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.globalCompositeOperation = 'source-over';

    ctx.drawImage(baseImage, 0, 0, exportCanvas.width, exportCanvas.height);

    const drawingCanvas = pixiApp.renderer.extract.canvas(drawingTexture) as HTMLCanvasElement;
    
    ctx.drawImage(
      drawingCanvas,
      0, 0, drawingCanvas.width, drawingCanvas.height,
      0, 0, exportCanvas.width, exportCanvas.height
    );

    exportCanvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob from canvas');
      }
      
      downloadBlob(blob, `${filename}.png`);
    }, 'image/png', 1.0);

  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

/**
 * Alternative export method using PixiJS RenderTexture for compositing
 * This method keeps everything within PixiJS ecosystem
 */
export const exportCanvasAsImageV2 = async (
  baseImageSrc: string,
  pixiApp: Application,
  drawingTexture: RenderTexture,
  filename: string = 'tattoo-design'
): Promise<void> => {
  try {
    const baseTexture = await Assets.load(baseImageSrc);
    
    const compositeTexture = RenderTexture.create({
      width: pixiApp.screen.width,
      height: pixiApp.screen.height,
      resolution: pixiApp.renderer.resolution,
    });

    const baseSprite = new Sprite(baseTexture);
    baseSprite.width = pixiApp.screen.width;
    baseSprite.height = pixiApp.screen.height;

    const drawingSprite = new Sprite(drawingTexture);

    const compositeContainer = new Container();
    compositeContainer.addChild(baseSprite);
    compositeContainer.addChild(drawingSprite);

    pixiApp.renderer.render({
      target: compositeTexture,
      container: compositeContainer,
      clear: true,
    });

    const exportCanvas = pixiApp.renderer.extract.canvas(compositeTexture) as HTMLCanvasElement;

    exportCanvas.toBlob!((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob from canvas');
      }
      
      downloadBlob(blob, `${filename}.png`);
    }, 'image/png', 1.0);

    compositeTexture.destroy(true);
    compositeContainer.destroy({ children: true });
    
  } catch (error) {
    console.error('Export V2 failed:', error);
    throw error;
  }
};

/**
 * Simplified export method that works with current PixiJS version
 * Uses direct texture loading and proper type casting
 */
export const exportCanvasSimple = async (
  baseImageSrc: string,
  pixiApp: Application,
  drawingTexture: RenderTexture,
  filename: string = 'tattoo-design'
): Promise<void> => {
  try {
    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    const baseImage = new Image();
    baseImage.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      baseImage.onload = () => resolve();
      baseImage.onerror = () => reject(new Error('Failed to load base image'));
      baseImage.src = baseImageSrc;
    });

    exportCanvas.width = baseImage.naturalWidth;
    exportCanvas.height = baseImage.naturalHeight;

    ctx.drawImage(baseImage, 0, 0, exportCanvas.width, exportCanvas.height);

    const pixiCanvas = pixiApp.renderer.extract.canvas(drawingTexture);
    
    if (!pixiCanvas || !('toBlob' in pixiCanvas)) {
      throw new Error('Failed to extract canvas from PixiJS');
    }

    const drawingCanvas = pixiCanvas as HTMLCanvasElement;
    
    ctx.drawImage(
      drawingCanvas,
      0, 0, drawingCanvas.width, drawingCanvas.height,
      0, 0, exportCanvas.width, exportCanvas.height
    );

    exportCanvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob from canvas');
      }
      downloadBlob(blob, `${filename}.png`);
    }, 'image/png', 1.0);

  } catch (error) {
    console.error('Simple export failed:', error);
    throw error;
  }
};

/**
 * Export with custom dimensions
 * Useful when you want to export at different resolution than the canvas
 */
export const exportCanvasWithCustomDimensions = async (
  baseImageSrc: string,
  pixiApp: Application,
  drawingTexture: RenderTexture,
  exportWidth: number,
  exportHeight: number,
  filename: string = 'tattoo-design'
): Promise<void> => {
  try {
    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d', { alpha: true });
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    const baseImage = new Image();
    baseImage.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      baseImage.onload = () => resolve();
      baseImage.onerror = () => reject(new Error('Failed to load base image'));
      baseImage.src = baseImageSrc;
    });

    exportCanvas.width = exportWidth;
    exportCanvas.height = exportHeight;

    ctx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.drawImage(baseImage, 0, 0, exportWidth, exportHeight);

    const pixiCanvas = pixiApp.renderer.extract.canvas(drawingTexture);
    const drawingCanvas = pixiCanvas as HTMLCanvasElement;
    
    ctx.drawImage(
      drawingCanvas,
      0, 0, drawingCanvas.width, drawingCanvas.height,
      0, 0, exportWidth, exportHeight
    );

    exportCanvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob from canvas');
      }
      
      downloadBlob(blob, `${filename}.png`);
    }, 'image/png', 1.0);

  } catch (error) {
    console.error('Custom dimensions export failed:', error);
    throw error;
  }
};

/**
 * Export as different formats (JPEG, WebP)
 */
export const exportCanvasAsFormat = async (
  baseImageSrc: string,
  pixiApp: Application,
  drawingTexture: RenderTexture,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 1.0,
  filename: string = 'tattoo-design'
): Promise<void> => {
  try {
    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d', { alpha: format !== 'jpeg' });
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    const baseImage = new Image();
    baseImage.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      baseImage.onload = () => resolve();
      baseImage.onerror = () => reject(new Error('Failed to load base image'));
      baseImage.src = baseImageSrc;
    });

    exportCanvas.width = baseImage.naturalWidth;
    exportCanvas.height = baseImage.naturalHeight;

    if (format === 'jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

    ctx.drawImage(baseImage, 0, 0, exportCanvas.width, exportCanvas.height);

    const pixiCanvas = pixiApp.renderer.extract.canvas(drawingTexture);
    const drawingCanvas = pixiCanvas as HTMLCanvasElement;
    
    ctx.drawImage(
      drawingCanvas,
      0, 0, drawingCanvas.width, drawingCanvas.height,
      0, 0, exportCanvas.width, exportCanvas.height
    );

    const mimeType = `image/${format}`;
    const extension = format === 'jpeg' ? 'jpg' : format;
    
    exportCanvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob from canvas');
      }
      
      downloadBlob(blob, `${filename}.${extension}`);
    }, mimeType, quality);

  } catch (error) {
    console.error(`Export as ${format} failed:`, error);
    throw error;
  }
};

/**
 * DEBUG UTILITY: Exports just the drawing RenderTexture as a PNG.
 * This helps verify if the drawing data is being captured correctly.
 */
export const downloadRenderTexture = (
  pixiApp: Application,
  drawingTexture: RenderTexture,
  filename: string = 'debug-drawing-layer'
): void => {
  try {
    const extractedCanvas = pixiApp.renderer.extract.canvas(drawingTexture) as HTMLCanvasElement;

    if (!extractedCanvas) {
      throw new Error('Failed to extract canvas from drawing texture.');
    }

    extractedCanvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob from debug canvas');
      }
      downloadBlob(blob, `${filename}.png`);
    }, 'image/png', 1.0);
  } catch (error) {
    console.error('Debug texture download failed:', error);
    throw error;
  }
};

/**
 * Utility function to handle blob download
 */
const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Get image dimensions without loading the full image
 */
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for dimension check'));
    };
    img.src = src;
  });
};

/**
 * Export canvas data as base64 string (useful for saving to database)
 */
export const exportCanvasAsBase64 = async (
  baseImageSrc: string,
  pixiApp: Application,
  drawingTexture: RenderTexture,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 1.0
): Promise<string> => {
  try {
    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d', { alpha: format !== 'jpeg' });
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    const baseImage = new Image();
    baseImage.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      baseImage.onload = () => resolve();
      baseImage.onerror = () => reject(new Error('Failed to load base image'));
      baseImage.src = baseImageSrc;
    });

    exportCanvas.width = baseImage.naturalWidth;
    exportCanvas.height = baseImage.naturalHeight;

    if (format === 'jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

    ctx.drawImage(baseImage, 0, 0, exportCanvas.width, exportCanvas.height);

    const pixiCanvas = pixiApp.renderer.extract.canvas(drawingTexture);
    const drawingCanvas = pixiCanvas as HTMLCanvasElement;
    
    ctx.drawImage(
      drawingCanvas,
      0, 0, drawingCanvas.width, drawingCanvas.height,
      0, 0, exportCanvas.width, exportCanvas.height
    );

    const mimeType = `image/${format}`;
    return exportCanvas.toDataURL(mimeType, quality);

  } catch (error) {
    console.error('Base64 export failed:', error);
    throw error;
  }
};