"use client";

import Image from "next/image";
import {
  FaEnvelope,
  FaLinkedinIn,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";

function InstagramIcon({ size = 16 }) {
  const gradientId = `instagramGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="25%" stopColor="#fa7e1e" />
          <stop offset="50%" stopColor="#d62976" />
          <stop offset="75%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <path
        d="M7.75 2C4.8 2 2.5 4.3 2.5 7.25v9.5C2.5 19.7 4.8 22 7.75 22h8.5c2.95 0 5.25-2.3 5.25-5.25v-9.5C21.5 4.3 19.2 2 16.25 2h-8.5Zm4.25 5.5A4.5 4.5 0 1 1 7.5 12a4.5 4.5 0 0 1 4.5-4.5Zm5.25-1A.75.75 0 1 1 18 7.25a.75.75 0 0 1-.75-.75Z"
        fill={`url(#${gradientId})`}
      />
      <circle cx="12" cy="12" r="3.5" fill="white" />
    </svg>
  );
}

const socialLinks = [
  { name: "Email", icon: FaEnvelope, href: "mailto:contact@inkaraai.com", color: "white" },
  { name: "LinkedIn", icon: FaLinkedinIn, href: "https://www.instagram.com/inkauraai?utm_source=qr&igsh=NGZ4OG4yd3V4MzFr", color: "#0077B5" },
  { name: "Instagram", icon: InstagramIcon, href: "https://www.instagram.com/inkauraai?utm_source=qr&igsh=NGZ4OG4yd3V4MzFr", color: "white" },
  { name: "Pinterest", icon: FaPinterestP, href: "https://pin.it/2x0rT28yF", color: "#E60023" },
  { name: "Twitter", icon: FaTwitter, href: "https://www.instagram.com/inkauraai?utm_source=qr&igsh=NGZ4OG4yd3V4MzFr", color: "#1DA1F2" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">

      {/* MOBILE */}
      <div className="flex flex-col items-center px-4 pt-4 md:hidden h-screen justify-between">
        
        {/* Logo in top-left */}
        <div className="absolute top-4 left-4 font-medium text-[22px]">
          <span className="text-[#d0fe17]">Ink</span>ara
        </div>

        {/* Heading: Launching (line 1), soon (line 2) */}
        <div className="mt-12 text-center">
          <h1 className="text-[#d0fe17] r-[8px] text-6xl font-medium leading-none">
            Launching
          </h1>
          <h1 className="text-[#d0fe17] r-[8px] text-6xl font-medium leading-none">
            soon
          </h1>
        </div>

        {/* Paragraph */}
        <p className="text-xs leading-tight text-center max-w-xs">
          Thank you for signing up to Inkara AI. We are building AI powered body-arts ecosystem for brands and artists currently focusing on tattoos. We will be launching soon in early September and give early free trial access to brands and artists to use our tattoo try-on feature, which enables them to fast up the process of endless manual tattoo drawing, guess work and much more effort in selection process of which tattoo their customer needs to get inked. Just click your customer's photo of where they want to get inked, upload your design or choose from us and try-on!
          Faster conversion, better decision process, reduced rejection rates, increased catering capacity to more customers! Our team will reach out to you once our doors are open.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {socialLinks.map(({ name, icon: Icon, href, color }, i) => (
            <a
              key={i}
              href={href}
              aria-label={name}
              className="hover:text-[#d0fe17] transition-colors duration-300"
              style={{ color }}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Main Image */}
        <div className="relative w-[160px] h-[160px] rounded-full overflow-hidden mb-4">
          <Image
            src="/comingsoonhero.png"
            alt="Main visual"
            fill
            className="object-cover"
            priority
          />
          {/* Sketch image */}
          <div className="absolute bottom-[-8px] right-[-8px] w-[50px] h-[60px] rounded-[25px] overflow-hidden bg-white">
            <Image
              src="/tattooo.jpg"
              alt="Sketch image"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="absolute top-9 left-[66px] font-medium text-[27px]">
          <span className="text-[#d0fe17]">Ink</span>ara
        </div>

        <div className="absolute top-[130px] left-[66px] max-w-[560px]">
          <h1 className="font-medium text-[#d0fe17]" style={{ fontSize: "80px", lineHeight: "50px" }}>
            Launching <br /> soon
          </h1>

          <p className="mt-4 text-[16px] leading-[28px]">
            Thank you for signing up to Inkara AI. We are building AI powered body-arts ecosystem for brands and artists currently focusing on tattoos. We will be launching soon in early September and give early free trial access to brands and artists to use our tattoo try-on feature, which enables them to fast up the process of endless manual tattoo drawing, guess work and much more effort in selection process of which tattoo their customer needs to get inked. Just click your customer's photo of where they want to get inked, upload your design or choose from us and try-on!
            Faster conversion, better decision process, reduced rejection rates, increased catering capacity to more customers! Our team will reach out to you once our doors are open.
          </p>

          <div className="flex items-center gap-4 mt-8 max-w-full">
            <h2 className="text-[18px] font-semibold whitespace-nowrap">GET SOCIAL</h2>
            <div className="flex-grow h-[1px] bg-white" />
            <div className="flex gap-4 items-center">
              {socialLinks.map(({ name, icon: Icon, href, color }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={name}
                  className="hover:text-[#d0fe17] transition-colors duration-300"
                  style={{ color }}
                >
                  <Icon size={25} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute top-[130px] right-[220px] w-[400px] h-[400px] rounded-full overflow-hidden">
          <Image
            src="/comingsoonhero.png"
            alt="Main visual"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute bottom-[120px] right-[180px] w-[120px] h-[140px] rounded-[60px] overflow-hidden z-10 bg-white">
          <Image
            src="/tattooo.jpg"
            alt="Sketch image"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
