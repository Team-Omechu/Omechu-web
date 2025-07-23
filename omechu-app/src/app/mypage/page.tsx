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
    { title: "먹부림 기록", href: "/mypage/foodie-log" },
    { title: "활동 내역", href: "/mypage/my-activity" },
    { title: "찜 목록", href: "/mypage/favorites" },
  ];

  return (
    <>
      <Header
        className={"border-b-0"}
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
      <main className="flex h-[calc(100vh-10rem)] w-full flex-col items-center justify-start gap-10 px-8 py-10">
        <section className="flex flex-col items-center">
          <div className="my-4">
            <Image
              src={"/profile/profile_default_img.svg"}
              alt={"profile"}
              width={75}
              height={75}
            />
          </div>
          <div className="font-md font text-lg">제나</div>
          <div className="text-grey-normalActive text-xs font-normal">
            leej296@naver.com
          </div>
        </section>
        <section className="border-secondary-normal w-full rounded-lg border-2 bg-white">
          {menuList.map((item, index) => {
            const isLast = index === menuList.length - 1;
            return (
              <div key={index}>
                <button
                  onClick={() => {
                    router.push(item.href);
                  }}
                  className="hover:bg-grey-lightHover active:bg-grey-lightActive hover:text-secondary-normalHover active:text-secondary-normalActive flex w-full items-center justify-between rounded-lg bg-white px-4 pb-2.5 pt-3 text-[#00A3FF]"
                >
                  <span className="pl-3 text-lg">{item.title}</span>
                  <span className="pr-3">
                    <Image
                      src={"/arrow/right_arrow.svg"}
                      alt={"메뉴 이동 버튼"}
                      width={13}
                      height={13}
                    />
                  </span>
                </button>
                {!isLast && (
                  <div className="bg-secondary-lightActive mx-auto h-[1.2px] w-[calc(100%-2.5rem)]" />
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
