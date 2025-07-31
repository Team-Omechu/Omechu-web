import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
  images: {
    domains: ["s3.amazonaws.com"],
  },
};

export default nextConfig;
