'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Card({ offsetX, offsetY, rotate, index, img }: any) {
  const controls = useAnimation();
  const [spread, setSpread] = useState(false);
  const [initialX] = useState(() => Math.random() * 60 - 30);
  const [initialRotate] = useState(() => Math.random() * 20 - 10);

   const bgColors = [
    'bg-[#2ADBC1]',  // Card 1
    'bg-[#601F1F]',  // Card 2
    'bg-[#D88A0D]',  // Card 3
    'bg-[#601F1F]',  // Card 4
    'bg-[#893333]',  // Card 5
    'bg-[#2ADBC1]',  // Card 6
  ];

  useEffect(() => {
    controls.set({
      x: 0,
      y: 500,
      opacity: 0,
      rotate: initialRotate,
      scale: 0.9,
    });

    controls
      .start({
        x: -110,
        y: 0,
        opacity: 1,
        scale: 1,
        rotate: initialRotate,
        transition: {
          type: 'spring',
          bounce: 0.4,
          delay: 0.2,
          duration: 1.2,
        },
      })
      .then(() => {
        setTimeout(() => setSpread(true), 900);
      });
  }, []);

  useEffect(() => {
    if (spread) {
      controls.start({
        x: offsetX,
        y: offsetY,
        rotate,
        transition: {
          delay: index * 0.03,
          duration: 0.8,
          ease: [0.25, 1, 0.5, 1],
        },
      });
    }
  }, [spread]);

  return (
    <motion.div
      animate={controls}
      className={`absolute top-[290px] left-1/2 w-[160px] h-[220px] border-[2px] border-[#F8F8F8] shadow-[1px_2px_20px_rgba(248,248,248,0.6)] rounded-[18px] overflow-hidden ${bgColors[index]}`}
      style={{ transform: 'translateX(-50%)' }}
    >
      <Image
        src={img}
        alt="tattoo preview"
        width={160}
        height={220}
        className="object-cover w-full h-full"
      />
    </motion.div>
  );
}
