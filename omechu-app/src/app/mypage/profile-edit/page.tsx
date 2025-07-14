"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/app/components/common/Header";

export default function ProfileEdit() {
  const router = useRouter();
  return (
    <>
      <Header
        title={"프로필 관리"}
        leftChild={
          <button
            onClick={() => {
              router.push("/mypage");
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
      <main className="min-h-100dvh relative flex w-full flex-col items-center overflow-y-scroll scroll-smooth px-4">
        <section className="mt-36 flex h-44 items-center justify-center gap-10">
          <div className="relative px-3">
            <div className="mb-3 rotate-45">
              <Image
                src={"/profile.png"}
                alt={"changeProfileImage"}
                width={73}
                height={73}
              />
            </div>
            <button className="absolute right-0 top-0">
              <Image
                src="/camera_icon.png"
                alt={"uploadingImage"}
                width={25}
                height={20}
              />
            </button>
            <button className="ml-1 text-center text-sm font-normal text-[#48528E] dark:text-[#e9f5fb]">
              사진지우기
            </button>
          </div>
          <div className="itmes-center mb-8 flex flex-col gap-1">
            <div className="text-lg font-medium text-[#393939] dark:text-[#f1f1f1]">
              닉네임
            </div>
            <div className="relative">
              <input
                className="h-9 w-44 rounded-md border-[1px] border-[#626262] px-2.5 py-2.5 text-base text-[#393939]"
                type="text"
                defaultValue={"제나"}
                placeholder="제나"
              />
              <button className="absolute right-2 top-2.5">
                <Image
                  src={"/x_icon.png"}
                  alt={"x-icon"}
                  width={15}
                  height={15}
                />
              </button>
            </div>
            <span className="ml-1 text-xs font-normal text-[#828282] dark:text-[#f6f6f6]">
              한영문자 2-12글자로 입력해주세요
            </span>
          </div>
        </section>
        <section className="mt-36">
          <button className="h-[45px] w-[335px] rounded-md bg-[#1F9BDA] text-[17px] font-medium text-white hover:bg-[#1c8cc4] active:bg-[#197cae] dark:bg-[#1774a4] dark:hover:bg-[#135d83] dark:active:bg-[#0e4662]">
            저장
          </button>
        </section>
      </main>
    </>
  );
}
