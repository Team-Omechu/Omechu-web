"use client";

import React from "react";

import { Button } from "@/shared_FSD/ui/button/Button";
import { HelperText } from "@/shared_FSD/ui/input/HelperText";
import { Input } from "@/shared_FSD/ui/input/Input";
import { Label } from "@/shared_FSD/ui/input/Label";

export default function InputTestPage() {
  const [error, setError] = React.useState("");
  const [sent, setSent] = React.useState(false);

  const handleVerifyClick = () => {
    setSent(true);
    setError("인증번호 전송 실패");
  };

  return (
    <div className="flex max-w-md flex-col gap-8 p-6">
      <section className="flex flex-col">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          width="default"
          placeholder="이메일 입력"
          type="email"
        />
      </section>

      <section className="flex flex-col">
        <Label htmlFor="verify">인증번호</Label>
        <div className="flex items-center gap-3">
          <Input
            id="verify"
            width="verify"
            placeholder="인증번호"
            maxLength={8}
          />
          <Button width="verify" onClick={handleVerifyClick}>
            인증번호 전송
          </Button>
        </div>
        {sent && <HelperText state="success">인증번호 전송됨</HelperText>}
        {error && <HelperText state="error">인증번호 전송 실패</HelperText>}
      </section>

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
