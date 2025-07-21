"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";

import AddressSection from "./AddressSection";
import BusinessHoursSelector from "./BusinessHoursSelector";
import ImageUploader from "./ImageUploader";
import MenuInputList from "./MenuInputList";
import RestaurantNameInput from "./RestaurantNameInput";

// 초기값 주입
interface RestaurantEditModalProps {
  onClose: () => void;
  initialData: {
    restaurantName: string;
    menus: string[];
    selectedDays: string[];
    startTime: string;
    endTime: string;
    address: string;
    detailAddress: string;
    imageUrl: string;
  };
}

export default function RestaurantEditModal({
  onClose,
  initialData,
}: RestaurantEditModalProps) {
  const [restaurantName, setRestaurantName] = useState(
    initialData.restaurantName,
  );
  const [menus, setMenus] = useState(initialData.menus);
  const [selectedDays, setSelectedDays] = useState(initialData.selectedDays);
  const [startTime, setStartTime] = useState(initialData.startTime);
  const [endTime, setEndTime] = useState(initialData.endTime);
  const [address, setAddress] = useState(initialData.address);
  const [detailAddress, setDetailAddress] = useState(initialData.detailAddress);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    initialData.imageUrl,
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  const isFormValid = () => {
    return (
      restaurantName.trim() !== "" &&
      menus.some((m) => m.trim() !== "") &&
      selectedDays.length > 0 &&
      startTime &&
      endTime &&
      address.trim() !== "" &&
      (imageFile !== null || imagePreviewUrl !== null)
    );
  };

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
        title={"맛집 수정"}
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
                  title="수정 중인 내용이 저장되지 않아요."
                  description="정말 편집을 종료할까요?"
                  confirmText="계속 편집"
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

      {/* 이미지 업로드 */}
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

      {/* 저장 버튼 */}
      <button
        className={`w-full rounded-md py-3 text-base font-bold text-white transition ${
          isFormValid()
            ? "bg-[#FF5B5B] hover:bg-[#e64545]"
            : "cursor-not-allowed bg-gray-300"
        }`}
        onClick={() => {
          if (!isFormValid()) return;

          setIsConfirmOpen(true);
          //  여기서 PUT / PATCH API 호출
        }}
      >
        수정 완료
      </button>

      {/* 확인 모달 */}
      {isConfirmOpen && (
        <ModalWrapper>
          <AlertModal
            title="맛집 정보가 수정되었어요."
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
