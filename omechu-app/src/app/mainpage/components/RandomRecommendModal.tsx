"use client";

import Image from "next/image";
import MainLoading from "@/components/mainpage/MainLoading";
import { BingoList } from "@/constant/mainpage/BingoList";
import { useEffect, useRef, useState } from "react";

type ModalProps = {
  confirmText: string;
  retryText: string;
  onClose: () => void;
};

export default function RandomRecommendModal({
  confirmText,
  retryText,
  onClose,
}: ModalProps) {
  // 최초 1개 랜덤
  const [idx, setIdx] = useState(() =>
    Math.floor(Math.random() * BingoList.length),
  );
  // 이미 추천된 인덱스들(중복 방지)
  const [used, setUsed] = useState<number[]>(() => [0].slice(0)); // placeholder, 아래 useEffect에서 초기화
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 최초 mount시에 used를 현재 idx로 맞춰준다
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setUsed([idx]);
      timerRef.current = null;
    }, 2500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allIndices = [...Array(BingoList.length).keys()];

  const handleRetry = () => {
    if (isLoading) return;
    setIsLoading(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setUsed((prevUsed) => {
        // 이미 다 소진했다면 새 사이클 시작
        const baseUsed = prevUsed.length >= BingoList.length ? [] : prevUsed;

        // 남아있는 후보들
        const remaining = allIndices.filter((i) => !baseUsed.includes(i));

        // 남은 것 중 하나 랜덤
        const next = remaining[Math.floor(Math.random() * remaining.length)];

        setIdx(next);
        return [...baseUsed, next];
      });

      setIsLoading(false);
      timerRef.current = null;
    }, 2500);
  };

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onClose();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (isLoading) {
    return <MainLoading />;
  }

  const menu = BingoList[idx];

  return (
    <div className="relative flex h-[300px] w-[300px] flex-col justify-between rounded-[20px] bg-white p-5 shadow-xl">
      <button className="absolute right-4 top-4" onClick={handleClose}>
        <Image src={"/x/close_big.svg"} alt="취소버튼" width={18} height={18} />
      </button>

      <div className="flex flex-col items-center text-center text-[#00A3FF]">
        <span className="whitespace-pre-line text-[19px] font-semibold">
          {menu?.name}
        </span>
        {/* 진행상황(선택사항): {used.length}/{BingoList.length} */}
      </div>

      <div className="flex flex-col items-center">
        <Image
          src={menu?.image_link || "/image/image_empty.svg"}
          alt="랜덤추천메뉴"
          width={120}
          height={120}
        />
      </div>

      <div className="flex justify-center gap-4">
        <button
          className="h-[45px] w-[100px] flex-shrink-0 rounded-md border border-grey-darkHover bg-white text-[15px] font-normal hover:bg-grey-lightHover active:bg-grey-lightActive disabled:opacity-50"
          onClick={handleRetry}
          disabled={isLoading}
        >
          {retryText}
        </button>
        <button
          className="h-[45px] w-[100px] flex-shrink-0 rounded-md border border-grey-darkHover bg-primary-normal text-[15px] font-normal text-white hover:bg-primary-normalHover active:bg-primary-normalActive disabled:opacity-50"
          disabled={isLoading}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
