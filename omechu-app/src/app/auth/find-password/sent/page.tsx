"use client";

import Link from "next/link";
import Button from "@/app/components/auth/Button";

export default function FindPasswordEmailSentPage() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen gap-8 px-5 py-10 text-center bg-[#F8F2FF]">
      <div className="flex items-center justify-center flex-grow">
        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-medium text-[#393939]">
            비밀번호 재설정 메일을 발송했어요
          </h1>
          <p className="text-[15px] font-normal text-[#828282]">
            보내드린 메일을 확인하신 후,
            <br />
            비밀번호를 다시 설정해 주세요
          </p>
        </div>
      </div>
      <div className="w-full">
        <Link href="/auth/login" className="w-full">
          <Button variant="red" size="large">
            로그인 하기
          </Button>
        </Link>
      </div>
    </div>
  );
}
