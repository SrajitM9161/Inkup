"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  gradient: string;
  features?: string[];
  width?: string;  // e.g., w-[360px]
  height?: string; // e.g., h-[600px]
}

export default function PricingCard({
  title,
  description,
  price,
  gradient,
  features = [],
  width = "w-[360px]",
  height = "h-[590px]",
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={`${width} ${height} rounded-2xl border border-white/20 
      bg-gradient-to-b from-[#0D0D0D80] to-[#73737380] p-6 
      flex flex-col justify-between shadow-md`}
    >
      <div>
        {/* Title */}
        <h3
          className={`text-[34px] font-bold bg-clip-text text-transparent ${gradient}`}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/70 mt-4 text-lg leading-6">{description}</p>

        {/* Features */}
        {features.length > 0 && (
          <ul className="mt-6 space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-white/90">
                <CheckCircle2 className="text-white w-4 h-4" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price and Button */}
      <div>
        <div className="flex items-end mt-6">
          <span className="text-[60px] font-extrabold text-white leading-none">$</span>
          <span className="text-[110px] font-extrabold text-white leading-none">{price}</span>
        </div>

        <button className="w-full mt-6 h-[40px] bg-gray-300 text-[#1C1C1C] rounded-md text-lg font-medium hover:bg-white transition">
          GET STARTED
        </button>
      </div>
    </motion.div>
  );
}
