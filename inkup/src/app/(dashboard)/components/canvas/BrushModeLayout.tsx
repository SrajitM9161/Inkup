'use client';

import { useToolStore } from '../../lib/store';
import BrushCanvas from './BrushCanvas';

/**
 * This component provides a stable, full-screen environment for the brush canvas.
 * It renders on top of the main UI when canvasMode is active.
 */
export default function BrushModeLayout() {
  const { userImage } = useToolStore();

  return (
    // This div takes over the entire screen, providing a stable drawing area.
    <div className="fixed inset-0 z-40 bg-[#181818]">
      
      {/* 1. Optional Background Image */}
      {/* If a user image exists, we display it centered in the background. */}
      {userImage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={userImage}
            alt="Drawing Reference"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* 2. The Brush Canvas Itself */}
      {/* This div is the direct parent and is guaranteed to have dimensions,
          solving the core rendering problem. */}
      <div className="absolute inset-0">
        <BrushCanvas />
      </div>
    </div>
  );
}