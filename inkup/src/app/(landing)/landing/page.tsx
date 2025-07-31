"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaMailBulk,FaLinkedin,FaInstagram } from "react-icons/fa";

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
    const observer = new IntersectionObserver(
      ([entry]) => setShowFooter(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (triggerRef.current) observer.observe(triggerRef.current);
    return () => {
      if (triggerRef.current) observer.unobserve(triggerRef.current);
    };
  }, []);

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="relative w-full min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-start">
      <div className="w-full max-w-[1440px] flex flex-col items-center">
        {/* ========== Mobile View ========== */}
        <div className="w-full px-6 pt-6 lg:hidden flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-4"
          >
            <Image src="/logoinkara.png" alt="Logo" width={90} height={10} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-center mb-6"
          >
            <h1 className="text-[36px] font-semibold leading-tight">
              Try before you imagine
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Virtual AI tryons for body arts for brands
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full h-[350px] relative mb-6"
          >
            <Image
              src={images[current].src}
              alt={images[current].alt}
              fill
              className="object-contain transition-all duration-700 ease-in-out"
            />
          </motion.div>

          <div className="flex flex-col gap-4 w-full">
            <button
              className="cursor-pointer bg-[#d0fe17] text-black h-[40px] rounded-full font-bold transition hover:scale-[1.01]"
              onClick={onOpenModal}
            >
              Get Started
            </button>
            <button
              onClick={scrollToFooter}
              className="cursor-pointer border border-[#d0fe17] text-[#d0fe17] h-[40px] rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              Contact us
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.4977 6.79778C14.5241 6.5229 14.3226 6.2787 14.0477 6.25234L9.56827 5.8228C9.29339 5.79645 9.04919 5.99791 9.02283 6.2728C8.99647 6.54768 9.19794 6.79188 9.47282 6.81824L13.4546 7.20005L13.0727 11.1818C13.0464 11.4567 13.2479 11.7009 13.5227 11.7272C13.7976 11.7536 14.0418 11.5521 14.0682 11.2772L14.4977 6.79778Z"
                  fill="#D0FE17"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ========== Desktop View ========== */}
        <div className="hidden lg:flex flex-col items-center w-full">
          <motion.div
            className="w-full flex justify-start py-3 px-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <Image src="/logoinkara.png" alt="Logo" width={90} height={10} />
          </motion.div>

          <div className="w-full flex flex-col lg:flex-row justify-between items-start px-8 gap-1 lg:gap-[1px]">
            <motion.div
              className="w-full lg:w-[360px] h-[600px] relative overflow-hidden"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
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
              transition={{ delay: 2.3, duration: 0.7 }}
            >
              <div className="px-1 mb-6 text-white">
                <div className="font-medium text-[50px] leading-[1.2]">
                  <h1>Try before you imagine</h1>
                  <div className="flex items-end">
                    <span>your body art</span>
                    <span className="text-sm font-light text-[17px] text-gray-400 ml-7">
                      Virtual AI tryons for body
                      <br /> arts for brands
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 w-full px-1 max-w-[590px]">
                <button
                  className="bg-[#d0fe17] text-black h-[35px] rounded-full font-bold transition hover:scale-[1.01] w-full"
                  onClick={onOpenModal}
                >
                  Get Started
                </button>

                <button
                  onClick={scrollToFooter}
                  className="border border-[#d0fe17] text-[#d0fe17] h-[35px] rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                  Contact us
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.4977 6.79778C14.5241 6.5229 14.3226 6.2787 14.0477 6.25234L9.56827 5.8228C9.29339 5.79645 9.04919 5.99791 9.02283 6.2728C8.99647 6.54768 9.19794 6.79188 9.47282 6.81824L13.4546 7.20005L13.0727 11.1818C13.0464 11.4567 13.2479 11.7009 13.5227 11.7272C13.7976 11.7536 14.0418 11.5521 14.0682 11.2772L14.4977 6.79778Z"
                      fill="#D0FE17"
                    />
                  </svg>
                </button>
              </div>

              <motion.div
                className="w-full relative h-[350px] mt-6 overflow-hidden"
                initial={{ opacity: 0, y: -100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
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
              className="w-full lg:w-[360px] h-[630px] relative overflow-hidden"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
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

        {/* Trigger div for observer */}
     <div ref={triggerRef} className="w-full h-0" />

         {/* Footer */}
        <motion.footer
          ref={footerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: showFooter ? 1 : 0, y: showFooter ? 0 : 50 }}
          transition={{ duration: 0.6 }}
          className="w-full bg-black text-white px-4 py-6 border-t border-gray-800 mt-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h2 className="text-[#d0fe17] text-xl font-semibold mb-2">About</h2>
              <p className="text-sm text-gray-300 max-w-md">
                We create experience which speak art in depth to make a perfect ink decision.
              </p>
            </div>

            <div className="flex-1">
              <h2 className="text-[#d0fe17] text-xl font-semibold mb-2">Contact Us</h2>
              <ul className="text-sm text-gray-300 space-y-3">
                <li className="flex items-center gap-2">
                  <FaMailBulk/>
                  <a href="mailto:contact@inkaraai.com" className="hover:underline">
                    contact@inkaraai.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                 <FaInstagram/>
                  <a
                    href="https://instagram.com/inkaraai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Instagram
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <FaLinkedin/>
                  <a
                    href="https://linkedin.com/company/inkaraai"
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
