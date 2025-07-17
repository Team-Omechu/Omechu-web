"use client";

import { useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import FloatingActionButton from "@/app/components/common/FloatingActionButton";
import Header from "@/app/components/common/Header";

export default function FoodieLog() {
  const mainRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <Header
        title={"먹부림 기록"}
        leftChild={
          <Link href={"/mypage"}>
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </Link>
        }
      />
      <main ref={mainRef} className="flex h-screen w-full flex-col px-2">
        {/* 기간 설정 Tab */}
        <section></section>

        {/* 기간 입력 Tab */}
        <section></section>

        {/* 횟수 | 업데이트 filter Tab */}
        <section></section>

        {/* FoodieLog List */}
        <section></section>
        <FloatingActionButton onClick={scrollToTop} />
      </main>
    </>
  );
}
