"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import { Restaurants } from "@/constant/restaurant/restaurantList";
import RestaurantDetailHeader from "@/restaurant/restaurant-detail/[id]/components/RestaurantDetailHeader";

import RestaurantMapPreview from "./components/RestaurantMapPreview";
import { fetchGooglePlaceInfo } from "../api/googlePlaceInfo";

export default function MapPage() {
  const router = useRouter();

  // URL의 [id] 동적 라우팅 파라미터 가져오기 (예: /restaurant-detail/1/map)
  const params = useParams();

  // 문자열로 들어온 id를 숫자로 변환
  const id = Number((params as { id: string }).id);

  // id에 해당하는 맛집 데이터 찾기
  const restaurant = Restaurants.find((r) => r.id === id);

  // 좋아요 상태 관리 (임시로 하트 클릭 시 토글)
  const [isLiked, setIsLiked] = useState(false);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // 하트 클릭 시 좋아요 상태 토글
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  useEffect(() => {
    if (!restaurant) return;
    if (!restaurant.GooglePlaceId) return;

    fetchGooglePlaceInfo(restaurant.GooglePlaceId)
      .then((res) => setLocation(res.location))
      .catch((err) => {
        console.error("위치 정보를 불러오는 데 실패했습니다:", err);
      });
  }, [restaurant]);

  // 해당 id의 맛집이 없을 경우 예외 처리 (간단한 메시지)
  if (!restaurant) {
    return (
      <main className="flex max-h-screen items-center justify-center">
        <p className="text-gray-500">존재하지 않는 맛집입니다.</p>
      </main>
    );
  }

  return (
    <>
      <Header
        className="border-none"
        title=""
        leftChild={
          <button onClick={() => router.back()}>
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt="뒤로가기"
              width={22}
              height={30}
            />
          </button>
        }
      />

      <main className="flex h-[calc(100dvh-3.1rem)] w-full flex-col items-center">
        <RestaurantDetailHeader
          name={restaurant.name}
          isLiked={isLiked}
          onLikeClick={handleLikeClick}
        />

        {/* 지도 이미지 영역 */}
        {location ? (
          <RestaurantMapPreview
            latitude={location.latitude}
            longitude={location.longitude}
            name={restaurant.name}
          />
        ) : (
          <p className="mt-10 text-gray-500">지도 정보를 불러오는 중...</p>
        )}
      </main>
    </>
  );
}
