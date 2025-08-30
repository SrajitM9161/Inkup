'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const images = [
  { src: "/left.png", alt: "Left Tattoo" },
  { src: "/hrizontal.png", alt: "Center Tattoo" },
  { src: "/right.png", alt: "Right Tattoo" },
];

type HomePageProps = {
  onOpenModal: () => void;
  setShowFooter: (show: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  footerRef: React.RefObject<HTMLDivElement | null>;
};

export default function HomePage({
  onOpenModal,
  setShowFooter,
  triggerRef,
  footerRef,
}: HomePageProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = triggerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowFooter(entry.isIntersecting),
      { threshold: 0.3 }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [triggerRef, setShowFooter]);

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main
      className="relative w-full bg-black text-white overflow-hidden flex flex-col items-center justify-start flex-grow"
    >
      <div className="w-full max-w-[1440px] flex flex-col items-center">

        {/* MOBILE + TABLET */}
        <div className="w-full px-6 pt-6 flex flex-col lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-4 self-start"
          >
            <Image src="/logoinkara.png" alt="Logo" width={90} height={10} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-6"
          >
            <div className="text-left">
              <h1 className="text-[24px] md:text-[28px] font-semibold leading-snug">
                Try before you imagine
                <br />
                <span className="text-[20px] md:text-[24px] font-medium">
                  your body art
                </span>
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Virtual AI tryons of body arts for brand
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full h-[300px] md:h-[400px] relative mb-6"
          >
            <Image
              src={images[current].src}
              alt={images[current].alt}
              fill
              className="object-contain transition-all duration-500 ease-in-out"
            />
          </motion.div>

          <div className="flex flex-col gap-4 w-full">
            <button
              className="bg-[#d0fe17] text-black h-[40px] rounded-full font-bold hover:scale-105 transition"
              onClick={onOpenModal}
            >
              Get Started
            </button>
            <button
              onClick={scrollToFooter}
              className="border border-[#d0fe17] text-[#d0fe17] h-[40px] rounded-full font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              Contact us
            </button>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:flex flex-col items-center w-full">
          <motion.div
            className="w-full flex justify-start py-3 px-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Image src="/logoinkara.png" alt="Logo" width={90} height={10} />
          </motion.div>

          <div className="w-full flex flex-col lg:flex-row justify-between items-start px-8 gap-6">
            <motion.div
              className="w-full lg:w-[360px] h-[600px] relative overflow-hidden"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Image
                src={images[0].src}
                alt={images[0].alt}
                fill
                className="object-fill mt-10"
                style={{ top: "-50px" }}
              />
            </motion.div>

            <motion.div
              className="flex flex-col items-center justify-start w-full max-w-[540px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="px-1 mb-6 text-white text-center">
                <h1 className="font-medium text-[48px] leading-[1.2]">
                  Try before you imagine
                </h1>
                <div className="flex flex-col md:flex-row justify-center items-center text-center gap-2 mt-2">
                  <span className="text-[28px]">your body art</span>
                  <span className="text-sm text-gray-400">
                    Virtual AI tryons of body arts for brand
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full px-1">
                <button
                  className="bg-[#d0fe17] text-black h-[35px] rounded-full font-bold hover:scale-105 transition"
                  onClick={onOpenModal}
                >
                  Get Started
                </button>
                <button
                  onClick={scrollToFooter}
                  className="border border-[#d0fe17] text-[#d0fe17] h-[35px] rounded-full font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                  Contact us
                </button>
              </div>

              <motion.div
                className="w-full relative h-[350px] mt-6 overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Image
                  src={images[1].src}
                  alt={images[1].alt}
                  fill
                  className="object-contain"
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="w-full lg:w-[360px] h-[600px] relative overflow-hidden"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Image
                src={images[2].src}
                alt={images[2].alt}
                fill
                className="object-fill mt-3"
                style={{ top: "-50px" }}
              />
            </motion.div>
          </div>
        </div>

        <div ref={triggerRef} className="w-full h-0" />
      </div>
    </main>
  );
}
