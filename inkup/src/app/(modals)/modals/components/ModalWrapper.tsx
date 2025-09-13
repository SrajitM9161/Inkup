'use client';

import { X } from 'lucide-react';

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function ModalWrapper({ children, onClose }: ModalWrapperProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center">
      
      <div className="p-8 rounded-2xl w-[400px] relative text-white shadow-2xl max-h-[90vh] overflow-y-auto border border-white/50 bg-gradient-to-b from-[#d9d9d9]/20 to-[#f8f8f8]/20 backdrop-blur-[10px]">
        
        {children}

      </div>
    </div>
  );
}