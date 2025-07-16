"use client";

import { Suspense } from "react";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Header from "@/app/components/common/Header";

export default function RecipeDetail() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <RecipeDetailClient />
    </Suspense>
  );
}
function RecipeDetailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const name = searchParams.get("name");

  return (
    <>
      <Header
        title={""}
        leftChild={
          <button
            onClick={() => {
              router.back();
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

      <main className="min-h-screen bg-[#F8D5FF] p-5 pt-8 text-sm text-black">
        <h1 className="mb-2 mt-4 text-center text-2xl font-extrabold text-[#2D9CDB]">
          {name} 레시피
        </h1>

        <div className="mx-auto mb-6 flex h-36 w-36 justify-center">
          <Image
            src="/logo.png"
            alt={`${name}`}
            className="rounded object-contain"
            width={144}
            height={144}
          />
        </div>

        <section className="px-4 pb-4">
          <h2 className="mb-2 text-base font-semibold">재료</h2>
          <p className="text-[13px] leading-5">
            된장국 두부 20g, 애느타리버섯 20g, 감자 10g, 양파 10g, 대파 10g,
            된장 5g(1작은술), 물 300ml(1½컵)
          </p>
        </section>

        <hr className="mb-4 border-gray-400" />

        <section className="px-4 text-[13px]">
          <h2 className="mb-3 text-base font-semibold">요리법</h2>

          {[
            { text: "감자, 양파를 잘 익도록 얇게 썬다." },
            { text: "애느타리버섯은 썰어 달궈진 팬에 굽는다." },
            { text: "대파를 송송 썬다." },
            {
              text: "냄비에 물을 붓고 된장을 푼 뒤 감자, 양파, 두부를 넣어 재료가 투명해지게 끓인다.",
              image: "/step1.jpg",
            },
            {
              text: "된장국의 재료를 건져서 국물 한 국자와 믹서에 넣어 간 다음 된장국에 다시 넣어 한 번 더 끓인다.",
              image: "/step2.jpg",
            },
            {
              text: "구운 애느타리버섯과 대파를 국에 넣어 끓인 후 그릇에 담는다.",
              image: "/step3.jpg",
            },
          ].map((step, index) => (
            <div key={index} className="mb-6">
              <p className="flex items-start gap-2">
                <span className="mt-0.5 h-fit rounded bg-[#2D9CDB] px-1.5 text-xs text-white">
                  {index + 1}
                </span>
                <span>{step.text}</span>
              </p>
              {step.image && (
                <div className="mt-2 flex justify-center">
                  <Image
                    src={"logo.png"}
                    alt={`step-${index + 1}`}
                    width={200}
                    height={150}
                    className="rounded-md"
                  />
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
