"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import FoodCard from "@/components/common/FoodCard";
import { Restaurant } from "@/lib/types/restaurant";
import { likePlace, unlikePlace } from "@/mypage/api/favorites";

interface FoodCardListProps {
  items: Restaurant[];
  onItemClick: (id: number) => void;
}

export default function FoodCardList({
  items,
  onItemClick,
}: FoodCardListProps) {
  const [localItems, setLocalItems] = useState<Restaurant[]>(items);

  // 부모가 새로운 items를 주면 동기화 (무한 스크롤에서 중요)
  useEffect(() => {
    setLocalItems(
      (items ?? []).map((it) => ({
        ...it,
        id: Number(it.id), // ✅ id를 항상 number로
        rating: Number(it.rating ?? 0),
      })),
    );
  }, [items]);

  const handleLike = useCallback(async (restaurantId: number) => {
    setLocalItems((prev) =>
      prev.map((it) => (it.id === restaurantId ? { ...it, like: true } : it)),
    );
    try {
      await likePlace(restaurantId);
      console.log("like 호출 ID:", restaurantId, typeof restaurantId);
    } catch {
      setLocalItems((prev) =>
        prev.map((it) =>
          it.id === restaurantId ? { ...it, like: false } : it,
        ),
      );
      alert("찜 등록 실패");
    }
  }, []);

  const handleUnlike = useCallback(async (restaurantId: number) => {
    setLocalItems((prev) =>
      prev.map((it) => (it.id === restaurantId ? { ...it, like: false } : it)),
    );
    try {
      await unlikePlace(restaurantId);
      console.log("unlike 호출 ID:", restaurantId, typeof restaurantId);
    } catch {
      setLocalItems((prev) =>
        prev.map((it) => (it.id === restaurantId ? { ...it, like: true } : it)),
      );
      alert("찜 해제 실패");
    }
  }, []);

  // 불필요한 재생성 방지
  const rendered = useMemo(
    () =>
      localItems.map((item) => (
        <FoodCard
          key={item.id} // ✅ index 대신 안정적인 key
          item={item}
          onClick={() => onItemClick(item.id)}
          onLike={() => handleLike(item.id)}
          onUnlike={() => handleUnlike(item.id)}
        />
      )),
    [localItems, onItemClick, handleLike, handleUnlike],
  );

  return <div className="flex flex-col gap-4">{rendered}</div>;
}
