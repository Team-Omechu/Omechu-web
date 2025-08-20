"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";

import AddressSection from "../RestaurantAddModal/AddressSection/AddressSection";
import BusinessHoursSelector from "../RestaurantAddModal/BusinessHoursSelector/BusinessHoursSelector";
import ImageUploader from "../RestaurantAddModal/ImageUploader";
import MenuInputList from "../RestaurantAddModal/MenuInputList";
import RestaurantNameInput from "../RestaurantAddModal/RestaurantNameInput";
import { uploadImageToS3 } from "@/restaurant/api/uploadImage";

// 필요에 맞게 교체하세요 (스웨거 명세에 따라)
export type UpdateRestaurantPayload = {
  id: number;
  name: string;
  repre_menu: string[];
  opening_hour: Record<string, string>;
  address: string;
  imageUrl?: string;
};

interface RestaurantEditModalProps {
  onClose: () => void;
  initial: {
    id: number;
    name?: string;
    repre_menu?: string[];
    opening_hour?: Record<string, string>; // { mon: "10:00-18:00", ... }
    address?: string; // "기본 상세" 통 문자열
    imageUrl?: string | null;
  };
  // 실제 업데이트 API를 상위에서 주입 (권장)
  onSubmit: (payload: UpdateRestaurantPayload) => Promise<void>;
}

export default function RestaurantEditModal({
  onClose,
  initial,
  onSubmit,
}: RestaurantEditModalProps) {
  const [restaurantName, setRestaurantName] = useState(initial?.name ?? "");
  const [menus, setMenus] = useState<string[]>(
    initial?.repre_menu && initial.repre_menu.length > 0
      ? initial.repre_menu
      : [""],
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initial?.opening_hour ? Object.keys(initial.opening_hour) : [],
  );

  // opening_hour는 "HH:MM-HH:MM" 포맷 가정 → 첫 항목 기준으로 시간 채움
  const firstRange = useMemo(() => {
    if (!initial?.opening_hour) return undefined;
    const key = Object.keys(initial.opening_hour)[0];
    return key ? initial.opening_hour[key] : undefined;
  }, [initial?.opening_hour]);

  const [startTime, setStartTime] = useState(
    firstRange ? firstRange.split("-")[0] : "10:00",
  );
  const [endTime, setEndTime] = useState(
    firstRange ? firstRange.split("-")[1] : "10:00",
  );

  const [address, setAddress] = useState(initial?.address ?? "");
  const [detailAddress, setDetailAddress] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    initial?.imageUrl ?? null,
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  // 유효성 검사
  const isFormValid = () =>
    restaurantName.trim() &&
    menus.some((m) => m.trim()) &&
    selectedDays.length > 0 &&
    startTime &&
    endTime &&
    address.trim();

  const uploadRestaurantImage = async () => {
    if (!imageFile) return undefined;
    return await uploadImageToS3(imageFile);
  };

  const buildPayload = async (): Promise<UpdateRestaurantPayload> => {
    const imageUrl = await uploadRestaurantImage();

    const openingHour = selectedDays.reduce(
      (acc, day) => {
        acc[day.toLowerCase()] = `${startTime}-${endTime}`;
        return acc;
      },
      {} as Record<string, string>,
    );

    const payload: UpdateRestaurantPayload = {
      id: initial.id,
      ...(imageUrl && { imageUrl }),
      name: restaurantName,
      repre_menu: menus.filter((m) => m.trim()),
      opening_hour: openingHour,
      address: `${address} ${detailAddress}`.trim(),
    };
    return payload;
  };

  const handleUpdateClick = async () => {
    if (!isFormValid() || loading) return;
    try {
      setLoading(true);
      const payload = await buildPayload();
      await onSubmit(payload); // 상위에서 실제 API 호출
      setIsConfirmOpen(true);
      console.log("수정: ", payload);
    } catch (error) {
      alert("수정에 실패했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] h-screen w-screen overflow-y-auto bg-main-normal px-4 py-5">
      {/* 헤더 */}
      <Header
        title="맛집 수정"
        rightChild={
          <button onClick={() => setIsAlertOpen(true)}>
            <Image src={"x/close_big.svg"} alt="닫기" width={18} height={18} />
          </button>
        }
      />

      {/* 닫기 경고 모달 */}
      {isAlertOpen && (
        <ModalWrapper>
          <AlertModal
            title="지금까지 작성한 내용은 저장되지 않아요."
            description="정말 수정을 중단하시겠어요?"
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
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
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

      {/* 수정 버튼 */}
      <button
        disabled={!isFormValid() || loading}
        className={`w-full rounded-md py-3 text-base font-bold text-white transition ${
          isFormValid()
            ? "bg-[#FF5B5B] hover:bg-[#e64545]"
            : "cursor-not-allowed bg-gray-300"
        }`}
        onClick={handleUpdateClick}
      >
        {loading ? "수정 중..." : "수정하기"}
      </button>

      {/* 수정 완료 모달 */}
      {isConfirmOpen && (
        <ModalWrapper>
          <AlertModal
            title="맛집이 수정되었어요."
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
