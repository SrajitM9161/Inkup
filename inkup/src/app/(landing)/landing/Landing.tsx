"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaMailBulk, FaLinkedin, FaInstagram } from "react-icons/fa";

const images = [
  { src: "/left.png", alt: "Left Tattoo" },
  { src: "/hrizontal.png", alt: "Center Tattoo" },
  { src: "/right.png", alt: "Right Tattoo" },
];

type HomePageProps = {
  onOpenModal: () => void;
};

export default function HomePage({ onOpenModal }: HomePageProps) {
  const [current, setCurrent] = useState(0);
  const [showFooter, setShowFooter] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

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
  }, []);

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="relative w-full min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-start">
      <div className="w-full max-w-[1440px] flex flex-col items-center">

        {/* === MOBILE + TABLET === */}
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
                Try before you imagine<br />
                <span className="text-[20px] md:text-[24px] font-medium">your body art</span>
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Virtual AI tryons of body arts for brands
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
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path
                  d="M14.4977 6.79778C14.5241 6.5229 14.3226 6.2787 14.0477 6.25234L9.56827 5.8228C9.29339 5.79645 9.04919 5.99791 9.02283 6.2728C8.99647 6.54768 9.19794 6.79188 9.47282 6.81824L13.4546 7.20005L13.0727 11.1818C13.0464 11.4567 13.2479 11.7009 13.5227 11.7272C13.7976 11.7536 14.0418 11.5521 14.0682 11.2772L14.4977 6.79778Z"
                  fill="#D0FE17"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* === DESKTOP === */}
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
                <h1 className="font-medium text-[48px] leading-[1.2]">Try before you imagine</h1>
                <div className="flex flex-col md:flex-row justify-center items-center text-center gap-2 mt-2">
                  <span className="text-[28px]">your body art</span>
                  <span className="text-sm text-gray-400">
                    Virtual AI tryons for body arts for brands
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

        {/* Scroll Observer Trigger */}
        <div ref={triggerRef} className="w-full h-0" />

        {/* Footer */}
        <motion.footer
          ref={footerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: showFooter ? 1 : 0, y: showFooter ? 0 : 50 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-black text-white px-4 py-6 border-t border-gray-800 mt-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h2 className="text-[#d0fe17] text-xl font-semibold mb-2">About</h2>
              <p className="text-sm text-gray-300 max-w-md">
                We create experiences which speak art in depth to make a perfect ink decision.
              </p>
            </div>

            <div className="flex-1">
              <h2 className="text-[#d0fe17] text-xl font-semibold mb-2">Contact Us</h2>
              <ul className="text-sm text-gray-300 space-y-3">
                <li className="flex items-center gap-2">
                  <FaMailBulk />
                  <a href="mailto:contact@inkaraai.com" className="hover:underline">
                    contact@inkaraai.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaInstagram />
                  <a
                    href="https://www.instagram.com/inkauraai?utm_source=qr&igsh=NGZ4OG4yd3V4MzFr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Instagram
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaLinkedin />
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}
