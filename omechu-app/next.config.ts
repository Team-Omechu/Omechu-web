import type { NextConfig } from "next";

type WebpackRule = {
  test?: RegExp;
  issuer?: unknown;
  resourceQuery?: RegExp | { not?: unknown };
  exclude?: RegExp;
  use?: unknown;
};

type WebpackConfig = {
  module?: {
    rules?: WebpackRule[];
  };
};

const nextConfig: NextConfig = {
  // Next.js 16+ uses Turbopack by default.
  // If you have a custom webpack config, you must either:
  // 1) migrate it to `turbopack`, or
  // 2) force webpack build via `next build --webpack`.
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
      "*.svg?url": {
        loaders: ["file-loader"],
        as: "*.js",
      },
    },
  },

  // Keep webpack config for environments that still run with webpack.
  // (e.g. `next build --webpack`)
  webpack: (config: WebpackConfig) => {
    const rules = config.module?.rules;
    if (!Array.isArray(rules)) return config;

    // Find the existing asset/file loader rule handling svg.
    // This structure can vary between Next versions, so keep it defensive.
    const fileLoaderRule = rules.find((rule) => rule.test?.test?.(".svg"));

    if (!fileLoaderRule) {
      throw new Error(
        "[next.config] Failed to locate the existing file loader rule for SVG.",
      );
    }

    const resourceQueryNot =
      typeof fileLoaderRule.resourceQuery === "object" &&
      fileLoaderRule.resourceQuery !== null &&
      "not" in fileLoaderRule.resourceQuery
        ? (fileLoaderRule.resourceQuery as { not?: unknown }).not
        : undefined;
    const notArray = Array.isArray(resourceQueryNot) ? resourceQueryNot : [];

    rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...notArray, /url/] },
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              typescript: true,
              ext: "tsx",
            },
          },
        ],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "omechu-s3-bucket.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
