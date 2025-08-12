import {
  FaMailBulk,
  FaLinkedin,
  FaInstagram,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";

type FooterProps = {
  showFooter: boolean;
  footerRef: React.RefObject<HTMLDivElement | null>;
};

// Social media icons without labels
const socialLinks = [
  {
    href: "https://www.instagram.com/inkauraai",
    icon: FaInstagram,
    color: "#E1306C",
  },
  {
    href: "https://linkedin.com/in/yourprofile",
    icon: FaLinkedin,
    color: "#0077B5",
  },
  {
    href: "https://www.pinterest.com/yourprofile",
    icon: FaPinterest,
    color: "#BD081C",
  },
  {
    href: "https://twitter.com/yourprofile",
    icon: FaTwitter,
    color: "#1DA1F2",
  },
];

export default function Footer({ showFooter, footerRef }: FooterProps) {
  return (
    <footer
      ref={footerRef}
      className="w-full bg-black px-4 py-6 border-t border-gray-800"
      style={{ opacity: showFooter ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-6 text-white">
        {/* About */}
        <div className="flex-1">
          <h2 className="text-[#d0fe17] text-xl font-semibold mb-2">About</h2>
          <p className="text-sm max-w-md">
            We create experiences which speak art in depth to make a perfect ink decision.
          </p>
        </div>

        {/* Contact */}
        <div className="flex-1">
          <h2 className="text-[#d0fe17] text-xl font-semibold mb-2">Contact Us</h2>
          <ul className="flex flex-wrap gap-4 items-center text-white">
            {/* Email (with label) */}
            <li className="flex items-center gap-2">
              <FaMailBulk className="text-xl" style={{ color: "#EA4335" }} />
              <a
                href="mailto:contact@inkaraai.com"
                className="hover:underline text-sm"
              >
                contact@inkaraai.com
              </a>
            </li>

            {/* Other social icons only */}
            {socialLinks.map(({ href, icon: Icon, color }, index) => (
              <li key={index}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <Icon className="text-xl" style={{ color }} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
