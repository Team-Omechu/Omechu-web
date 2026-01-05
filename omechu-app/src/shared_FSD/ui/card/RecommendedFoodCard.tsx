// ! 26.01.04 작업 완료

import Image from "next/image";

import clsx from "clsx";

interface RecommendedFoodCardProps {
  menuDesc: string;
  menuTitle: string;
  selected?: boolean;
  src?: string;
  onMinusButtonClick: () => void;
  onCardClick: () => void;
}

export const RecommendedFoodCard = ({
  selected,
  onMinusButtonClick,
  onCardClick,
  menuTitle,
  menuDesc,
  src,
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  RecommendedFoodCardProps) => {
  return (
    <div className="relative">
      <button
        className="absolute -top-3.5 left-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onMinusButtonClick();
        }}
        aria-label="추천 카드 삭제"
        aria-pressed={false}
        type="button"
      >
        <Image
          src={"/circle/circle_minus.svg"}
          width={28}
          height={28}
          alt="삭제 아이콘"
          className="object-contain"
          priority
        />
      </button>

      <button
        onClick={onCardClick}
        className={clsx(
          "bg-brand-secondary border-font-disabled flex h-28 w-84 gap-5 rounded-2xl border-[1.5px] p-3",
          selected && "bg-brand-primary scale-105",
        )}
        aria-label="추천 음식 카드"
        aria-pressed={selected}
        type="button"
      >
        <div className="flex h-22 w-22 items-center justify-center rounded-2xl">
          <Image
            src={clsx(src ? src : "/image/image_empty.svg")}
            width={96}
            height={96}
            alt="추천 음식 미리보기 이미지"
            className="rounded-2xl object-cover"
            loading="eager"
            priority
          />
        </div>
        <div className="w-48 text-left">
          <div className="text-body-4-medium text-font-high mt-1 mb-2">
            {menuTitle}
          </div>
          <p className="text-caption-1-regular text-font-placeholder leading-tight">
            {menuDesc}
          </p>
        </div>
      </button>
    </div>
  );
};
