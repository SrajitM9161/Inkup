import React from 'react';
import { IconType } from 'react-icons';

interface AuthButtonProps {
  Icon: IconType;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function AuthButton({ Icon, label, onClick, disabled }: AuthButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-white text-black py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}