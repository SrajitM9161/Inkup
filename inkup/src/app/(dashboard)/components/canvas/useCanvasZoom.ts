import { useCallback, useState } from 'react';

export const useCanvasZoom = (min = 0.5, max = 3, step = 0.1) => {
  const [scale, setScale] = useState(1);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + step, max));
  }, [max, step]);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - step, min));
  }, [min, step]);

  const handleWheelZoom = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const newScale = scale - e.deltaY * 0.001;
      setScale(Math.min(Math.max(newScale, min), max));
    },
    [scale, min, max]
  );

  return { scale, zoomIn, zoomOut, handleWheelZoom };
};
