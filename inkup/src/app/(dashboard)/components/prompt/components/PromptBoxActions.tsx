"use client";

interface Props {
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
}

export default function PromptBoxActions({ onClose, onSubmit }: Props) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-lg bg-[#222] text-gray-300 hover:bg-[#333]"
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        className="px-4 py-2 rounded-lg bg-[#d0fe17] hover:bg-[#d0fe17]/90 text-[#1e1e1e] font-medium"
      >
        Submit
      </button>
    </div>
  );
}
