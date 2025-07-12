"use client";
"use client";

import Header from "@/app/components/common/Header";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

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
  const name = searchParams.get("name");
  const encodedName = name ? `?name=${encodeURIComponent(name)}` : "";

  const handleClick = () => {
    router.push(`${pathname}/recipe-detail${encodedName}`);
  };
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
        <h1 className="text-center text-2xl font-extrabold text-[#2D9CDB] mt-4 mb-2">
          {name}
        </h1>

        <div className="flex justify-center mb-6 mx-auto w-36 h-36">
          <Image
            src="/오메추-로고-보라색버전-모자4 1.png"
            alt={`${name}`}
            className="object-contain rounded"
            width={144}
            height={144}
          />
        </div>

        <section className="px-4">
          <h2 className="text-base font-semibold mb-2">메뉴 정보</h2>

          <div className="border border-gray-400 rounded-md p-4 bg-white text-[13px] leading-6">
            <p className="font-semibold mb-1">기본 영양 정보</p>
            <div className="px-2 grid grid-cols-2 gap-y-1">
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
            <hr className="my-3" />

            <p className="font-semibold">알레르기 유발 성분</p>
            <p className="pl-2 mb-2">땅콩, 달걀</p>
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

