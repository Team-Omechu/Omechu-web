"use client";

import Link from "next/link";

import { Button } from "@/shared";

export default function EmailSentMessage() {
  return (
    <div className="flex w-full flex-col items-center gap-10 px-5 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-body-2-bold text-font-high">
          비밀번호 재설정 메일을 발송했어요
        </h1>
        <p className="text-body-4-regular text-font-low">
          보내드린 메일을 확인하신 후,
          <br />
          비밀번호를 다시 설정해 주세요
        </p>
      </div>

      <Link href="/sign-in" className="w-full">
        <Button type="button" className="w-full">
          로그인 하기
        </Button>
      </Link>
    </div>
  );
}
