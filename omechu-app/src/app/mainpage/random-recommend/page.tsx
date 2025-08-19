"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";

import RandomRecommendModal from "../components/RandomRecommendModal";
import { BingoList } from "@/constant/mainpage/BingoList";

export default function RandomRecommendPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleModal = () => {
    setShowModal(true);
  };

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <Header
        leftChild={
          <button
            onClick={() => {
              router.push("/mainpage");
            }}
          >
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
        title="Bingo!"
        className="border-b-0"
      />

      <div className="mt-5 grid grid-cols-3 gap-2">
        {BingoList.map((item) => (
          <label className="h-[1.8rem] w-[7.05rem] rounded-md border border-grey-normal bg-white text-center">
            {item.name}
          </label>
        ))}
      </div>
      <button className="relative mt-10" onClick={handleModal}>
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
            confirmText="선택하기"
            retryText="다시 추천"
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
