/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Restaurant } from "@/lib/types/restaurant";

type FoodCardProps = {
  item: Restaurant;
  onClick: () => void;
  onLike?: () => Promise<boolean | void> | boolean | void; // 성공 시 true/void, 실패·차단 시 false를 반환할 수 있게
  onUnlike?: () => Promise<boolean | void> | boolean | void;
  // ✅ 로그인 가드용
  isAuthenticated?: boolean; // 기본값 false로 보고 가드
  onRequireLogin?: () => void; // 비로그인 시 호출(모달/리다이렉트 등)
};

type ServerRestaurant = {
  id: string | number;
  name?: string | null;
  address?: string | null;
  rating?: number | null;
  google_place_id?: string;
  representativeMenus?: string[];
  rest_image?: string | null;
  isLiked?: boolean;
};

// 서버 응답 → Restaurant 로 변환
export function normalizeRestaurant(s: ServerRestaurant): Restaurant {
  return {
    id: Number(s.id),
    name: s.name ?? "-",
    address: s.address ?? "",
    rating: s.rating ?? 0,
    images: s.rest_image ? [s.rest_image] : [],
    rest_tag: [],
    google_place_id: s.google_place_id ?? "",
    menus: s.representativeMenus ?? [],
    like: Boolean(s.isLiked),
    reviews: 0,
  };
}

const normalizeIsLiked = (value: boolean | undefined | null): boolean =>
  Boolean(value);

export default function FoodCard({
  item,
  onClick,
  onLike,
  onUnlike,
  isAuthenticated = false,
  onRequireLogin,
}: FoodCardProps) {
  const [isLiked, setIsLiked] = useState(normalizeIsLiked(item.like));
  const [heartBusy, setHeartBusy] = useState(false);

  // ✅ 사진은 최초 1회만 결정하여 고정 (좋아요 토글/가드와 무관)
  const [imageSrc] = useState(item.images?.[0] || `/logo/logo.png`);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (heartBusy) return;

    // ✅ 비로그인 시: 낙관적 업데이트도 호출도 하지 않음 → 사진/하트 모두 불변
    if (!isAuthenticated) {
      onRequireLogin?.();
      return;
    }

    setHeartBusy(true);
    const next = !isLiked;

    // 낙관적 UI
    setIsLiked(next);

    try {
      // 부모로 위임: 성공(true/void)면 유지, 실패(false) 또는 throw면 롤백
      let ok: boolean | void | undefined;
      if (next) ok = await onLike?.();
      else ok = await onUnlike?.();

      if (ok === false) {
        // 부모가 "차단/실패"를 명시(false)한 경우 즉시 롤백
        setIsLiked(!next);
      }
    } catch (err) {
      // 에러 시 롤백
      setIsLiked(!next);
    } finally {
      setHeartBusy(false);
    }
  };

  // 부모에서 like 값이 갱신되어 내려오면 동기화
  useEffect(() => {
    setIsLiked(Boolean(item.like));
  }, [item.like]);

  return (
    <div
      className="flex items-start justify-between rounded-xl border border-grey-dark-hover bg-white p-3 shadow-md"
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
          <p className="mb-1 text-sm font-bold text-grey-normal-active">
            {item.menus[0]}
          </p>
        )}
        <div className="mt-1 flex flex-wrap gap-2 text-xs">
          {item.rest_tag?.map((tag: { tag: string }, i: number) => (
            <span
              key={i}
              className="rounded-full border border-grey-normal px-2 py-0.5 text-grey-normal"
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

        {/* ✅ 좋아요/가드 여부와 무관하게 사진은 고정 */}
        <img
          src={imageSrc}
          alt={item.menus?.[0] ?? "음식"}
          className="h-18 w-18 rounded-xs border border-grey-dark-hover object-cover"
        />
      </div>
    </div>
  );
}
