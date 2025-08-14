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
  /** 내 주변 반경 (km). 없거나 0이면 원 그리지 않음 */
  radiusKm?: number;
}

export default function KakaoMap({
  latitude,
  longitude,
  name,
  radiusKm,
}: KakaoMapProps) {
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

        const center = new window.kakao.maps.LatLng(latitude, longitude);

        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 3,
        });

        const marker = new window.kakao.maps.Marker({
          position: center,
          map,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:6px;font-size:14px;">${name}</div>`,
        });
        infowindow.open(map, marker);

        // ✅ 반경 원 (옵션)
        if (radiusKm && radiusKm > 0) {
          const circle = new window.kakao.maps.Circle({
            center,
            radius: radiusKm * 1000, // km → m
            strokeWeight: 2,
            strokeColor: "#3b82f6",
            strokeOpacity: 0.9,
            strokeStyle: "solid",
            fillColor: "#3b82f6",
            fillOpacity: 0.15,
          });
          circle.setMap(map);

          // 원 전체가 보이게 지도 영역 조정
          if (typeof circle.getBounds === "function") {
            map.setBounds(circle.getBounds());
          }
        }
      });
    };
  }, [latitude, longitude, name, radiusKm]); // ← 반경 변경 시에도 다시 그림

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
}
