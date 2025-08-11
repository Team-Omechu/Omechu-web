"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

export default function KakaoMap({ latitude, longitude, name }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY) {
      console.error("KAKAO MAP JS KEY is missing");
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        });

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(latitude, longitude),
          map,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:6px;font-size:14px;">${name}</div>`,
        });

        infowindow.open(map, marker);
      });
    };
  }, [latitude, longitude, name]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
}
