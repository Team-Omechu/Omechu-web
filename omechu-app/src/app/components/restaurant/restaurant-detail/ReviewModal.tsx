"use client";

import { useState } from "react";

import Image from "next/image";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

import Header from "../../common/Header";
import Keyword from "../../common/Keyword";

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

const allTags = [
  "아침식사",
  "점심식사",
  "저녁식사",
  "야식",
  "혼밥",
  "데이트",
  "가족",
  "단체회식",
  "고급스러운",
  "가성비",
  "기념일",
  "술모임",
  "시끌벅적한",
  "깔끔한",
  "캐주얼한",
  "조용한",
];

export default function ReviewModal({
  restaurantName,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const maxSelected = 5; // 최대 선택 가능한 태그 수
  const maxImages = 5; // 최대 업로드 가능한 이미지 수
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxImages) return; // 5장 제한
    setImages((prev) => [...prev, ...files]);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const isSelected = prev.includes(tag);
      if (isSelected) {
        return prev.filter((t) => t !== tag);
      } else if (prev.length < maxSelected) {
        return [...prev, tag];
      }
      return prev;
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setImages(reordered);
  };

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
      <div className="mb-4">
        <p className="mb-3 text-sm text-gray-700">
          <span className="font-bold">총점</span>을 매겨주세요! 얼마나
          만족하셨나요?*
        </p>
        <div className="flex justify-center gap-1 rounded-md border border-gray-700 bg-white text-2xl text-[#1F9BDA]">
          {[...Array(5)].map((_, i) => (
            <button key={i} onClick={() => setRating(i + 1)}>
              {i < rating ? "★" : "☆"}
            </button>
          ))}
        </div>
      </div>

      {/* 태그 선택 */}
      <div className="mb-10">
        <p className="mb-3 text-sm text-gray-700">
          이 식당을 <span className="font-bold">한마디로</span> 표현한다면?*
          (1~5개)
        </p>
        <div className="flex flex-wrap justify-center gap-1 rounded-md border border-gray-700 bg-white p-2">
          {allTags.map((tag) => (
            <Keyword
              key={tag}
              label={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => handleTagToggle(tag)}
              className="my-2"
            />
          ))}
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div className="mb-10">
        <p className="mb-3 text-sm text-gray-700">
          음식, 인테리어, 메뉴판 등의 <span className="font-bold">사진</span>을
          첨부해 주세요. (최대 5장)
        </p>
        <div className="flex gap-2 overflow-x-auto rounded-md border border-gray-700 bg-white p-2">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  className="flex gap-2 overflow-x-auto scrollbar-hide"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {images.map((file, idx) => (
                    <Draggable
                      key={file.name + idx}
                      draggableId={file.name + idx}
                      index={idx}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative"
                        >
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`preview-${idx}`}
                            width={80}
                            height={80}
                            className="rounded-md"
                          />
                          <button
                            onClick={() =>
                              setImages(images.filter((_, i) => i !== idx))
                            }
                            className="absolute -right-1 -top-1 rounded-full bg-black px-1 text-xs text-white"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {images.length < 5 && (
                    <label className="flex h-[80px] w-[80px] cursor-pointer items-center justify-center rounded-md border border-dashed bg-white text-xl text-gray-400">
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <Image
                        src="/restaurant/camera-fill.svg"
                        alt="이미지 업로드"
                        width={40}
                        height={40}
                      />
                    </label>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          ※ 사진 순서는 드래그 앤 드롭으로 변경 가능합니다.
        </p>
      </div>

      {/* 텍스트 후기 */}
      <div className="mb-10">
        <p className="mb-3 text-sm text-gray-700">
          솔직하고 <span className="font-extrabold">자세한 후기</span>를
          들려주세요.
        </p>
        <textarea
          className="h-24 w-full resize-none rounded-md border border-gray-700 p-2 text-sm"
          placeholder="식당의 맛, 서비스, 위생 등 생생한 경험을 공유해 주세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={300}
        />
        <div className="text-right text-xs text-[#888]">
          {comment.length} / 300자
        </div>
      </div>

      {/* 제출 버튼 */}
      <button
        onClick={() => onSubmit(rating, selectedTags, images, comment)}
        className="mb-4 w-full rounded-md bg-[#FF5B5B] py-2 font-bold text-white"
      >
        전달하기
      </button>
    </div>
  );
}
