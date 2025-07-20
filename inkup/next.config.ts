// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.dog.ceo'], // ✅ Add this line
  },
};

module.exports = nextConfig;
