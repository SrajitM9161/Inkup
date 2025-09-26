'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useToolStore } from '../../lib/store';
import BrushCanvas from './BrushCanvas';
import { Download, Save, MessageSquarePlus } from 'lucide-react';
import PromptBox from '../prompt/PromptBox';

export default function BrushModeLayout() {
  const { userImage } = useToolStore();
  const [promptOpen, setPromptOpen] = useState(false);

  const handleExport = () => {
    // This functionality requires passing the Pixi app instance up from BrushCanvas.
    // For now, this is a placeholder.
    console.log("Exporting image...");
    toast.success("Export function is not yet connected.");
  };

  const handleSave = () => {
    // This would also need the Pixi app instance to get the image data.
    console.log("Saving to generations...");
    toast.success("Save function is not yet connected.");
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#181818]">
      {/* Top Bar for Canvas Mode Controls */}
      <div className="absolute top-5 left-5 z-50 flex items-center gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg hover:bg-[#D0FE17] hover:text-black transition"
          title="Export Image"
        >
          <Download size={20} />
          <span>Export</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg hover:bg-[#D0FE17] hover:text-black transition"
          title="Save to My Generations"
        >
          <Save size={20} />
          <span>Save</span>
        </button>
        <button
          onClick={() => setPromptOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg hover:bg-[#D0FE17] hover:text-black transition"
          title="Edit with Prompt"
        >
          <MessageSquarePlus size={20} />
        </button>
      </div>

      {userImage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={userImage}
            alt="Drawing Reference"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <div className="absolute inset-0">
        <BrushCanvas />
      </div>

      {/* Renders the PromptBox when triggered */}
      <PromptBox open={promptOpen} onClose={() => setPromptOpen(false)} />
    </div>
  );
}