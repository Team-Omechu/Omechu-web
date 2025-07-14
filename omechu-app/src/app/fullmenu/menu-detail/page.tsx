"use client";

import { Suspense } from "react";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Header from "@/app/components/common/Header";

export default function MenuDetail() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <MenuDetailClient />
    </Suspense>
  );
}
function MenuDetailClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const encodedName = name ? `?name=${encodeURIComponent(name)}` : "";

  const handleClick = () => {
    router.push(`${pathname}/recipe-detail${encodedName}`);
  };

  return (
    <>
      <Header
        title={""}
        leftChild={
          <button
            onClick={() => {
              router.push("/fullmenu");
            }}
          >
            <Image
              src={"/left_arrow.png"}
              alt={"뒤로가기"}
              width={10}
              height={10}
            />
          </button>
        }
      />

      <main className="min-h-screen bg-[#F8D5FF] p-4 pt-8 text-sm text-black">
        <h1 className="mb-2 mt-4 text-center text-2xl font-extrabold text-[#2D9CDB]">
          {name}
        </h1>

        <div className="mx-auto mb-6 flex h-36 w-36 justify-center">
          <Image
            src="/오메추-로고-보라색버전-모자4 1.png"
            alt={`${name || "메뉴 이미지"}`}
            className="rounded object-contain"
            width={144}
            height={144}
          />
        </div>

        <section className="px-4">
          <h2 className="mb-2 text-base font-semibold">메뉴 정보</h2>

          <div className="rounded-md border border-gray-400 bg-white p-4 text-[13px] leading-6">
            <p className="mb-1 font-semibold">기본 영양 정보</p>
            <div className="grid grid-cols-2 gap-y-1 px-2">
              <span>칼로리</span>
              <span className="text-right">950 kcal</span>
              <span>탄수화물</span>
              <span className="text-right">120 g</span>
              <span>단백질</span>
              <span className="text-right">20 g</span>
              <span>지방</span>
              <span className="text-right">35 g</span>
              <span>비타민</span>
              <span className="text-right">비타민 B군</span>
            </div>

            <hr className="my-3" />

            <p className="font-semibold">알레르기 유발 성분</p>
            <p className="mb-2 pl-2">땅콩, 달걀</p>

            <p className="font-semibold">레시피</p>
            <p
              className="cursor-pointer pl-2 text-black underline"
              onClick={handleClick}
            >
              보러가기 ▶
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
