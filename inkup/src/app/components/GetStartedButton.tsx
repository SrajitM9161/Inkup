'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GetStartedButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.4, duration: 0.6, ease: 'easeOut' }} 
      className="absolute top-[550px] left-1/2 transform -translate-x-1/2"
    >
      <Link href="/generate">
        <div className="w-[200px] h-[55px] bg-[rgba(28,28,28,0.5)] opacity-[0.9] border border-[#149FA9] shadow-[0px_4px_4px_#149FA9] rounded-[20px] flex items-center justify-center gap-2 cursor-pointer">
          <span className="text-white text-[18px] font-normal">Get started</span>
          <ArrowRight size={18} strokeWidth={2} className="text-white ml-[-6px]" />
        </div>
      </Link>
    </motion.div>
  );
}
