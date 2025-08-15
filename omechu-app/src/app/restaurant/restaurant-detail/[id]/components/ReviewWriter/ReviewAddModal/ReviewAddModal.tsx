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
import { useMutation } from "@tanstack/react-query";
import { postReview, ReviewRequest } from "../../../api/review";
import { uploadImageToS3 } from "@/restaurant/api/uploadImage";

interface ReviewModalProps {
  restaurantId: number;
  restaurantName: string;
  onClose: () => void;
}

export default function ReviewAddModal({
  restaurantId,
  restaurantName,
  onClose,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const usePostReview = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: ReviewRequest }) =>
        postReview(id, data),
    });
  };

  const { mutate: submitReview, isPending, isSuccess } = usePostReview();

  const handleSubmit = async () => {
    if (!isFormValid || isPending) return;

    try {
      // 이미지 업로드
      let uploadedUrls: string[] = [];
      if (images.length > 0) {
        uploadedUrls = await Promise.all(
          images.map(async (file) => await uploadImageToS3(file)),
        );
      }

      // 리뷰 등록
      submitReview(
        {
          id: restaurantId,
          data: {
            rating,
            tag: selectedTags,
            reviewText: comment,
            imageUrl: uploadedUrls, // ✅ 업로드된 S3 URL 배열 전달
          },
        },
        {
          onSuccess: () => {
            setShowConfirmModal(true);
          },
          onError: (err) => {
            console.error("리뷰 등록 실패", err);
            alert("리뷰 등록에 실패했습니다.");
          },
        },
      );
    } catch (error) {
      console.error("이미지 업로드 실패", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const isFormValid = rating > 0 && selectedTags.length > 0;

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
        onClick={handleSubmit}
        disabled={!isFormValid || isPending}
        className={`mb-4 w-full rounded-md py-2 font-bold text-white ${
          !isFormValid || isPending
            ? "cursor-not-allowed bg-gray-400"
            : "bg-[#FF5B5B]"
        }`}
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
