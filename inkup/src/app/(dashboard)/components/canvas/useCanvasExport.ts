import type { ReactSketchCanvasRef } from 'react-sketch-canvas';

export const useCanvasExport = (canvasRef: React.RefObject<ReactSketchCanvasRef | null>) => {
  const exportCanvas = async () => {
    if (!canvasRef.current) throw new Error('Canvas not available');
    return await canvasRef.current.exportImage('png');
  };

  const clearCanvas = () => {
    canvasRef.current?.clearCanvas();
    canvasRef.current?.resetCanvas(); 
  };

  return { exportCanvas, clearCanvas };
};
