"use client";

import { Button } from "@/shared_FSD/ui/button/Button";
import { Input } from "@/shared_FSD/ui/input/Input";
import { Label } from "@/shared_FSD/ui/input/Label";

export default function InputTestPage() {
  return (
    <div className="flex max-w-md flex-col gap-8 p-6">
      {/* 이메일 입력 */}
      <section className="flex flex-col">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          width="default"
          placeholder="이메일 입력"
          type="email"
        />
      </section>

      {/* 인증번호 입력 */}
      <section className="flex flex-col">
        <Label htmlFor="verify">인증번호</Label>
        <div className="flex items-center gap-3">
          <Input
            id="verify"
            width="verify"
            placeholder="인증번호"
            maxLength={8}
          />
          <Button width="verify" onClick={() => console.log("verify click")}>
            인증번호 전송
          </Button>
        </div>
      </section>

      {/* 비밀번호 입력 */}
      <section className="flex flex-col">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          width="default"
          type="password"
          placeholder="비밀번호"
        />
      </section>
    </div>
  );
}
