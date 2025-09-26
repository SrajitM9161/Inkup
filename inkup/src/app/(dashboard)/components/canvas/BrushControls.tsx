'use client';
import { useToolStore } from '../../lib/store';
import { 
  charcoalBrush, 
  inkPenBrush, 
  airbrushBrush, 
  markerBrush, 
  eraserBrush,
  sketchPencilBrush,
  technicalPenBrush,
  calligraphyPenBrush,
  gouacheBrush,
  watercolorBrush,
} from '../../lib/brushes';
import { IBrush } from '../types/brush';
import { 
  Pen, 
  Brush, 
  SprayCan, 
  Highlighter, 
  Eraser as EraserIcon, 
  Pencil, 
  PenTool, 
  Feather, 
  Paintbrush2, 
  Droplets 
} from 'lucide-react';

const brushIcons: { [key: string]: React.ReactNode } = {
  "Ink Pen": <Pen size={24} />,
  "Marker": <Highlighter size={24} />,
  "Charcoal": <Brush size={24} />,
  "Airbrush": <SprayCan size={24} />,
  "Eraser": <EraserIcon size={24} />,
  "Sketch Pencil": <Pencil size={24} />,
  "Technical Pen": <PenTool size={24} />,
  "Calligraphy": <Feather size={24} />,
  "Gouache": <Paintbrush2 size={24} />,
  "Watercolor": <Droplets size={24} />,
};

const BrushPreset = ({ brush, name }: { brush: IBrush; name: string }) => {
  const { setBrush, brush: currentBrush } = useToolStore();
  
  const isActive = currentBrush.color === brush.color && 
                   currentBrush.size === brush.size &&
                   currentBrush.type === brush.type;

  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => setBrush(brush)}>
      <div
        className={`w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center ${isActive ? 'border-cyan-400 bg-cyan-400/10' : 'border-gray-600 hover:border-cyan-400'}`}
        title={name}
      >
        <div className={`${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
          {brushIcons[name]}
        </div>
      </div>
      <p className={`text-xs font-medium transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>{name}</p>
    </div>
  );
};

export default function BrushControls() {
  const { brush, setBrush } = useToolStore();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrush({ ...brush, color: e.target.value });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrush({ ...brush, size: Number(e.target.value) });
  };

  return (
    <div className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl shadow-md px-4 py-3 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4 overflow-x-auto">
        <p className="text-sm font-medium text-gray-400 pr-2 border-r border-gray-600 shrink-0">Brushes</p>
        <BrushPreset brush={sketchPencilBrush} name="Sketch Pencil" />
        <BrushPreset brush={inkPenBrush} name="Ink Pen" />
        <BrushPreset brush={technicalPenBrush} name="Technical Pen" />
        <BrushPreset brush={calligraphyPenBrush} name="Calligraphy" />
        <BrushPreset brush={charcoalBrush} name="Charcoal" />
        <BrushPreset brush={markerBrush} name="Marker" />
        <BrushPreset brush={gouacheBrush} name="Gouache" />
        <BrushPreset brush={watercolorBrush} name="Watercolor" />
        <BrushPreset brush={airbrushBrush} name="Airbrush" />
        <BrushPreset brush={eraserBrush} name="Eraser" />
      </div>
      
      <div className="flex items-center gap-6">
         {brush.type !== 'eraser' && (
           <div className="flex items-center gap-3">
              <label htmlFor="brush-color-picker" className="text-sm font-medium text-gray-400">Color</label>
              <input 
                id="brush-color-picker"
                type="color" 
                value={brush.color}
                onChange={handleColorChange}
                className="w-10 h-10 p-0 bg-transparent border-2 border-gray-600 rounded-md cursor-pointer"
              />
           </div>
         )}

         <div className="flex items-center gap-3">
            <label htmlFor="brush-size-slider" className="text-sm font-medium text-gray-400">Size</label>
            <input 
              id="brush-size-slider"
              type="range"
              min="1"
              max="100"
              value={brush.size}
              onChange={handleSizeChange}
              className="w-32 accent-[#D0FE17]"
            />
         </div>
         
      </div>
    </div>
  );
}