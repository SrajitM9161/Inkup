'use client';

import { motion } from 'framer-motion';
import GetStartedButton from '../components/GetStartedButton';
import Card from '../components/Card';

const cardData = [
  { id: 1, offsetX: 280, offsetY: -30, rotate: 9.6, img: '/tattoos/tattoo6.jpg' },
  { id: 2, offsetX: 140, offsetY: -25, rotate: 6, img: '/tattoos/tattoo5.jpg' },
  { id: 3, offsetX: 0, offsetY: -18, rotate: 3, img: '/tattoos/tattoo4.jpg' },
  { id: 4, offsetX: -150, offsetY: -18, rotate: -3, img: '/tattoos/tattoo3.jpg' },
  { id: 5, offsetX: -280, offsetY: -25, rotate: -6, img: '/tattoos/tattoo2.jpg' },
  { id: 6, offsetX: -420, offsetY: -30, rotate: -9.6, img: '/tattoos/tattoo1.jpg' },
];




export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full bg-[#0D0D0D] overflow-hidden font-['Roboto'] bg-dot-pattern">
      {/* Logo */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute top-[22px] left-[70px] text-white text-[28px] font-['Playball']"
      >
        Logo
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6, ease: 'easeOut' }}
        className="absolute top-[90px] left-1/2 transform -translate-x-1/2 text-white font-black text-[48px] leading-[59px] text-center font-['Roboto_Serif']"
      >
        Visualize your next
        <span className="inline-block w-[57px] h-[39px] bg-[#DD1E61] mx-2 align-middle"></span>
        tattoo
        <br />
        AI generated
      </motion.div>

      {/* Cards */}
      {cardData.map((card, i) => (
        <Card key={card.id} {...card} index={i} />
      ))}

      {/* Animated Get Started Button */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.6, ease: 'easeOut' }}
      >
        <GetStartedButton />
      </motion.div>

    {[
  {
    size: 18,
    top: 50,
    left: 400,
    delay: 2.0,
    gradient: 'linear-gradient(to bottom, #149FA9, #2ADBC1, #737373)',
  },
  {
    size: 28,
    top: 200,
    left: 200,
    delay: 2.1,
    gradient: 'linear-gradient(to bottom, #E5487F, #DD1E61, #737373)',
  },
  {
    size: 26,
    top: 68,
    left: 1110,
    delay: 2.2,
    gradient: 'linear-gradient(to bottom, #FA9814, rgba(250,152,20,0.92), #737373)', 
  },
  {
    size: 18,
    top: 230,
    left: 1180,
    delay: 2.3,
    gradient: 'linear-gradient(to bottom, #149FA9, #2ADBC1, #737373)', 
  },
].map((dot, i) => (
  <motion.div
    key={i}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: dot.delay, duration: 0.6 }}
    className="absolute rounded-full"
    style={{
      width: `${dot.size}px`,
      height: `${dot.size}px`,
      top: `${dot.top}px`,
      left: `${dot.left}px`,
      background: dot.gradient,
    }}
  />
))}
    </main>
  );
}
