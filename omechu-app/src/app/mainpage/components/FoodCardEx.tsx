import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Restaurant } from "@/constant/mainpage/RestaurantData";
import useLikedList, { HEARTS_KEY, useDeleteHeart, usePostHeart } from "../hooks/useHeart";
import { useAuthStore } from "@/lib/stores/auth.store";
import ModalWrapper from "@/components/common/ModalWrapper";
import LoginPromptModal2 from "../example_testpage/components/LoginPromptModal2";

type FoodCardProps = {
  item: Restaurant;
  menu: string;
  restaurantId: number;
  onClick?: () => void;
};

export default function FoodCard({
  item,
  onClick,
  menu,
  restaurantId,
}: FoodCardProps) {
  const router = useRouter();
  const qc = useQueryClient();

  const { data: likeIds = [], isLoading: likesLoading } = useLikedList(); // ✅ 오타 수정
  const isLiked = useMemo(
    () => likeIds.includes(restaurantId),
    [likeIds, restaurantId]
  );

  const { mutate: addHeart,    isPending: likePending   } = usePostHeart(restaurantId);
  const { mutate: deleteHeart, isPending: deletePending } = useDeleteHeart(restaurantId);
  const { isLoggedIn } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  console.log("isLiked", restaurantId)

  const handleHeartClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (likesLoading || likePending || deletePending) return; // 중복 클릭 방지

    const prev = qc.getQueryData<number[]>(HEARTS_KEY) ?? [];

    if (isLiked) {
      // 좋아요 해제 낙관적 반영
      qc.setQueryData<number[]>(
        HEARTS_KEY,
        prev.filter((id) => id !== restaurantId)
      );
      deleteHeart(undefined, {
        onError: () => qc.setQueryData<number[]>(HEARTS_KEY, prev), // 실패 시 롤백
        onSettled: () => qc.invalidateQueries({ queryKey: HEARTS_KEY }), // 최종 동기화
      });
    } else {
      // 좋아요 추가 낙관적 반영
      qc.setQueryData<number[]>(
        HEARTS_KEY,
        prev.includes(restaurantId) ? prev : [...prev, restaurantId]
      );
      addHeart(undefined, {
        onError: () => qc.setQueryData<number[]>(HEARTS_KEY, prev),
        onSettled: () => qc.invalidateQueries({ queryKey: HEARTS_KEY }),
      });
    }
  };

  return (
    <div className="flex items-start justify-between rounded-xl border border-black bg-white p-3 shadow-md">
      <div className="flex-1" onClick={onClick}>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{item.displayName.text}</span>
          <span className="flex items-center gap-1 text-xs font-normal text-yellow-500">
            ⭐ {item.rating}
            <span className="text-yellow-500">({item.userRatingCount})</span>
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-500">{item.formattedAddress}</p>
        <p className="mb-1 text-sm font-bold text-blue-600">{menu}</p>
      </div>

      <div className="flex flex-col place-items-end gap-2">
        <button onClick={handleHeartClick} aria-label="heart" type="button">
          <Image
            src={isLiked ? "/heart/heart_filled.svg" : "/heart/heart_empty.svg"}
            alt="하트"
            width={20}
            height={20}
          />
        </button>
        <Image
          src={"/logo/logo.png"}
          alt={item.id}
          width={70}
          height={70}
          className="h-[4.5rem] w-[4.5rem] rounded-sm border border-gray-200 object-contain"
        />
      </div>

      {showLoginModal && (
        <ModalWrapper>
          <LoginPromptModal2
            onClose={() => setShowLoginModal(false)}
            onConfirm={() => router.push("/sign-in")}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
