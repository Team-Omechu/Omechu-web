"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import StepFooter from "@/components/common/StepFooter";
import LocationModal from "@/mainpage/components/LocationModal";
import Header from "@/components/common/Header";

export default function LocationAnswerPage() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState("");

  const handleCheckboxChange = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (newValue) {
      setShowModal(true);
      setSelectedDistance("가까이");
    } else {
      setSelectedDistance("");
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setIsChecked(false);
    setSelectedDistance("");
  };

  return (
    <div className="relative flex h-screen w-full flex-col">
      <Header className="border-b-0" />
      <main className="mb-2 flex min-h-[calc(100vh-9rem)] w-full flex-col items-center justify-center px-4 py-6">
        {/* 질문 */}
        <div className="mb-10 flex flex-col items-center justify-center text-center text-[#393939]">
          <p className="text-[25px] font-semibold">위치를 입력해주세요</p>
          <p className="mt-2 text-[#828282]">주변 맛집 메뉴로 추천해드릴게요</p>
        </div>

        {/* 체크박스 + 텍스트 + 거리 라벨 */}
        <div className="ml-5 mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="h-[1.25rem] w-[1.25rem] flex-shrink-0"
          />
          <label className="font-['Inter'] text-[1.25rem] font-normal leading-normal text-[#393939]">
            내 주변
          </label>
          <div className="flex h-[1.125rem] w-[5.875rem] flex-shrink-0 items-center justify-center rounded-[0.3125rem] border border-[#333] bg-white text-sm text-black">
            {selectedDistance}
          </div>
        </div>
        <div className="mt-4 h-[10.625rem] w-[17.5rem] flex-shrink-0 overflow-hidden">
          <Image
            src="/map/map.svg"
            alt="지도"
            width={280}
            height={170}
            className="h-full w-full object-cover"
          />
        </div>

        {/* 결과 보기 버튼 */}
        <button
          onClick={() => router.push("/mainpage/result")}
          className="mt-10 flex h-[2.8125rem] w-[17.375rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] bg-[#FB4746] p-[0.625rem] text-[16px] font-medium text-white"
        >
          결과 보기
        </button>
      </main>
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-end justify-center">
          <div className="w-full">
            <LocationModal
              onClose={handleCancel}
              onSelect={(distance) => {
                setSelectedDistance(distance);
                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 하단 네비 */}
      <StepFooter
        showNext={false}
        showPrev={true}
        onPrev={() => router.back()}
      />
    </div>
  );
}
