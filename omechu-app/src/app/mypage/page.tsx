"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import BottomNav from "../components/common/Bottom";
import Header from "../components/common/Header";

export default function MyPage() {
  const router = useRouter();

  const menuList: { title: string; href: string }[] = [
    { title: "프로필 관리", href: "/mypage/profile-edit" },
    { title: "기본 상태 입력", href: "/mypage/user-info-edit" },
    { title: "추천 목록 관리", href: "/mypage/recommended-list" },
    { title: "먹부림 기록", href: "/" },
    { title: "활동 내역", href: "/" },
    { title: "찜 목록", href: "/mypage/favorites" },
  ];

  return (
    <>
      <Header
        className={"border-b-0 hover:bg-[#f8d5ff] dark:hover:bg-[#baa0bf]"}
        rightChild={
          <button onClick={() => router.push("/mypage/settings")}>
            <Image
              src={"/setting.png"}
              alt={"setting"}
              width={25}
              height={25}
            />
          </button>
        }
      />
      <main className="flex h-full w-full flex-col items-center justify-start gap-10 px-8 py-10">
        <section className="flex flex-col items-center">
          <div className="my-4">
            <Image
              src={"/profile.png"}
              alt={"profile"}
              width={75}
              height={75}
            />
          </div>
          <div className="font-md font text-lg">제나</div>
          <div className="text-xs font-normal text-[#828282] dark:text-[#f6f6f6]">
            leej296@naver.com
          </div>
        </section>
        <section className="w-full rounded-xl border-[4px] border-[#1F9BDA] bg-white dark:border-[#1774a4] dark:bg-[#7a7a7a]">
          {menuList.map((item, index) => {
            const isLast = index === menuList.length - 1;
            return (
              <div key={index}>
                <button
                  onClick={() => {
                    router.push(item.href);
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-white px-4 pb-2.5 pt-3 text-[#00A3FF] hover:bg-[#f1f1f1] hover:text-[#1c8cc4] active:bg-[#e2e2e2] active:text-[#197cae] dark:bg-[#7a7a7a] dark:text-[#e9f5fb] dark:hover:bg-[#626262] dark:hover:text-[#ddf0f9] dark:active:bg-[#494949] dark:active:text-[#bae0f4]"
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
                  <div className="mx-auto h-[1.2px] w-[calc(100%-2.5rem)] bg-[#b3d8eb] dark:bg-white" />
                )}
              </div>
            );
          })}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
