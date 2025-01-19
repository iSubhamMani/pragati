import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: [
      "res.cloudinary.com",
      "ipfs.io",
      "gateway.pinata.cloud",
      "github.com",
    ],
  },
};

export default nextConfig;
