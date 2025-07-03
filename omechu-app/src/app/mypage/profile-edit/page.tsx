"use client";

import Header from "@/app/components/common/Header";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfileEdit() {
  const router = useRouter();
  return (
    <>
      <Header
        title={"프로필 관리"}
        leftChild={
          <button
            onClick={() => {
              router.back();
            }}
          >
            {"<"}
          </button>
        }
      />
      <main className="flex flex-col items-center justify-around w-full px-4 py-6 min-h-[calc(100vh-10rem)]">
        <section className="flex items-center justify-center gap-10 h-44">
          <div className="relative px-3">
            <div className="mb-3 rotate-45">
              <Image
                src={"/profile.png"}
                alt={"changeProfileImage"}
                width={73}
                height={73}
              />
            </div>
            <div className="absolute top-0 right-0">
              <Image
                src={"/camera_icon.png"}
                alt={"uploadingImage"}
                width={25}
                height={20}
              />
            </div>
            <button className="text-sm ml-1 text-[#48528E] text-center font-normal">
              사진지우기
            </button>
          </div>
          <div className="flex flex-col gap-1 mb-8 itmes-center">
            <div className="text-lg font-medium text-[#393939]">닉네임</div>
            <div className="relative">
              <input
                className="w-44 rounded-md h-9 border-[1px] border-[#626262] px-2.5 py-2.5 text-[#393939] text-base"
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
            <span className="text-xs font-normal ml-1 text-[#828282]">
              한영문자 2-12글자로 입력해주세요
            </span>
          </div>
        </section>
        <section>
          <button className="w-[335px] h-[45px] bg-[#1F9BDA] hover:bg-[#1c8cc4] rounded-md active:bg-[#197cae] text-white text-[17px] font-medium">
            저장
          </button>
        </section>
      </main>
    </>
  );
}
