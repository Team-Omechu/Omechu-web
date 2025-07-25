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
      <main className="flex flex-col items-center justify-start w-full max-h-screen gap-16 px-10 py-16">
        <section className="flex flex-col items-center">
          <div className="my-4">
            <Image
              src={"/profile/profile_default_img.svg"}
              alt={"profile"}
              width={75}
              height={75}
            />
          </div>
          <div className="text-lg font-md">제나</div>
          <div className="text-xs font-normal text-grey-normalActive">
            leej296@naver.com
          </div>
        </section>
        <section className="w-full bg-white border-2 rounded-lg border-secondary-normal">
          {menuList.map((item, index) => {
            const isLast = index === menuList.length - 1;
            return (
              <div key={index}>
                <button
                  onClick={() => {
                    router.push(item.href);
                  }}
                  className="flex w-full items-center justify-between rounded-lg bg-white px-4 pb-2.5 pt-3 text-secondary-normal hover:bg-grey-lightHover hover:text-secondary-normalHover active:bg-grey-lightActive active:text-secondary-normalActive"
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
                  <div className="mx-auto h-[1.2px] w-[calc(100%-2.5rem)] bg-secondary-lightActive" />
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
