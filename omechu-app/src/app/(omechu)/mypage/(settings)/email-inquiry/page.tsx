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

      <main className="relative mt-10 flex h-[80dvh] w-full flex-col items-center justify-start gap-6 px-5">
        <FormField label={"문의제목"} id={"title"}>
          <Input
            required
            id={"title"}
            width="default"
            placeholder={"어떤 내용인지 한 줄로 알려주세요."}
          />
        </FormField>
        <FormField label={"문의 내용"} id={""} className="-mt-2">
          <textarea
            required
            placeholder="궁금한 점이나 개선 의견을 자유롭게 남겨주세요."
            className="bg-brand-secondary text-body-4-regular placeholder:text-font-placeholder border-font-placeholder h-42.5 w-83.5 rounded-[10px] border p-3 outline-none"
          />
        </FormField>
        <Button>접수하기</Button>

        <section className="text-font-extralow bg-brand-tertiary flex h-20 w-83.5 items-center justify-center rounded-[10px] text-sm font-medium whitespace-pre-line">
          {`접수하신 문의는 운영자 메일로 전송됩니다. \n 순차적으로 확인 후 최대한 빠르게 이메일로 \n 답장드리겠습니다.`}
        </section>
      </main>
    </>
  );
}
