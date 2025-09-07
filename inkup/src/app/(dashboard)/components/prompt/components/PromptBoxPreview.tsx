"use client";

interface Props {
  displayImage: string | null;
}

export default function PromptBoxPreview({ displayImage }: Props) {
  if (!displayImage) return null;

  return (
    <div className="mb-3 w-full h-40 flex items-center justify-center border border-[#333] rounded-lg overflow-hidden">
      <img
        src={displayImage}
        alt="Base"
        className="object-contain w-full h-full"
        draggable={false}
      />
    </div>
  );
}
