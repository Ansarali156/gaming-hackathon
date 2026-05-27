/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'incuxai.com',
      },
      {
        protocol: 'https',
        hostname: 'www.incuxai.com',
      },
      {
        protocol: 'https',
        hostname: 'www.collegecircle.cc',
      },
    ],
  },
};

export default nextConfig;
