/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";

const termsList = [
  { id: 1, title: "계정 관리", url: "/mypage/settings/account-settings" },
  { id: 2, title: "이용 약관", url: "/mypage/settings/terms" },
];

export default function SettingsClient() {
  const router = useRouter();

  return (
    <>
      <Header
        title="설정"
        leftChild={
          <button onClick={() => router.push("./")}>
            <img
              src="/arrow/left-header-arrow.svg"
              alt="changeProfileImage"
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main className="h-[calc(100dvh-3rem)] px-2 py-3">
        <ul className="flex flex-col">
          {termsList.map((item) => (
            <li
              key={item.id}
              className="flex w-full flex-col px-6 py-3 hover:bg-main-normalHover active:bg-[#c6aacc]"
            >
              <button
                onClick={() => router.push(item.url)}
                className="flex w-full items-center justify-between"
              >
                <span className="text-xl font-normal">{item.title}</span>
                <div>
                  <img
                    src="/arrow/right_arrow_black.svg"
                    alt="오른쪽 이동 버튼"
                    width={12}
                    height={15}
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
