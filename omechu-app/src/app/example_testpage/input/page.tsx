"use client";

import { Button } from "@/shared_FSD/ui/button/Button";
import { Input } from "@/shared_FSD/ui/input/Input";

export default function InputTestPage() {
  return (
    <div className="flex max-w-md flex-col gap-8 p-6">
      {/* 기본 입력 */}
      <section className="flex flex-col gap-2">
        <p className="text-body-5-medium">일반 입력</p>
        <Input width="default" placeholder="이메일 입력" type="email" />
      </section>

      {/* 인증번호 입력 */}
      <section className="flex flex-col gap-2">
        <p className="text-body-5-medium">인증 입력</p>
        <div className="flex gap-3">
          <Input width="verify" placeholder="인증번호" maxLength={6} />
          <Button width="verify">확인</Button>
        </div>
      </section>

      {/* 비밀번호 토글 */}
      <section className="flex flex-col gap-2">
        <p className="text-body-5-medium">비밀번호 입력</p>
        <Input width="default" type="password" placeholder="비밀번호" />
      </section>
    </div>
  );
}
