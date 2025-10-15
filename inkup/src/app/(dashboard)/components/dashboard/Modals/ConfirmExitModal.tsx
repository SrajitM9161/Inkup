'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface ConfirmExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmExitModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmExitModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-[#1C1C1C] rounded-2xl p-6 w-[90%] max-w-sm shadow-xl border border-[#333] flex flex-col items-center text-center"
          >
            <div className="p-3 bg-yellow-500/10 rounded-full mb-4">
              <ShieldAlert className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Unsaved Changes</h2>
            <p className="text-gray-400 mb-6">
              You have unsaved work. If you leave now, your changes will be lost.
            </p>
            <div className="w-full flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-[#2a2a2a] border border-[#444] text-white rounded-lg font-semibold hover:bg-[#3a3a3a] transition"
              >
                Stay
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Exit Anyway
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}