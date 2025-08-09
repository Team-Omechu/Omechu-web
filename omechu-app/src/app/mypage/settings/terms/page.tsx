/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";

const termsList: { id: number; title: string; url: string }[] = [
  { id: 1, title: "서비스 이용약관", url: "/mypage/settings/terms/service" },
  {
    id: 2,
    title: "개인정보 처리방침",
    url: "/mypage/settings/terms/personal-info",
  },
  {
    id: 3,
    title: "위치 기반 서비스 이용약관",
    url: "/mypage/settings/terms/location-info",
  },
];

export default function Terms() {
  const router = useRouter();

  return (
    <>
      <Header
        title={"이용 약관"}
        leftChild={
          <button
            onClick={() => {
              router.push("/mypage/settings");
            }}
          >
            <img
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main className="h-[calc(100dvh-3rem)] overflow-y-hidden px-2 py-2 scrollbar-hide">
        <ul className="flex flex-col">
          {termsList.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`${item.url}`)}
              className="hover:bg-main-normalHover active:bg-main-normalHover"
            >
              <li className="flex w-full items-center justify-between px-6 py-3">
                <div className="text-xl font-normal">{item.title}</div>
                <div>
                  <img
                    src={"/arrow/right_arrow_black.svg"}
                    alt={"오른쪽 이동 버튼"}
                    width={12}
                    height={15}
                  />
                </div>
              </li>
            </button>
          ))}
        </ul>
      </main>
    </>
  );
}
