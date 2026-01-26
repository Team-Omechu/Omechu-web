import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "오메추 - 오늘 뭐 먹지?",
    short_name: "오메추",
    description: "개인화된 메뉴 및 맛집 추천 서비스",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FF6B35",
    orientation: "portrait",
    icons: [
      {
        src: "/logo/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
