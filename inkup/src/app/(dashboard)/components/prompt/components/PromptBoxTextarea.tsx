"use client";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function PromptBoxTextarea({ value, onChange }: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your prompt..."
      className="w-full h-28 rounded-lg bg-[#111] text-white p-3 border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d0fe17] resize-none"
    />
  );
}
