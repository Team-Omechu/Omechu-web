"use client";

import { useRouter } from "next/navigation";

import Image from "next/image";
import BottomNav from "../components/common/Bottom";
import Header from "../components/common/Header";

export default function MyPage() {
  const router = useRouter();

  const menuList: { title: string; href: string }[] = [
    { title: "프로필 관리", href: "/mypage/profile-edit" },
    { title: "기본 상태 관리", href: "/mypage/user-info-edit" },
    { title: "추천 목록 관리", href: "/mypage/recommended-list" },
    { title: "먹부림 기록", href: "/" },
    { title: "활동 내역", href: "/" },
    { title: "찜 목록", href: "/" },
  ];

  return (
    <>
      <Header
        className={"border-b-0 hover:bg-[#f8d5ff] dark:hover:bg-[#baa0bf]"}
        rightChild={
          <button onClick={() => router.push("/mypage")}>
            <Image
              src={"/setting.png"}
              alt={"setting"}
              width={25}
              height={25}
            />
          </button>
        }
      />
      <main className="flex flex-col items-center justify-start w-full h-full gap-10 px-8 py-10">
        <section className="flex flex-col items-center">
          <div className="my-4">
            <Image
              src={"/profile.png"}
              alt={"profile"}
              width={75}
              height={75}
            />
          </div>
          <div className="text-lg font-md font">제나</div>
          <div className="text-xs font-normal text-[#828282] dark:text-[#f6f6f6]">
            leej296@naver.com
          </div>
        </section>
        <section className="w-full border-[4px] rounded-xl bg-white border-[#1F9BDA] dark:bg-[#7a7a7a] dark:border-[#1774a4]">
          {menuList.map((item, index) => {
            const isLast = index === menuList.length - 1;
            return (
              <>
                <button
                  onClick={() => {
                    router.push(item.href);
                  }}
                  className="flex justify-between items-center w-full px-4 pt-3 pb-2.5 rounded-xl 
                  bg-white text-[#00A3FF]
                  hover:bg-[#f1f1f1] hover:text-[#1c8cc4]
                  active:bg-[#e2e2e2] active:text-[#197cae]
                  dark:bg-[#7a7a7a] dark:text-[#e9f5fb]
                  dark:hover:bg-[#626262] dark:hover:text-[#ddf0f9]
                  dark:active:bg-[#494949] dark:active:text-[#bae0f4]
                  "
                >
                  <span className="pl-3 text-lg">{item.title}</span>
                  <span className="pr-3">
                    <Image
                      src={"/right_arrow.svg"}
                      alt={"right_arrow"}
                      width={13}
                      height={13}
                    />
                  </span>
                </button>
                {!isLast && (
                  <div className="h-[1.2px] w-[calc(100%-2.5rem)] mx-auto bg-[#b3d8eb] dark:bg-white" />
                )}
              </>
            );
          })}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
