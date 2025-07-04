"use client";

import Image from "next/image";
import BottomNav from "../components/common/Bottom";
import Header from "../components/common/Header";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const router = useRouter();
  const menuList: { title: string; href: string }[] = [
    { title: "프로필 관리", href: "/mypage/profile-edit" },
    { title: "기본 상태 관리", href: "/mypage/user-info-edit" },
    { title: "추천 목록 관리", href: "/" },
    { title: "먹부림 기록", href: "/" },
    { title: "활동 내역", href: "/" },
    { title: "찜 목록", href: "/" },
  ];

  return (
    <>
      <Header
        className={"border-b-0"}
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
          <div className="text-xs font-normal text-[#828282]">
            leej296@naver.com
          </div>
        </section>
        <section className="w-full border-2 bg-white rounded-md border-[#1F9BDA] text-[#00A3FF]">
          {menuList.map((item, index) => {
            const isLast = index === menuList.length - 1;

            return (
              <>
                <button
                  onClick={() => {
                    router.push(item.href);
                  }}
                  className="flex justify-between items-center w-full px-4 pt-3 pb-2.5 hover:bg-[#dfc0e6] hover:text-white"
                >
                  <span className="pl-3 text-lg">{item.title}</span>
                  <span className="pr-3">
                    <Image
                      src={"/right_arrow.svg"}
                      alt={"rightArrow"}
                      width={13}
                      height={13}
                    />
                  </span>
                </button>
                {!isLast && (
                  <div className="h-[0.1px] bg-[#b3d8eb] w-[calc(100%-2.5rem)] mx-auto" />
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
