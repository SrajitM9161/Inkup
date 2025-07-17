'use client';

import { Paintbrush, Eraser, Undo2, Redo2, Download } from 'lucide-react';
import { useToolStore } from '../lib/store';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';

interface ToolbarProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>;
}

export default function Toolbar({ canvasRef }: ToolbarProps) {
  const {
    tool,
    setTool,
    strokeWidth,
    setStrokeWidth,
    penColor,
    setPenColor,
  } = useToolStore();

  const handleTool = (type: 'pen' | 'eraser') => {
    setTool(type);
    canvasRef.current?.eraseMode(type === 'eraser');
  };

  const baseBtn =
    'w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-sm';
  const activeStyle = 'bg-[#2FF3FF] text-black';
  const inactiveStyle =
    'bg-[#1A1A1A] text-white border border-[#737373] hover:border-cyan-400';

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    const image = await canvasRef.current.exportImage('png');
    const a = document.createElement('a');
    a.href = image;
    a.download = 'edited-image.png';
    a.click();
  };

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center bg-[#0B0B0B] px-4 py-2 rounded-xl">
      {/* Paint Tool */}
      <button
        onClick={() => handleTool('pen')}
        className={`${baseBtn} ${tool === 'pen' ? activeStyle : inactiveStyle}`}
        title="Paint Tool"
      >
        <Paintbrush size={18} />
      </button>

      {/* Eraser Tool */}
      <button
        onClick={() => handleTool('eraser')}
        className={`${baseBtn} ${tool === 'eraser' ? activeStyle : inactiveStyle}`}
        title="Eraser Tool"
      >
        <Eraser size={18} />
      </button>

      {/* Undo */}
      <button
        onClick={() => canvasRef.current?.undo()}
        className={`${baseBtn} ${inactiveStyle}`}
        title="Undo"
      >
        <Undo2 size={18} />
      </button>

      {/* Redo */}
      <button
        onClick={() => canvasRef.current?.redo()}
        className={`${baseBtn} ${inactiveStyle}`}
        title="Redo"
      >
        <Redo2 size={18} />
      </button>

      {/* Stroke Width Slider */}
      <div className="flex items-center gap-2 bg-[#131313] px-3 py-1 rounded-lg border border-[#444]">
        <input
          type="range"
          min={1}
          max={30}
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="w-[100px] accent-cyan-400 cursor-pointer"
        />
        <span className="text-xs text-white px-2 py-[2px] bg-[#222] rounded-md border border-[#444]">
          Basic
        </span>
      </div>

      {/* Pen Color Picker */}
      <div className="flex items-center gap-2 bg-[#131313] px-3 py-1 rounded-lg border border-[#444]">
        <input
          type="color"
          value={penColor}
          onChange={(e) => setPenColor(e.target.value)}
          className="w-6 h-6 cursor-pointer rounded border border-[#888]"
          title="Pen Color"
        />
      </div>

      {/* Download */}
      <button
        onClick={handleDownload}
        className={`${baseBtn} ${inactiveStyle}`}
        title="Download Edited Image"
      >
        <Download size={18} />
      </button>
    </div>
  );
}
