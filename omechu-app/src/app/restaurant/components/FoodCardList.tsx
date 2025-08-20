"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import FoodCard from "@/components/common/FoodCard";
import { Restaurant } from "@/lib/types/restaurant";
import { likePlace, unlikePlace } from "@/mypage/api/favorites";
import { useAuthStore } from "@/lib/stores/auth.store";

interface FoodCardListProps {
  items: Restaurant[];
  onItemClick: (id: number) => void;
}

export default function FoodCardList({
  items,
  onItemClick,
}: FoodCardListProps) {
  const [localItems, setLocalItems] = useState<Restaurant[]>(items);

  const isAuthenticated = useAuthStore((s) =>
    Boolean(s.accessToken && s.refreshToken),
  );

  useEffect(() => {
    setLocalItems(
      (items ?? []).map((it) => ({
        ...it,
        id: Number(it.id), // ✅ id를 항상 number로
        rating: Number(it.rating ?? 0),
      })),
    );
  }, [items]);

  const handleLike = useCallback(
    async (restaurantId: number) => {
      if (isAuthenticated) {
        setLocalItems((prev) =>
          prev.map((it) =>
            it.id === restaurantId ? { ...it, like: true } : it,
          ),
        );

        try {
          await likePlace(restaurantId);
          console.log("like 호출 ID:", restaurantId, typeof restaurantId);
        } catch {
          // 실패 시 롤백
          setLocalItems((prev) =>
            prev.map((it) =>
              it.id === restaurantId ? { ...it, like: false } : it,
            ),
          );
          alert("찜 등록 실패");
        }
      } else {
        alert("로그인이 필요합니다.");
        return;
      }
    },
    [isAuthenticated],
  );

  const handleUnlike = useCallback(
    async (restaurantId: number) => {
      // ✅ 로그인 가드
      if (isAuthenticated) {
        // 낙관적 업데이트
        setLocalItems((prev) =>
          prev.map((it) =>
            it.id === restaurantId ? { ...it, like: false } : it,
          ),
        );

        try {
          await unlikePlace(restaurantId);
          console.log("unlike 호출 ID:", restaurantId, typeof restaurantId);
        } catch {
          // 실패 시 롤백
          setLocalItems((prev) =>
            prev.map((it) =>
              it.id === restaurantId ? { ...it, like: true } : it,
            ),
          );
          alert("찜 해제 실패");
        }
      } else {
        alert("로그인이 필요합니다.");
        return;
      }
    },
    [isAuthenticated],
  );

  // 불필요한 재생성 방지
  const rendered = useMemo(
    () =>
      localItems.map((item) => (
        <FoodCard
          key={item.id}
          item={item}
          onClick={() => onItemClick(item.id)}
          onLike={() => handleLike(item.id)}
          onUnlike={() => handleUnlike(item.id)}
          isAuthenticated={isAuthenticated}
          onRequireLogin={() => alert("로그인이 필요합니다.")}
        />
      )),
    [localItems, onItemClick, handleLike, handleUnlike, isAuthenticated],
  );

  return <div className="flex flex-col gap-4">{rendered}</div>;
}
