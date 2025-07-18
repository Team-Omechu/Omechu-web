"use client";

import { useRef, useState } from "react";

import Image from "next/image";

import Header from "@/app/components/common/Header";

interface RestaurantAddModalProps {
  onClose: () => void;
}

export default function RestaurantAddModal({
  onClose,
}: RestaurantAddModalProps) {
  const [menus, setMenus] = useState<string[]>([""]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const days = ["월", "화", "수", "목", "금", "토", "일"];

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];


  const handleAddMenu = () => {
    if (menus.length < 3) {
      setMenus([...menus, ""]);
    }
  };

  const handleRemoveMenu = (index: number) => {
    setMenus(menus.filter((_, i) => i !== index));
  };

  const handleMenuChange = (index: number, value: string) => {
    const newMenus = [...menus];
    newMenus[index] = value;
    setMenus(newMenus);
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert("jpg, jpeg, png 파일만 업로드할 수 있습니다.");
      return;
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 z-[9999] h-screen w-screen overflow-y-auto bg-[#F8D5FF] px-4 py-5">
      {/* 헤더 */}
      <Header
        title={"맛집 등록"}
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
      />

      {/* 이미지 영역 */}
      <div
        className="mb-8 mt-4 flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md bg-gray-300 text-sm text-gray-600"
        onClick={() => imageInputRef.current?.click()}
      >
        {imagePreviewUrl ? (
          <div className="relative h-full w-full">
            <Image
              src={imagePreviewUrl}
              alt={`업로드 이미지`}
              width={358}
              height={160}
              className="object-contain"
            />
            <button
              onClick={() => setImagePreviewUrl(null)}
              className="absolute right-2 top-2 rounded-full bg-gray-200 px-1 text-base font-extrabold text-black"
            >
              ×
            </button>
          </div>
        ) : (
          <span>업로드할 이미지 미리보기</span>
        )}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* 식당명 */}
      <div className="mb-1 text-sm font-medium text-gray-700">식당명</div>
      <input
        type="text"
        placeholder="식당명을 입력하세요"
        className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />

      {/* 대표 메뉴 */}
      <div className="mb-1 text-sm font-medium text-gray-700">
        대표 메뉴 {menus.length}/3
      </div>
      {menus.map((menu, idx) => (
        <div key={idx} className="mb-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="메뉴명을 입력하세요"
            value={menu}
            onChange={(e) => handleMenuChange(idx, e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button onClick={() => handleRemoveMenu(idx)}>✖</button>
        </div>
      ))}
      {menus.length < 3 && (
        <button
          onClick={handleAddMenu}
          className="mb-4 text-lg text-gray-700 hover:text-black"
        >
          ＋
        </button>
      )}

      {/* 영업 시간 */}
      <div className="mb-2 text-sm font-medium text-gray-700">영업 시간</div>
      <div className="mb-2 flex flex-wrap gap-1">
        {days.map((day) => (
          <button
            key={day}
            className={`rounded-lg border border-gray-700 px-2 py-1 text-sm ${
              selectedDays.includes(day)
                ? "bg-[#3FA2FF] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => toggleDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <div className="mb-4 flex items-center gap-2 text-sm">
        <input
          type="text"
          placeholder="00 시 00 분"
          className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        ~
        <input
          type="text"
          placeholder="00 시 00 분"
          className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {/* 주소 */}
      <div className="mb-2 text-sm font-medium text-gray-700">주소</div>
      <div className="mb-2 flex items-center gap-2">
        <input
          type="text"
          placeholder="주소지를 입력해 주세요"
          className="flex-1 rounded-md border border-gray-300 bg-gray-200 px-3 py-2 text-sm"
        />
        <button className="rounded-full bg-[#3FA2FF] px-4 py-2 text-sm text-white">
          주소찾기
        </button>
      </div>
      <input
        type="text"
        placeholder="상세 주소를 입력해 주세요 (선택)"
        className="mb-6 w-full rounded-md border border-gray-300 bg-gray-200 px-3 py-2 text-sm"
      />

      {/* 등록하기 버튼 */}
      <button className="w-full rounded-md bg-[#FF5B5B] py-3 text-base font-bold text-white">
        등록하기
      </button>
    </div>
  );
}
