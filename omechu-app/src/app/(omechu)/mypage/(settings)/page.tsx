"use client";

import { useRouter } from "next/navigation";

import { Header } from "@/shared";

export default function EmailInquiryPage() {
  const router = useRouter();
  return (
    <>
      <Header title="이메일 문의" onBackClick={() => router.push("/")} />

      <main className="relative mt-10 flex h-[80dvh] flex-col items-center gap-6 px-5"></main>
    </>
  );
}
