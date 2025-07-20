import { useCallback } from 'react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';

export const useExport = (
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>
) => {
  const handleExport = useCallback(async () => {
    if (!canvasRef.current) return null;

    try {
      const dataUrl = await canvasRef.current.exportImage('png');
      return dataUrl;
    } catch (error) {
      console.error('Export error:', error);
      return null;
    }
  }, [canvasRef]);

  return { handleExport };
};
