'use client';

import { useState } from 'react';

interface CanvasSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dimensions: { width: number; height: number }) => void;
}

const presets = [
  { label: 'Square (1:1)', width: 1024, height: 1024 },
  { label: 'Portrait (4:5)', width: 1024, height: 1280 },
  { label: 'Landscape (5:4)', width: 1280, height: 1024 },
];

export default function CanvasSizeModal({ isOpen, onClose, onConfirm }: CanvasSizeModalProps) {
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (width > 0 && height > 0) {
      onConfirm({ width, height });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1C1C1C] border border-[#333] rounded-lg shadow-xl p-6 w-full max-w-sm text-white">
        <h2 className="text-xl font-bold mb-4">Create New Canvas</h2>
        <p className="text-sm text-gray-400 mb-6">Choose a preset or enter custom dimensions.</p>

        <div className="mb-6">
            <div className="flex flex-wrap gap-2">
                {presets.map((preset) => {
                    const isActive = width === preset.width && height === preset.height;
                    return (
                        <button
                            key={preset.label}
                            onClick={() => {
                                setWidth(preset.width);
                                setHeight(preset.height);
                            }}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition ${
                                isActive 
                                ? 'bg-[#D0FE17] text-black border-[#D0FE17]' 
                                : 'bg-transparent border-[#444] hover:bg-[#333]'
                            }`}
                        >
                            {preset.label}
                        </button>
                    );
                })}
            </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-300 mb-1">Width (px)</label>
            <input
              type="number"
              id="width"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#101010] border border-[#444] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#D0FE17] focus:border-[#D0FE17] outline-none"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">Height (px)</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#101010] border border-[#444] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#D0FE17] focus:border-[#D0FE17] outline-none"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent border border-[#444] rounded-md hover:bg-[#333] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-[#D0FE17] text-black font-semibold rounded-md hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!width || !height}
          >
            Create Canvas
          </button>
        </div>
      </div>
    </div>
  );
}