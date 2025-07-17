'use client';

import { motion } from 'framer-motion';

const dots = [0, 1, 2, 3, 4];

export default function CrazyLoader() {
  const animation = {
    scale: [1, 1.5, 1],
    rotate: [0, 360, 0],
    y: [0, -20, 0],
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex gap-2">
        {dots.map((dot) => (
          <motion.div
            key={dot}
            className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500"
            animate={animation}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: dot * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
