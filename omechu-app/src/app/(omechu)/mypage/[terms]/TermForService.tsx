"use client";

import { useRouter } from "next/navigation";

import { Header } from "@/shared";

export default function TermForService() {
  const router = useRouter();
  return (
    <>
      <Header title="서비스 이용 약관" onBackClick={() => router.back()} />
      <main className="mt-10 h-full w-full px-7.5"></main>
    </>
  );
}
