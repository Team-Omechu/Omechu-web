// TODO: [FSD 마이그레이션] 이 파일은 삭제해도 됩니다.
// 새 위치: src/app/(routes)/settings/terms/page.tsx

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

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
  return (
    <>
      <Header
        title="이용 약관"
        leftChild={
          <Link href="/mypage/settings" aria-label="설정으로 돌아가기">
            <img
              src="/arrow/left-header-arrow.svg"
              alt=""
              width={22}
              height={22}
            />
          </Link>
        }
      />

      <main className="h-[calc(100dvh-3rem)] overflow-y-auto px-2 py-2 scrollbar-hide">
        <ul className="flex flex-col">
          {termsList.map((item) => (
            <li key={item.id}>
              <Link
                href={item.url}
                className="flex w-full items-center justify-between rounded-sm px-6 py-3 hover:bg-main-normal-hover active:bg-main-normal-hover"
              >
                <span className="text-xl font-normal">{item.title}</span>
                <img
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
