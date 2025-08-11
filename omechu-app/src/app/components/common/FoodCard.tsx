/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import { RestaurantType } from "@/constant/restaurant/restaurantList";

type FoodCardProps = {
  item: RestaurantType; // 타입은 foodItems 데이터 구조에 맞게 정의
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

export function normalizeRestaurant(s: ServerRestaurant): RestaurantType {
  return {
    id: Number(s.id),
    name: s.name ?? "-",
    rating: s.rating ?? 0,
    reviews: 0, // 서버에서 오면 바꿔 넣기
    isLiked: Boolean(s.isLiked), // 없으면 false
    menu: (s.representativeMenus?.[0] ?? "").toString(),
    tags: [], // 서버 제공 시 매핑
    images: s.rest_image ? [s.rest_image] : [],
    address: {
      road: s.address ?? "",
      jibun: "",
      postalCode: "",
    },
    timetable: [], // 서버 제공 시 매핑
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
  const [isLiked, setIsLiked] = useState(normalizeIsLiked(item.isLiked));
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
    setIsLiked(Boolean(item.isLiked));
  }, [item.isLiked]);

  return (
    <div
      className="flex items-start justify-between rounded-xl border border-black bg-white p-3 shadow-md"
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{item.name}</span>
          <span className="flex items-center gap-1 text-xs font-normal text-yellow-500">
            ⭐ {item.rating}
            <span className="text-yellow-500">({item.reviews})</span>
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-500">{item.address.road}</p>
        <p className="mb-1 text-sm font-bold text-blue-600">{item.menu}</p>
        <div className="mt-1 flex flex-wrap gap-2 text-xs">
          {(item.tags ?? []).map((tag, i) => (
            <span
              key={i}
              className="rounded-full border border-blue-400 px-2 py-0.5 text-blue-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col place-items-end gap-2">
        <button onClick={handleLikeClick}>
          <img
            src={isLiked ? "/heart/heart_filled.svg" : "/heart/heart_empty.svg"}
            alt="하트"
            width={20}
            height={20}
          />
        </button>
        <img
          src={item.images?.[0] || "/logo/logo.png"}
          alt={item.menu}
          width={70}
          height={70}
          className="h-[4.5rem] w-[4.5rem] rounded-sm border border-gray-200 object-contain"
        />
      </div>
    </div>
  );
}
