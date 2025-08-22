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
import {
  registerRestaurant,
  RegisterRestaurantPayload,
} from "@/restaurant/api/restaurantList";
import { uploadImageToS3 } from "@/restaurant/api/uploadImage";

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
  const [detailAddress, setDetailAddress] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  // ✅ 유효성 검사
  const isFormValid = () =>
    restaurantName.trim() &&
    menus.some((m) => m.trim()) &&
    selectedDays.length > 0 &&
    startTime &&
    endTime &&
    address.trim();

  // ✅ 이미지 업로드 분리
  const uploadRestaurantImage = async () => {
    if (!imageFile) return undefined;
    return await uploadImageToS3(imageFile);
  };

  // ✅ 등록 처리
  const handleRegisterClick = async () => {
    if (!isFormValid() || loading) return;

    try {
      setLoading(true);
      const imageUrl = await uploadRestaurantImage();

      const openingHour = selectedDays.reduce(
        (acc, day) => {
          acc[day.toLowerCase()] = `${startTime}-${endTime}`;
          return acc;
        },
        {} as Record<string, string>,
      );

      const payload: RegisterRestaurantPayload = {
        ...(imageUrl && { imageUrl }),
        name: restaurantName,
        repre_menu: menus.filter((m) => m.trim()),
        opening_hour: openingHour,
        address: `${address} ${detailAddress}`.trim(),
      };

      await registerRestaurant(payload);
      setIsConfirmOpen(true);
      console.log("등록: ", payload);
    } catch (error) {
      alert("등록에 실패했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] h-screen w-screen overflow-y-auto bg-[#FFDEFB] px-4 py-5 scrollbar-hide">
      {/* 헤더 */}
      <Header
        title="맛집 등록"
        rightChild={
          <button onClick={() => setIsAlertOpen(true)}>
            <Image src={"/x/close_big.svg"} alt="닫기" width={18} height={18} />
          </button>
        }
      />

      {/* 닫기 경고 모달 */}
      {isAlertOpen && (
        <ModalWrapper>
          <AlertModal
            title={"지금까지 작성한 내용은\n저장되지 않아요."}
            description="정말 맛집 등록을 중단하시겠어요?"
            confirmText="계속 작성하기"
            cancelText="나가기"
            onConfirm={() => setIsAlertOpen(false)}
            onClose={() => {
              setIsAlertOpen(false);
              onClose();
            }}
            swapButtonOrder
          />
        </ModalWrapper>
      )}

      {/* 이미지 업로더 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <ImageUploader
          imagePreviewUrl={imagePreviewUrl}
          onImageChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
              alert("jpg, jpeg, png 파일만 업로드할 수 있습니다.");
              return;
            }
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
          }}
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

        {/* 메뉴 입력 */}
        <MenuInputList
          menus={menus}
          onAddMenu={() => menus.length < 3 && setMenus([...menus, ""])}
          onRemoveMenu={(i) => setMenus(menus.filter((_, idx) => idx !== i))}
          onMenuChange={(i, value) => {
            const newMenus = [...menus];
            newMenus[i] = value;
            setMenus(newMenus);
          }}
        />

        {/* 영업시간 */}
        <BusinessHoursSelector
          selectedDays={selectedDays}
          toggleDay={(day) =>
            setSelectedDays((prev) =>
              prev.includes(day)
                ? prev.filter((d) => d !== day)
                : [...prev, day],
            )
          }
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
      </div>

      {/* 등록 버튼 */}
      <div className="border-t border-black/5 bg-main-normal px-4 pb-4 pt-3">
        <button
          disabled={!isFormValid() || loading}
          className={`w-full rounded-md py-3 text-base font-bold text-white transition ${
            isFormValid()
              ? "bg-[#FF5B5B] hover:bg-[#e64545]"
              : "cursor-not-allowed bg-gray-300"
          }`}
          onClick={handleRegisterClick}
        >
          {loading ? "등록 중..." : "등록하기"}
        </button>
      </div>

      {/* 등록 완료 모달 */}
      {isConfirmOpen && (
        <ModalWrapper>
          <AlertModal
            title="맛집이 등록되었어요."
            confirmText="확인"
            onConfirm={() => {
              setIsConfirmOpen(false);
              onClose();
              window.location.reload();
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
