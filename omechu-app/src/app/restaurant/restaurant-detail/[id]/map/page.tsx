"use client";

import { useState } from "react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import RestaurantMapPreview from "@/components/restaurant/restaurant-detail/map/RestaurantMapPreview";
import RestaurantDetailHeader from "@/components/restaurant/restaurant-detail/RestaurantDetailHeader";
import { Restaurants } from "@/constant/restaurant/restaurantList";

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

  // 하트 클릭 시 좋아요 상태 토글
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  // 해당 id의 맛집이 없을 경우 예외 처리 (간단한 메시지)
  if (!restaurant) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-gray-500">존재하지 않는 맛집입니다.</p>
      </main>
    );
  }

  // 임시로 사용 중인 지도 이미지 (추후 동적으로 처리 예정이면 여기에 조건문 넣기)
  const mapImagePath = "/restaurant/오레노라멘합정.png";

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

      <main className="flex h-full w-full flex-col items-center">
        <RestaurantDetailHeader
          name={restaurant.name}
          isLiked={isLiked}
          onLikeClick={handleLikeClick}
        />

        {/* 지도 이미지 영역 */}
        <RestaurantMapPreview
          mapImagePath={mapImagePath}
          restaurantName={restaurant.name}
        />
      </main>
    </>
  );
}
