"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";
import MealIngredientGroup from "@/components/mainpage/MealIngredientButton";
import MealStyleGroup from "@/components/mainpage/MealStyleButton";
import MealTypeGroup from "@/components/mainpage/MealTypeButton";
import { menus } from "@/constant/mainpage/resultData";

import RandomRecommendModal from "../components/RandomRecommendModal";

export default function RandomRecommendPage() {
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [randomMenu, setRandomMenu] = useState<(typeof menus)[0] | null>(null);

  const getRandomMenu = () => menus[Math.floor(Math.random() * menus.length)];

  const handleModal = () => {
    setRandomMenu(getRandomMenu());
    setShowModal(true);
  };

  const handleRetry = () => {
    setRandomMenu(getRandomMenu());
  };

  const handleConfirm = () => {
    if (randomMenu) {
      router.push(`/mainpage/result/${randomMenu.id}`);
    }
  };

  const toggleSelect = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((v) => v !== item)
        : prev.length < 3
          ? [...prev, item]
          : prev,
    );
  };
  return (
    <div className="flex flex-col items-center">
      <Header
        leftChild={
          <button
            onClick={() => {
              router.push("/mainpage");
            }}
          >
            <Image
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
        className="border-b-0"
      />

      <div className="mt-5 flex flex-col gap-2">
        {/* 1: type */}
        <MealTypeGroup selectedItems={selectedItems} onToggle={toggleSelect} />

        {/* 2: ingredient */}
        <MealIngredientGroup
          selectedItems={selectedItems}
          onToggle={toggleSelect}
        />

        {/* 3: style */}
        <MealStyleGroup selectedItems={selectedItems} onToggle={toggleSelect} />
      </div>
      <button className="relative mt-12" onClick={handleModal}>
        <p className="absolute -top-1 left-1/2 -translate-x-1/2 text-center font-bold text-[#FF624F]">
          Press me!
        </p>
        <Image
          src={"/mainpage/randombutton.svg"}
          alt={"randombutton"}
          width={190}
          height={127}
        />
      </button>
      {showModal && (
        <ModalWrapper>
          <RandomRecommendModal
            title={randomMenu?.title}
            iconSrc="/restaurant_blank.png"
            confirmText="선택하기"
            retryText="다시 추천"
            onConfirm={handleConfirm}
            onRetry={handleRetry}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
