"use client";

import Image from "next/image";
import Link from "next/link";

import Header from "@/components/common/Header";
import { TERMS_MENU_LIST } from "@/components/settings/terms.config";

/**
 * 약관 목록 페이지
 */
export default function TermsListPage() {
  return (
    <>
      <Header
        title="이용 약관"
        leftChild={
          <Link href="/settings" aria-label="설정으로 돌아가기">
            <Image
              src="/arrow/left-header-arrow.svg"
              alt="뒤로가기"
              width={22}
              height={22}
            />
          </Link>
        }
      />

      <main className="h-[calc(100dvh-3rem)] overflow-y-auto px-2 py-2 scrollbar-hide">
        <ul className="flex flex-col">
          {TERMS_MENU_LIST.map((item) => (
            <li key={item.id}>
              <Link
                href={`/mypage/settings/terms/${item.type}`}
                className="flex w-full items-center justify-between rounded-sm px-6 py-3 hover:bg-main-normal-hover active:bg-main-normal-active"
                aria-label={`${item.title} 보기`}
              >
                <span className="text-xl font-normal">{item.title}</span>
                <Image
                  src="/arrow/right_arrow_black.svg"
                  alt=""
                  width={12}
                  height={12}
                />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
