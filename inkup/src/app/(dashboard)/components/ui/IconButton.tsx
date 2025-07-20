// components/ui/IconButton.tsx
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  title?: string;
}

export default function IconButton({ icon: Icon, onClick, className = '', title }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] transition ${className}`}
      title={title}
    >
      <Icon size={20} className="text-white" />
    </button>
  );
}
