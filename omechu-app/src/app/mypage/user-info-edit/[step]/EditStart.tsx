"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/app/components/common/Header";
import { indexToSlug } from "@/app/constant/UserInfoEditSteps";

export default function EditStart() {
  const router = useRouter();

  return (
    <>
      <Header
        className={"border-[#CAC6BF]"}
        leftChild={
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[0]}`)
            }
          >
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />{" "}
      <main className="flex min-h-dvh w-full flex-col items-center overflow-y-scroll overscroll-none scroll-smooth px-4">
        <section className="mb-24 mt-32 flex flex-col gap-5 text-center">
          <div className="text-2xl font-medium">기본 정보 입력하기</div>
          <span className="whitespace-pre font-normal text-[#828282] dark:text-[#fffcfc]">
            기본정보를 저장하여 {"\n"} 더 정교한 메뉴 추천을 받아보세요!
          </span>
          {/* prettier formatOnSave 때문에 whitespace-pre 미적용 -> 추후 수정 */}
        </section>
        <section>
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[1]}`)
            }
            className="flex h-16 w-48 items-center justify-center rounded-md bg-[#FB4746] p-5 text-2xl font-medium text-white hover:bg-[#e2403f] active:bg-[#c93938] dark:bg-[#bc3535] dark:hover:bg-[#972b2a] dark:active:bg-[#71201f]"
          >
            시작하기
          </button>
        </section>
      </main>
    </>
  );
}
