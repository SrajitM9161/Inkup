'use client';
import React from 'react';
import ItemCanvas from './ItemCanvas';
import UserCanvas from './UserCanvas';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';

interface CanvasWrapperProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>;
}

export default function CanvasWrapper({ canvasRef }: CanvasWrapperProps) {
  return (
    <div className="relative">
      <UserCanvas canvasRef={canvasRef} />
      {/* <ItemCanvas /> */}
    </div>
  );
}
