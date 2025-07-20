'use client';

import React from 'react';

interface MaskOverlayProps {
  mask: string | null;           
  opacity?: number;              
}

const MaskOverlay: React.FC<MaskOverlayProps> = ({ mask, opacity = 0.5 }) => {
  if (!mask) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <img
        src={mask}
        alt="Mask Overlay"
        className="w-full h-full object-cover"
        style={{ opacity }}
      />
    </div>
  );
};

export default MaskOverlay;
