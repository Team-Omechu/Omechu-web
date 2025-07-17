import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import AlertModal from "./AlertModal";
import ModalWrapper from "./ModalWrapper";

export interface FoodReviewCardProps {
  id: number;
  createdAt: string;
  restaurantName: string;
  rating: number;
  reviewText?: string;
  recommendCount?: number;
  isLiked: boolean;
  onLikeToggle: () => void;
  restaurantImage?: string | null;
  reviewImages?: string[];
  tags?: string[];
  onDelete: () => void;
  onNavigate: () => void;
}

export default function FoodReviewCard({
  id,
  createdAt,
  restaurantName,
  rating = 0,
  reviewText,
  recommendCount,
  isLiked,
  onLikeToggle,
  restaurantImage,
  reviewImages,
  tags,
  onDelete,
  onNavigate,
}: FoodReviewCardProps) {
  const router = useRouter();

  const [showDeletModal, setShowDeleteModal] = useState(false);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {"★".repeat(fullStars)}
        {hasHalfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  function RestaurantImage({
    src,
    alt,
  }: {
    src: string | null | undefined;
    alt: string;
  }) {
    const [imgSrc, setImgSrc] = useState(src || "/image/image_empty.svg");

    return (
      <Image
        src={imgSrc}
        alt={alt}
        width={70}
        height={70}
        onError={() => {
          if (imgSrc !== "/image/image_empty.svg") {
            setImgSrc("/image/image_empty.svg");
          }
        }}
      />
    );
  }

  function ReviewImage({ src, alt }: { src: string; alt: string }) {
    const [imgSrc, setImgSrc] = useState(src);
    return (
      <div className="relative h-[100px] min-w-[100px] flex-shrink-0">
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setImgSrc("/image/image_empty.svg")}
        />
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Card 위 작성일 | 삭제 버튼 */}
        <section className="mb-1 flex justify-between px-2 text-sm font-normal text-[#828282]">
          <span>{createdAt}</span>
          <button onClick={() => setShowDeleteModal(true)}>삭제</button>
        </section>
        <section className="h-fit w-80 rounded-xl border-[1px] border-black bg-white p-4 duration-300 hover:scale-105">
          {/* 식당 사진 | 식당 이름 & 평점 | 버튼 | 찜버튼 */}
          <div className="flex h-20 w-full justify-between gap-3">
            {/* 식당 사진 */}
            <RestaurantImage src={restaurantImage} alt="식당 사진" />

            {/* 식당 이름 | 평점 */}
            <div className="flex max-h-20 flex-1 flex-col pt-1">
              <div className="flex-1">
                <span className="text-lg font-normal leading-tight text-[#393939]">
                  {restaurantName}
                  <button onClick={onNavigate}>
                    <Image
                      src="/arrow/right_arrow_navigate_next.svg"
                      alt={"이동 버튼"}
                      width={25}
                      height={25}
                    />
                  </button>
                </span>
                {/* 맛집 상세페이지 이동 버튼 */}
              </div>

              {/* 후기 평점 */}
              <span className="text-lg font-normal text-[#00A3FF]">
                {renderStars(rating)}
              </span>
            </div>

            {/* 추천 수 | 찜 버튼 */}
            <div className="flex h-fit flex-shrink-0 items-start gap-1 pt-1">
              <span className="text-base font-normal text-[#393939]">
                {recommendCount ?? 0}
              </span>
              <button onClick={onLikeToggle}>
                <Image
                  src={
                    isLiked
                      ? "/thumb/thumbs-up-fill.svg"
                      : "/thumb/thumbs-up.svg"
                  }
                  alt="추천 버튼"
                  width={18}
                  height={20}
                />
              </button>
            </div>
          </div>

          {/* 리뷰 내용 */}
          {reviewText && (
            <div className="px-1 py-2 text-base font-normal text-[#828282]">
              <span>{reviewText}</span>
            </div>
          )}

          {/* 이미지(없어도 됨) */}
          {Array.isArray(reviewImages) && reviewImages.length > 0 && (
            <div className="relative mb-4 flex max-h-32 w-full gap-2 overflow-x-scroll">
              {reviewImages.map((imgSrc, i) =>
                imgSrc ? (
                  <ReviewImage
                    key={i}
                    src={imgSrc}
                    alt={`리뷰 이미지 ${i + 1}`}
                  />
                ) : null,
              )}
            </div>
          )}

          {/* 태그(3개) */}
          {tags && (
            <div className="flex gap-2">
              {tags.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex h-6 w-fit items-center justify-center rounded-3xl border-[1px] border-[#A3A3A3] px-2 pt-0.5"
                >
                  <span className="text-sm font-normal text-[#A3A3A3]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
        {showDeletModal && (
          <ModalWrapper>
            <AlertModal
              title="정말로 삭제하시겠어요?"
              confirmText="삭제하기"
              cancelText="취소"
              onConfirm={() => {
                onDelete();
                router.refresh();
                setShowDeleteModal(false);
              }}
              onClose={() => setShowDeleteModal(false)}
            />
          </ModalWrapper>
        )}
      </div>
    </>
  );
}
