import { useEffect } from 'react';
import { useToolStore } from '../lib/store';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';

export const useKeyboardShortcuts = (
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>
) => {
  const { clearGeneratedItems } = useToolStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvasRef.current) return;

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            canvasRef.current.undo();
            break;
          case 'y':
            e.preventDefault();
            canvasRef.current.redo();
            break;
          case 'e':
            e.preventDefault();
            canvasRef.current.clearCanvas();
            clearGeneratedItems();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvasRef, clearGeneratedItems]);
};
