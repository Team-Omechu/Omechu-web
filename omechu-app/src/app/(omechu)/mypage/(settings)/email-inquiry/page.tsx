"use client";

import { useRouter } from "next/navigation";

import { Button, FormField, Header, Input } from "@/shared";

export default function EmailInquiryPage() {
  const router = useRouter();
  return (
    <>
      <Header
        title="이메일 문의"
        onBackClick={() => router.push("/")}
        showHomeButton={false}
      />

      <main className="relative mt-10 flex h-[80dvh] flex-col items-center gap-6 px-5">
        <FormField label={"문의제목"} id={"title"}>
          <Input
            id={"title"}
            width="default"
            placeholder={"어떤 내용인지 한 줄로 알려주세요."}
          />
        </FormField>

        <FormField label={"문의 내용"} id={""} className="-mt-2">
          <textarea
            placeholder="궁금한 점이나 개선 의견을 자유롭게 남겨주세요."
            className="bg-brand-secondary text-body-4-regular placeholder:text-font-placeholder border-font-placeholder h-42.5 w-83.5 rounded-[10px] border p-3 outline-none"
          />
        </FormField>
        <Button>접수하기</Button>
      </main>
    </>
  );
}
