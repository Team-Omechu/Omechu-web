/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import { Restaurant } from "@/lib/types/restaurant";

type FoodCardProps = {
  item: Restaurant;
  onClick: () => void;
  onLike?: () => void;
  onUnlike?: () => void;
};

type ServerRestaurant = {
  id: string | number;
  name?: string | null;
  address?: string | null;
  rating?: number | null;
  representativeMenus?: string[]; // 혹은 서버 필드에 맞춰 수정
  rest_image?: string | null;
  isLiked?: boolean; // 서버가 주면 사용, 없으면 false로
};

// 서버 응답 → Restaurant 로 변환
export function normalizeRestaurant(s: ServerRestaurant): Restaurant {
  return {
    id: Number(s.id),
    name: s.name ?? "-",
    address: s.address ?? "", // ← 문자열
    rating: s.rating ?? 0,
    images: s.rest_image ? [s.rest_image] : [],
    rest_tag: [],
    menus: s.representativeMenus ?? [],
    like: Boolean(s.isLiked),
    reviews: 0,
  };
}

const normalizeIsLiked = (value: boolean | undefined | null): boolean => {
  return Boolean(value);
};

export default function FoodCard({
  item,
  onClick,
  onLike,
  onUnlike,
}: FoodCardProps) {
  const [isLiked, setIsLiked] = useState(normalizeIsLiked(item.like));
  const [heartBusy, setHeartBusy] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (heartBusy) return;

    setHeartBusy(true);
    const next = !isLiked;
    setIsLiked(next); // 낙관적 UI

    try {
      if (next) {
        await onLike?.(); // 부모에서 API 호출
      } else {
        await onUnlike?.();
      }
    } catch (err) {
      // 실패시 롤백
      setIsLiked(!next);
      // 필요하면 토스트는 부모에서 띄우는 걸 추천
    } finally {
      setHeartBusy(false);
    }
  };

  useEffect(() => {
    setIsLiked(Boolean(item.like));
  }, [item.like]);

  return (
    <div
      className="flex items-start justify-between rounded-xl border border-grey-darkHover bg-white p-3 shadow-md"
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{item.name}</span>
          <span className="flex items-center gap-1 text-xs font-normal text-yellow-500">
            ⭐ {item.rating}
            {item.reviews !== undefined && (
              <span className="text-yellow-500">({item.reviews})</span>
            )}
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-500">{item.address}</p>
        {item.menus && (
          <p className="mb-1 text-sm font-bold text-blue-600">
            {item.menus[0]}
          </p>
        )}

        <div className="mt-1 flex flex-wrap gap-2 text-xs">
          {item.rest_tag?.map((tag: { tag: string }, i: number) => (
            <span
              key={i}
              className="rounded-full border border-blue-400 px-2 py-0.5 text-blue-400"
            >
              {tag.tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col place-items-end gap-2">
        <button onClick={handleLikeClick}>
          <img
            src={isLiked ? "/heart/heart_filled.svg" : "/heart/heart_empty.svg"}
            alt="하트"
            className="h-5 w-5"
          />
        </button>
        <img
          src={
            item.images?.[0] ||
            `https://places.googleapis.com/v1/${item.name}/media?maxWidthPx=800&key=${process.env.GOOGLE_MAPS_API_KEY}`
          }
          alt={item.menus[0] ?? "음식"}
          className="h-[4.5rem] w-[4.5rem] rounded-sm border border-grey-darkHover object-cover"
        />
      </div>
    </div>
  );
}
