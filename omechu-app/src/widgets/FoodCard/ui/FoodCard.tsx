//1.별표 -> 거리
//2. 좋아요 기능 삭제
//3. 카테고리 및 평균 가격
//4. 태그 대신 주소
//5. 더보기 기능 -> 5개의 추가 맛집

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/lib/stores/auth.store";
import ModalWrapper from "@/components/common/ModalWrapper";
import { Restaurant } from "../../../entities/restaurant";
import { LoginPromptModal2 } from "../../LoginModal";

type FoodCardProps = {
  item: Restaurant;
  menu: string;
  restaurantId: number | string;
  onClick?: () => void;
};

export function FoodCard({ item, onClick, menu, restaurantId }: FoodCardProps) {
  const router = useRouter();
  const qc = useQueryClient();

  const numericRestaurantId = useMemo(
    () => Number(restaurantId),
    [restaurantId],
  );

  const { isLoggedIn } = useAuthStore();
  const [liked, setLiked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="border-grey-dark-hover flex items-start justify-between rounded-xl border bg-white p-3 shadow-md">
      <div className="flex-1" onClick={onClick}>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{item.displayName.text}</span>
          <span className="flex items-center gap-1 text-xs font-normal text-yellow-500">
            ⭐ {item.rating}
            <span className="text-yellow-500">({item.userRatingCount})</span>
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-500">{item.formattedAddress}</p>
        <p className="text-grey-normal-active mb-1 text-sm font-bold">{menu}</p>
      </div>

      <div className="flex flex-col place-items-end gap-2">
        <button aria-label="heart" type="button">
          <Image
            src={liked ? "/heart/heart_filled.svg" : "/heart/heart_empty.svg"}
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
          className="border-grey-dark-hover h-18 w-18 rounded-xs border object-contain"
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

/*
api (개별) -> entities 계층에 같이 놔둠 
1.recommendmenu 
2.menudetail
3.randommenu

4.postmukburim

5.restaurant

api 
1. 회원인지 아닌지 여부 나타내는 거 한개! 

api (삭제)
1. 좋아요 기능 삭제 
 */
