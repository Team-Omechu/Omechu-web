"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";

/** 설정 메뉴 아이템 타입 */
interface SettingsMenuItem {
  id: number;
  title: string;
  url: string;
}

/** 설정 메뉴 목록 */
const SETTINGS_MENU: SettingsMenuItem[] = [
  { id: 1, title: "계정 관리", url: "/settings/account-settings" },
  { id: 2, title: "이용 약관", url: "/settings/terms" },
];

/**
 * 설정 메인 페이지
 * - 계정 관리, 이용 약관 메뉴 제공
 */
export default function SettingsClient() {
  const router = useRouter();

  const handleBack = () => {
    router.push("./");
  };

  return (
    <>
      <Header
        title="설정"
        leftChild={
          <button onClick={handleBack} aria-label="뒤로가기">
            <Image
              src="/arrow/left-header-arrow.svg"
              alt="뒤로가기"
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main className="h-[calc(100dvh-3rem)] px-2 py-3">
        <ul className="flex flex-col">
          {SETTINGS_MENU.map((item) => (
            <li
              key={item.id}
              className="flex w-full flex-col px-6 py-3 hover:bg-main-normal-hover active:bg-main-normal-active"
            >
              <button
                onClick={() => router.push(item.url)}
                className="flex w-full items-center justify-between"
                aria-label={`${item.title} 페이지로 이동`}
              >
                <span className="text-xl font-normal">{item.title}</span>
                <Image
                  src="/arrow/right_arrow_black.svg"
                  alt=""
                  width={12}
                  height={15}
                />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
