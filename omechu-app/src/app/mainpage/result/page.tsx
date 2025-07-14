"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import MenuCard from "@/app/components/mainpage/MenuCard";

export default function ResultPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(1);

  const menus = [
    {
      id: 1,
      title: "카레라이스",
      description:
        "매콤한 향신료와 따뜻한 밥이 어우러져 기분을 북돋아주고 활력을 주는 한 그릇 요리",
      image: "/images/curry.png",
    },
    {
      id: 2,
      title: "연어 아보카도 샌드위치",
      description:
        "오메가3가 풍부한 연어와 기분을 안정시켜주는 아보카도 조합, 비주얼도 예쁘서 기분 전환",
      image: "/images/sandwich.png",
    },
    {
      id: 3,
      title: "된장찌개와 보리밥",
      description:
        "구수한 된장향과 따뜻한 국물이 마음을 안정시키고 든든한 에너지를 채워주는 전통 한식 조합",
      image: "/images/soybean.png",
    },
  ];

  const tags = ["아침", "든든한 한 끼 식사", "들뜨고 신나요", "혼자", "중간"];

  const tagDescriptions = [
    "간단하고 속에 편한 음식",
    "활기찬 기분을 유지할 수 있도록 하는 음식",
    "혼자서도 부담 없이 즐길 수 있는 음식",
    "활기찬 기분을 유지할 수 있도록 하는 음식",
    "혼자서도 부담 없이 즐길 수 있는 음식",
  ];

  return (
    <div className="flex flex-col p-4">
      <button className="flex justify-start" onClick={() => router.push("./")}>
        &lt; 처음으로
      </button>

      <div className="mt-3 flex flex-col gap-4">
        {menus.map((menu) => (
          <div key={menu.id} className="relative">
            <button
              className="absolute left-2 top-1 z-10 rounded-full bg-white"
              onClick={() => {
                setShowModal(true);
              }}
            >
              <Image
                src="/do_not_disturb_on.png"
                alt="아이콘"
                width={24}
                height={24}
              />
            </button>

            <MenuCard
              title={menu.title}
              description={menu.description}
              image={menu.image}
              onClick={() => setOpenMenuId(menu.id)}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between gap-2">
        <button className="flex-1 rounded-md bg-[#FB4746] px-4 py-2 text-[#FFF]">
          다시 추천
        </button>
        <button
          className="flex-1 rounded-md border border-gray-500 bg-[#FFF] px-4 py-2 text-black"
          onClick={() => {
            if (openMenuId !== null) {
              router.push(`/mainpage/result/${openMenuId}`);
            }
          }}
        >
          선택하기
        </button>
      </div>

      <div className="mt-5 rounded-md border border-black bg-white p-3 text-sm">
        {tags.map((tag, idx) => (
          <div key={idx} className="mb-1 flex flex-col p-1 text-black">
            <span className="mb-1 font-semibold text-[#A3A3A3]">{tag}</span>
            {tagDescriptions[idx]}
          </div>
        ))}
      </div>
      {showModal && (
        <ModalWrapper>
          <AlertModal
            title="메뉴 추천을 중단하시겠어요?"
            cancelText="취소"
            confirmText="제외하기"
            onConfirm={() => {
              setShowModal(false);
            }}
            onClose={() => {
              setShowModal(false);
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
