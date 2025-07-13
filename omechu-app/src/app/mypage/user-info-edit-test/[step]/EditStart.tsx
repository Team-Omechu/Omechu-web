"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { indexToSlug } from "@/app/mypage/user-info-edit-test/[step]/page";
import Header from "@/app/components/common/Header";

export default function EditStart() {
  const router = useRouter();

  return (
    <>
      <Header
        className={"border-[#CAC6BF]"}
        leftChild={
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit-test/${indexToSlug[1]}`)
            }
          >
            <Image
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />{" "}
      <main className="flex flex-col items-center w-full px-4 overflow-y-scroll min-h-dvh scroll-smooth overscroll-none">
        <section className="flex flex-col gap-5 mt-32 mb-24 text-center">
          <div className="text-2xl font-medium">기본 정보 입력하기</div>
          <span className="whitespace-pre font-normal text-[#828282] dark:text-[#fffcfc]">
            기본정보를 저장하여 {"\n"} 더 정교한 메뉴 추천을 받아보세요!
          </span>
          {/* prettier formatOnSave 때문에 whitespace-pre 미적용 -> 추후 수정 */}
        </section>
        <section>
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit-test/${indexToSlug[1]}`)
            }
            className="w-48 h-16 p-5 flex items-center justify-center
                      text-white text-2xl font-medium rounded-md 
                      bg-[#FB4746] dark:bg-[#bc3535]
                      hover:bg-[#e2403f] dark:hover:bg-[#972b2a]
                      active:bg-[#c93938] dark:active:bg-[#71201f]"
          >
            시작하기
          </button>
        </section>
      </main>
    </>
  );
}
