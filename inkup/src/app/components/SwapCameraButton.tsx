'use client';

import { SwitchCamera } from 'lucide-react';
import { motion } from 'framer-motion';

type SwapCameraButtonProps = {
onClick: () => void | Promise<void>;
   disabled?: boolean;
};

export default function SwapCameraButton({ onClick, disabled }: SwapCameraButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className="fixed top-4 right-4 z-50 bg-[#d0fe17] text-black p-2 rounded-full shadow-md flex items-center justify-center transition hover:scale-105 lg:hidden"
      disabled={disabled} 
      aria-label="Swap Camera"
    >
      <SwitchCamera className="w-5 h-5" />
    </motion.button>
  );
}
