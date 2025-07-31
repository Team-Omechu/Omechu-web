"use client";

import { useState } from "react";

import Image from "next/image";

import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";

import AddressSection from "./AddressSection/AddressSection";
import BusinessHoursSelector from "./BusinessHoursSelector/BusinessHoursSelector";
import ImageUploader from "./ImageUploader";
import MenuInputList from "./MenuInputList";
import RestaurantNameInput from "./RestaurantNameInput";

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
    <div className="fixed inset-0 z-[9999] h-screen w-screen overflow-y-auto bg-main-normal px-4 py-5">
      {/* 헤더 */}
      <Header
        title={"맛집 등록"}
        rightChild={
          <div>
            <button onClick={handleClickClose}>
              <Image
                src={"x/close_big.svg"}
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
      <ImageUploader
        imagePreviewUrl={imagePreviewUrl}
        onImageChange={handleImageChange}
        onImageRemove={() => {
          setImageFile(null);
          setImagePreviewUrl(null);
        }}
      />

      {/* 식당명 */}
      <RestaurantNameInput
        restaurantName={restaurantName}
        setRestaurantName={setRestaurantName}
      />

      {/* 대표 메뉴 */}
      <MenuInputList
        menus={menus}
        onAddMenu={handleAddMenu}
        onRemoveMenu={handleRemoveMenu}
        onMenuChange={handleMenuChange}
      />

      {/* 영업 시간 */}
      <BusinessHoursSelector
        selectedDays={selectedDays}
        toggleDay={toggleDay}
        startTime={startTime}
        endTime={endTime}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
      />

      {/* 주소 */}
      <AddressSection
        address={address}
        detailAddress={detailAddress}
        setAddress={setAddress}
        setDetailAddress={setDetailAddress}
        isSearchModalOpen={isSearchModalOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
      />

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
