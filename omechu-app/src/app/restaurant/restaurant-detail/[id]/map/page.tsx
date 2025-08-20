"use client";

import { useEffect, useState, useCallback } from "react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import RestaurantDetailHeader from "@/restaurant/restaurant-detail/[id]/components/RestaurantDetailHeader";
import { getRestaurantDetail } from "@/restaurant/api/restaurantList";

import RestaurantMapPreview from "./components/RestaurantMapPreview";
import { RestaurantDetail } from "@/lib/types/restaurant";
import {
  fetchGooglePlaceInfo,
  fetchLatLngFromAddress,
} from "../api/googlePlaceInfo";

// ✅ 찜 API & 로그인 상태
import { likePlace, unlikePlace } from "@/mypage/api/favorites";
import { useAuthStore } from "@/lib/stores/auth.store";

export default function MapPage() {
  const router = useRouter();

  // URL의 [id] 동적 라우팅 파라미터 가져오기 (예: /restaurant-detail/1/map)
  const params = useParams();

  // 문자열로 들어온 id를 숫자로 변환
  const id = Number((params as { id: string }).id);

  // id에 해당하는 맛집 데이터 찾기
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);

  // 좋아요 상태 관리: 상세 정보의 zzim으로 초기화
  const [isLiked, setIsLiked] = useState(false);
  const [heartBusy, setHeartBusy] = useState(false);

  const isAuthenticated = useAuthStore((s) =>
    Boolean(s.accessToken && s.refreshToken),
  );

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    getRestaurantDetail(id)
      .then((res) => {
        setRestaurant(res);
        setIsLiked(Boolean(res.zzim)); // ✅ 서버 상태로 초기화
        // 위치 정보
        if (res.googlePlaceId) {
          fetchGooglePlaceInfo(res.googlePlaceId).then((info) =>
            setLocation(info?.location ?? null),
          );
        } else if (res.address) {
          fetchLatLngFromAddress(res.address).then((info) =>
            setLocation(info?.location ?? null),
          );
        }
      })
      .catch((err) => {
        console.error("맛집 정보 불러오기 실패:", err);
      });
  }, [id]);

  // ✅ 좋아요 토글 (로그인 가드 + 낙관적 업데이트 + 롤백)
  const handleLikeClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!restaurant || heartBusy) return;

      // 로그인 가드: 비로그인 시 UI 변경 없이 리턴
      if (!isAuthenticated) {
        alert("로그인이 필요합니다.");
        return;
      }

      setHeartBusy(true);
      const next = !isLiked;
      setIsLiked(next); // 낙관적 업데이트
      // (선택) 레스토랑 객체에도 동기화
      setRestaurant((prev) => (prev ? { ...prev, zzim: next } : prev));

      try {
        if (next) {
          await likePlace(restaurant.id);
        } else {
          await unlikePlace(restaurant.id);
        }
      } catch (err) {
        console.error("찜 토글 실패:", err);
        // 실패 롤백
        setIsLiked(!next);
        setRestaurant((prev) =>
          prev ? ({ ...prev, zzim: !next } as any) : prev,
        );
        alert(next ? "찜 등록 실패" : "찜 해제 실패");
      } finally {
        setHeartBusy(false);
      }
    },
    [restaurant, isLiked, isAuthenticated, heartBusy],
  );

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
          onLikeClick={handleLikeClick} // ✅ 연동
          // 필요하다면 heartBusy를 내려서 버튼 디스에이블/로딩표시 가능
        />

        {/* 지도 이미지 영역 */}
        {location ? (
          <RestaurantMapPreview
            latitude={location.latitude}
            longitude={location.longitude}
            name={restaurant.name}
            className="h-[20rem] w-[21rem]"
          />
        ) : (
          <p className="mt-10 text-gray-500">지도 정보를 불러오는 중...</p>
        )}
      </main>
    </>
  );
}
