import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import AlertModal from "./AlertModal";
import ModalWrapper from "./ModalWrapper";

export default function FoodReviewCard() {
  const router = useRouter();

  const [isClicked, setIsClicked] = useState(false);
  const [showDeletModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div>
        {/* Card 위 작성일 | 삭제 버튼 */}
        <section className="mb-1 flex justify-between px-2 text-sm font-normal text-[#828282]">
          <span>2025.05.05</span>
          <button onClick={() => setShowDeleteModal(true)}>삭제</button>
        </section>
        <section className="hover:scale-103 h-fit w-80 rounded-xl border-[1px] border-black bg-white p-4 duration-300">
          {/* 식당 사진 | 식당 이름 & 평점 | 버튼 | 찜버튼 */}
          <div className="flex h-20 w-full gap-3">
            {/* 식당 사진 */}
            <Image
              src="/image/image_empty.svg"
              alt={"식당 사진"}
              width={70}
              height={70}
            />
            {/* 식당 이름 | 평점 */}
            <div className="max-h-20 pt-1">
              <div className="flex">
                <span className="text-lg font-normal leading-tight text-[#393939]">
                  Bean Around the World Coffees
                  <button className="" onClick={() => {}}>
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
              <span className="text-lg font-normal text-[#00A3FF]">★★★☆☆</span>
            </div>
            {/* 추천 수 | 찜 버튼 */}
            <div className="flex h-fit flex-shrink-0 items-start gap-1 pt-1">
              <span className="text-base font-normal text-[#393939]">5</span>
              <button onClick={() => setIsClicked((prev) => !prev)}>
                <Image
                  src={
                    isClicked
                      ? "/thumb/thumbs-up-fill.svg"
                      : "/thumb/thumbs-up.svg"
                  }
                  alt={"이동 버튼"}
                  width={18}
                  height={20}
                />
              </button>
            </div>
          </div>
          {/* 리뷰 내용 */}
          <div className="px-1 py-2 text-base font-normal text-[#828282]">
            <span>브런치가 맛있어요</span>
          </div>
          {/* 이미지(없어도 됨) */}
          <div className="relative mb-4 flex max-h-32 w-full gap-2 overflow-x-scroll">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="group relative h-[100px] min-w-[100px] flex-shrink-0 overflow-visible"
              >
                {/* 기본 이미지 */}
                <Image
                  src="/image/image_empty.svg"
                  alt={`예시 이미지 ${i}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
          {/* 태그(3개) */}
          <div className="flex gap-2">
            {["저녁식사", "혼밥", "캐주얼한"].map((item, index) => (
              <div
                key={index}
                className="flex h-6 min-w-[70px] items-center justify-center rounded-3xl border-[1px] border-[#A3A3A3] pt-0.5"
              >
                <span className="text-sm font-normal text-[#A3A3A3]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>
        {showDeletModal && (
          <ModalWrapper>
            <AlertModal
              title="정말로 삭제하시겠어요?"
              confirmText="삭제하기"
              cancelText="취소"
              onConfirm={() => {
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
