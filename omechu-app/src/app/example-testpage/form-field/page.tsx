"use client";
import React from "react";

import { Button } from "@/shared_FSD/ui/button/Button";
import { FormField } from "@/shared_FSD/ui/form-field/FormField";
import { Input } from "@/shared_FSD/ui/input/Input";

export default function InputTestPage() {
  const [email, setEmail] = React.useState("");
  const [verify, setVerify] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [nickname, setNickname] = React.useState("");

  const [helper, setHelper] = React.useState<{
    text?: string;
    state?: "error" | "success";
    id?: string;
  }>();

  const handleVerifyClick = () => {
    if (!/^\d{6}$/.test(verify)) {
      setHelper({
        text: "인증번호는 6자리 숫자입니다.",
        state: "error",
        id: "verify",
      });
      return;
    }
    setHelper({
      text: "인증번호가 전송되었습니다.",
      state: "success",
      id: "verify",
    });
  };

  return (
    <div className="max-w-md space-y-10 p-6">
      <h1 className="text-body-3-bold">FormField 테스트</h1>

      <FormField
        label="이메일"
        id="email"
        required
        helperText={helper?.id === "email" ? helper.text : undefined}
        helperState={helper?.id === "email" ? helper.state : undefined}
      >
        <Input
          width="default"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 입력을 입력해주세요"
        />
      </FormField>
      <FormField
        label="비밀번호"
        id="password"
        helperText={"* 대소문자, 숫자 및 특수문자 포함 8자 이상"}
        helperState={helper?.id === "password" ? helper.state : undefined}
      >
        <Input
          width="default"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
        />
      </FormField>

      <FormField
        label="인증번호"
        id="verify"
        rightSlot={
          <Button type="button" onClick={handleVerifyClick} disabled={!verify}>
            전송
          </Button>
        }
        helperText={helper?.id === "verify" ? helper.text : undefined}
        helperState={helper?.id === "verify" ? helper.state : undefined}
      >
        <Input
          width="md"
          id="verify"
          value={verify}
          onChange={(e) => setVerify(e.target.value)}
          placeholder="인증번호 입력"
          maxLength={6}
        />
      </FormField>

      <FormField
        label="닉네임"
        id="nickname"
        helperText={helper?.id === "nickname" ? helper.text : undefined}
        helperState={helper?.id === "nickname" ? helper.state : undefined}
      >
        <Input
          width="sm"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 입력"
        />
      </FormField>
    </div>
  );
}
