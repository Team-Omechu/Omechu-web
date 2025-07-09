"use client";

import Header from "@/app/components/common/Header";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function MenuDetail() {
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
        title={"기본 상태 입력"}
        leftChild={
          <button
            onClick={() => {
              router.push("./");
            }}
          >
            <Image
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />

      <main className="min-h-screen bg-[#F8D5FF] p-4 pt-8 text-sm text-black">
        <h1 className="text-center text-2xl font-extrabold text-[#2D9CDB] mt-4 mb-2">
          {name}
        </h1>

        <div className="flex justify-center mx-auto mb-6 w-36 h-36">
          <img
            src="/오메추-로고-보라색버전-모자4 1.png"
            alt={`${name}`}
            className="object-contain rounded"
          />
        </div>

        <section className="px-4">
          <h2 className="mb-2 text-base font-semibold">메뉴 정보</h2>

          <div className="border border-gray-400 rounded-md p-4 bg-white text-[13px] leading-6">
            <p className="mb-1 font-semibold">기본 영양 정보</p>
            <div className="grid grid-cols-2 px-2 gap-y-1">
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
            <p className="pl-2 mb-2">땅콩, 달걀</p>

            <p className="font-semibold">레시피</p>
            <p
              className="pl-2 text-black underline cursor-pointer"
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
