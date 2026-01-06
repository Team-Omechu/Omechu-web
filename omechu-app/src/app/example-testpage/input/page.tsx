"use client";

import React, { useState } from "react";

import { Input } from "@/shared_FSD/ui/input/Input";

export default function InputTestPage() {
  const [value, setValue] = useState("");

  return (
    <main className="flex flex-col items-center gap-4 p-6">
      <Input
        type="email"
        variant="email"
        width="default"
        height="sm"
        rounded="sm"
        placeholder="이메일 입력"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Input
        type="password"
        variant="password"
        width="sm"
        height="sm"
        rounded="md"
        placeholder="비밀번호 입력"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Input
        type="number"
        variant="number"
        width="md"
        height="sm"
        rounded="md"
        placeholder="인증번호 입력"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Input
        type="search"
        width="xs"
        height="sm"
        rounded="md"
        placeholder="검색어 입력"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSearch={() => console.log("검색 실행")}
      />
    </main>
  );
}
