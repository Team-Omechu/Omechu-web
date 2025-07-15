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
    <footer className="flex items-center justify-between px-4 pb-10 pt-4 text-sm text-[#828282]">
      {showPrev && prevPath ? (
        <button
          onClick={() => router.push(prevPath)}
          className="flex h-[21px] w-[153px] shrink-0 items-center px-[20px] py-[10px]"
        >
          {"<"} 이전으로
        </button>
      ) : (
        <div />
      )}{" "}
      {/* 공간 유지용 빈 div */}
      {showNext && nextPath ? (
        <button
          onClick={() => router.push(nextPath)}
          className="flex h-[21px] w-[134px] shrink-0 items-center justify-end px-[20px] py-[10px]"
        >
          건너뛰기 {">"}
        </button>
      ) : (
        <div />
      )}{" "}
      {/* 공간 유지용 빈 div */}
    </footer>
  );
}
