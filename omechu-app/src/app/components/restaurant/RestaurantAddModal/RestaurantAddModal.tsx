"use client";

import { useRef, useState } from "react";

import Image from "next/image";

import AlertModal from "@/app/components/common/AlertModal";
import Header from "@/app/components/common/Header";
import ModalWrapper from "@/app/components/common/ModalWrapper";

import AddressSearchModal from "./AddressSearchModal";
import TimeDropdown from "./TimeDropdown";

interface RestaurantAddModalProps {
  onClose: () => void;
}

export default function RestaurantAddModal({
  onClose,
}: RestaurantAddModalProps) {
  const [restaurantName, setRestaurantName] = useState("");
  const [menus, setMenus] = useState<string[]>([""]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:00");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // 제출하기 유효성 검사 함수
  const isFormValid = () => {
    return (
      restaurantName.trim() !== "" &&
      menus.some((m) => m.trim() !== "") &&
      selectedDays.length > 0 &&
      startTime &&
      endTime &&
      address.trim() !== "" &&
      imageFile !== null
    );
  };

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [detailAddress, setDetailAddress] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const days = ["월", "화", "수", "목", "금", "토", "일"];

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  const handleClickClose = () => {
    setIsAlertOpen(true);
  };

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
          <div>
            <button onClick={handleClickClose}>
              <Image
                src={"/close_button.png"}
                alt={"닫기"}
                width={18}
                height={18}
              />
            </button>
            {isAlertOpen && (
              <ModalWrapper>
                <AlertModal
                  title="지금까지 작성한 내용은 저장되지 않아요."
                  description="정말 맛집 등록을 중단하시겠어요?"
                  confirmText="계속 작성하기"
                  cancelText="나가기"
                  onConfirm={() => setIsAlertOpen(false)}
                  onClose={() => {
                    setIsAlertOpen(false);
                    onClose();
                  }}
                  swapButtonOrder={true}
                />
              </ModalWrapper>
            )}
          </div>
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
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
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
        <div className="flex items-end gap-3">
          <TimeDropdown
            label="시작 시간"
            value={startTime}
            onChange={setStartTime}
          />
          <span className="mb-2 text-xl text-gray-500">~</span>
          <TimeDropdown
            label="종료 시간"
            value={endTime}
            onChange={setEndTime}
          />
        </div>
      </div>

      {/* 주소 */}
      <div className="mb-2 text-sm font-medium text-gray-700">주소</div>
      <div className="mb-2 flex items-center gap-2">
        <input
          type="text"
          placeholder="주소지를 입력해 주세요"
          value={address}
          readOnly
          className={`flex-1 rounded-md border border-gray-300 bg-gray-200 px-3 py-2 text-sm text-gray-800 ${
            address
              ? "border-gray-300 bg-white text-gray-800"
              : "cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400"
          }`}
        />
        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          className="rounded-full bg-[#3FA2FF] px-4 py-2 text-sm text-white"
        >
          주소찾기
        </button>
      </div>
      <input
        type="text"
        placeholder="상세 주소를 입력해 주세요 (선택)"
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
        disabled={!address}
        className={`mb-6 w-full rounded-md border px-3 py-2 text-sm ${
          address
            ? "border-gray-300 bg-white text-gray-800"
            : "cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400"
        }`}
      />
      {isSearchModalOpen && (
        <ModalWrapper>
          <AddressSearchModal
            onClose={() => setIsSearchModalOpen(false)}
            onSelect={(selectedAddress) => {
              setAddress(selectedAddress);
              setIsSearchModalOpen(false);
            }}
          />
        </ModalWrapper>
      )}

      {/* 등록하기 버튼 */}
      <button
        className={`w-full rounded-md py-3 text-base font-bold text-white transition ${
          isFormValid()
            ? "bg-[#FF5B5B] hover:bg-[#e64545]"
            : "cursor-not-allowed bg-gray-300"
        }`}
        onClick={() => {
          if (!isFormValid()) return;
          setIsConfirmOpen(true);
          // 여기서 API 저장 요청도 함께 실행 가능
        }}
      >
        등록하기
      </button>
      {/* 등록 완료 모달 */}
      {isConfirmOpen && (
        <ModalWrapper>
          <AlertModal
            title="맛집이 등록되었어요."
            confirmText="확인"
            onConfirm={() => {
              setIsConfirmOpen(false);
              onClose();
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
