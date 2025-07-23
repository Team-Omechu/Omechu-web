"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import { indexToSlug } from "@/constant/UserInfoEditSteps";

export default function EditStart() {
  const router = useRouter();

  return (
    <>
      <Header
        className={"border-[#CAC6BF]"}
        leftChild={
          <button onClick={() => router.push("/mypage/user-info-edit")}>
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={22}
            />
          </button>
        }
      />{" "}
      <main className="flex min-h-[calc(100vh-3.1rem)] w-full flex-col items-center overflow-y-scroll overscroll-none scroll-smooth px-4">
        <section className="mb-24 mt-32 flex flex-col gap-5 text-center">
          <div className="text-2xl font-medium">기본 정보 입력하기</div>
          <span className="text-grey-normalActive whitespace-pre font-normal">
            기본정보를 저장하여 {"\n"} 더 정교한 메뉴 추천을 받아보세요!
          </span>
          {/* prettier formatOnSave 때문에 whitespace-pre 미적용 -> 추후 수정 */}
        </section>
        <section>
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[1]}`)
            }
            className="bg-primary-normal hover:bg-primary-normalHover active:bg-primary-normalActive flex h-16 w-48 items-center justify-center rounded-md p-5 text-2xl font-medium text-white"
          >
            시작하기
          </button>
        </section>
      </main>
    </>
  );
}
