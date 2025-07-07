"use client";
import { useRouter } from "next/navigation";

interface BottomNavProps {
  prevPath?: string;
  nextPath?: string;
  showPrev?: boolean;
  showNext?: boolean;
}

export default function BottomNav({
  prevPath,
  nextPath,
  showPrev = true,
  showNext = true,
}: BottomNavProps) {
  const router = useRouter();

  return (
    <footer className="flex justify-between items-center px-4 pb-10 pt-4 text-[#828282] text-sm">
      {showPrev && prevPath ? (
        <button
          onClick={() => router.push(prevPath)}
          className="flex w-[153px] h-[21px] py-[10px] px-[20px] items-center shrink-0"
        >
          {"<"} 이전으로
        </button>
      ) : <div />}  {/* 공간 유지용 빈 div */}

      {showNext && nextPath ? (
        <button
          onClick={() => router.push(nextPath)}
          className="flex w-[134px] h-[21px] py-[10px] px-[20px] justify-end items-center shrink-0"
        >
          건너뛰기 {">"}
        </button>
      ) : <div />}  {/* 공간 유지용 빈 div */}
    </footer>
  );
}
