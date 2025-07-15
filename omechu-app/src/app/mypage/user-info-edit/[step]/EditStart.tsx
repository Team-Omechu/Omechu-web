"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { indexToSlug } from "@/app/constant/UserInfoEditSteps";
import Header from "@/app/components/common/Header";
import Input from "@/app/components/common/Input";
import { useState } from "react";

export default function EditStart() {
  const router = useRouter();

  const [val1, setVal1] = useState(""); // 테스트옹 상태 선언
  const [val2, setVal2] = useState(""); // 테스트옹 상태 선언
  const [val3, setVal3] = useState(""); // 테스트옹 상태 선언

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
              router.push(`/mypage/user-info-edit/${indexToSlug[1]}`)
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
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className="w-full px-3">
          <Input
            label={"password"}
            type={"password"}
            showButton={false}
            value={val1}
            buttonText="인증하기"
            onChange={(val1) => {
              setVal1(val1);
              console.log(val1);
            }}
          />
        </div>
        <div className="w-full px-3">
          <Input
            label={"email"}
            type="email"
            value={val2}
            showButton={true}
            buttonText="인증번호 확인"
            onChange={(val2) => {
              setVal2(val2);
              console.log(val2);
            }}
          />
        </div>
        <div className="w-full px-3">
          <Input
            label={"닉네임"}
            type="text"
            value={val3}
            description="한영문자 2-12글자 이내로 입력해주세요"
            showButton={true}
            buttonText="인증하기"
            onChange={(val3) => {
              setVal3(val3);
              console.log(val3);
            }}
          />
        </div>
      </main>
    </>
  );
}
