"use client";

import { useState } from "react";

import Image from "next/image";

import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";

import ImageUploader from "./ImageUploader";
import RatingSelector from "./RatingSelector";
import TagSelector from "./TagSelector";
import TextReview from "./TextReview";

interface ReviewModalProps {
  restaurantName: string;
  onClose: () => void;
  onSubmit: (
    rating: number,
    tags: string[],
    images: File[],
    comment: string,
  ) => void;
}

export default function ReviewModal({
  restaurantName,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <div className="fixed inset-0 z-[9999] h-screen w-screen overflow-y-auto bg-[#F8D5FF] px-4 py-5 scrollbar-hide">
      {/* 헤더 */}
      <Header
        title={""}
        rightChild={
          <button onClick={onClose}>
            <Image
              src={"/close_button.png"}
              alt={"닫기"}
              width={18}
              height={18}
            />
          </button>
        }
        className="mb-4 border-none"
      />

      {/* 식당 이름 */}
      <div className="mb-9 flex items-center justify-between">
        <h1 className="w-full text-center text-2xl font-bold text-gray-600">
          {restaurantName}
        </h1>
      </div>

      {/* 별점 */}
      <RatingSelector rating={rating} setRating={setRating} />

      {/* 태그 선택 */}
      <TagSelector
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />

      {/* 이미지 업로드 */}
      <ImageUploader images={images} setImages={setImages} />

      {/* 텍스트 후기 */}
      <TextReview comment={comment} setComment={setComment} />

      {/* 제출 버튼 */}
      <button
        onClick={() => {
          setShowConfirmModal(true);
          onSubmit(rating, selectedTags, images, comment);
        }}
        className="mb-4 w-full rounded-md bg-[#FF5B5B] py-2 font-bold text-white"
      >
        전달하기
      </button>

      {/* 확인 모달 */}
      {showConfirmModal && (
        <ModalWrapper>
          <AlertModal
            title="소중한 후기가 전달되었어요."
            confirmText="제출하기"
            onConfirm={() => setShowConfirmModal(false)}
            onClose={() => setShowConfirmModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
