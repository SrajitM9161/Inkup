'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { bgColors } from '../Constants/constant';
export default function Card({ offsetX, offsetY, rotate, index, img }: any) {
  const controls = useAnimation();
  const [spread, setSpread] = useState(false);
  const [visible, setVisible] = useState(false);
  const [initialRotate] = useState(() => Math.random() * 20 - 10);

  useEffect(() => {
    controls.set({
      x: 0,
      y: 500,
      opacity: 0,
      rotate: initialRotate,
      scale: 0.9,
    });

    setTimeout(() => setVisible(true), 10);

    controls
      .start({
        x: -110,
        y: 0,
        opacity: 1,
        scale: 1,
        rotate: initialRotate,
        transition: {
          type: 'spring',
          stiffness: 160,
          damping: 20,
          delay: 0.1 + index * 0.03,
          duration: 0.6,
        },
      })
      .then(() => {
        setTimeout(() => setSpread(true), 500);
      });
  }, []);

  useEffect(() => {
    if (spread) {
      controls.start({
        x: offsetX,
        y: offsetY,
        rotate,
        transition: {
          delay: 0,
          duration: 0.6,
          ease: 'easeInOut',
        },
      });
    }
  }, [spread]);

  return (
    <motion.div
      animate={controls}
      initial={false} 
      className={`absolute top-[290px] left-1/2 w-[160px] h-[220px] border-[2px] border-[#F8F8F8] shadow-[1px_2px_20px_rgba(248,248,248,0.6)] rounded-[18px] overflow-hidden ${bgColors[index]}`}
      style={{
        transform: 'translateX(-50%)',
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      <Image
        src={img}
        alt="tattoo preview"
        width={160}
        height={220}
        className="object-cover w-full h-full"
        priority
      />
    </motion.div>
  );
}
