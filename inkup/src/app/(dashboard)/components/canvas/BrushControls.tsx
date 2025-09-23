'use client';
import { useToolStore } from '../../lib/store';
import { defaultBrush, charcoalBrush, inkPenBrush, airbrushBrush, markerBrush } from '../../lib/brushes';
import { IBrush } from '../types/brush';

// Updated BrushPreset to include a visible label
const BrushPreset = ({ brush, name }: { brush: IBrush; name: string }) => {
  const { setBrush, brush: currentBrush } = useToolStore();
  // A more robust check for the active brush
  const isActive = currentBrush.color === brush.color && 
                   currentBrush.size === brush.size && 
                   currentBrush.alpha === brush.alpha;

  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => setBrush(brush)}>
      <div
        className={`w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center ${isActive ? 'border-cyan-400' : 'border-gray-600 hover:border-cyan-400'}`}
        title={name}
      >
        <div
          className="w-8 h-8 rounded-full"
          style={{ backgroundColor: brush.color, opacity: brush.alpha }}
        />
      </div>
      <p className={`text-xs font-medium transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>{name}</p>
    </div>
  );
};

// Main controls component with the new Color Picker
export default function BrushControls() {
  const { brush, setBrush } = useToolStore();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update only the color of the current brush, keeping other settings
    setBrush({ ...brush, color: e.target.value });
  };

  return (
    <div className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl shadow-md px-4 py-3 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-gray-400 pr-2">Brushes:</p>
        <BrushPreset brush={inkPenBrush} name="Ink Pen" />
        <BrushPreset brush={markerBrush} name="Marker" />
        <BrushPreset brush={charcoalBrush} name="Charcoal" />
        <BrushPreset brush={airbrushBrush} name="Airbrush" />
      </div>
      
      <div className="flex items-center gap-3">
         <label htmlFor="brush-color-picker" className="text-sm font-medium text-gray-400">Color</label>
         <input 
            id="brush-color-picker"
            type="color" 
            value={brush.color}
            onChange={handleColorChange}
            // Tailwind classes for a cleaner look
            className="w-10 h-10 p-0 bg-transparent border-2 border-gray-600 rounded-md cursor-pointer"
          />
      </div>
    </div>
  );
}