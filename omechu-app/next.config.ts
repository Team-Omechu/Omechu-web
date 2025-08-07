import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
  images: {
    domains: [
      "omechu-s3-bucket.s3.ap-northeast-2.amazonaws.com",
      "s3.amazonaws.com",
    ],
  },
};

export default nextConfig;
