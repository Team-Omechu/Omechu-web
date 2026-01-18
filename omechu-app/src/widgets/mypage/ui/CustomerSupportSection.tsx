//! 26.01.12 작업 중
// TODO : onClick 수정

"use client";

import { useRouter } from "next/navigation";

import clsx from "clsx";

import { ArrowIcon } from "@/shared/assets/icons/index";

const LIST_MAP = [
  { listTitle: "계정관리", hyperLink: "/" },
  { listTitle: "이메일 문의", hyperLink: "/" },
  { listTitle: "서비스 이용약관", hyperLink: "/mypage/service" },
  { listTitle: "개인정보 처리 방침", hyperLink: "/mypage/personal" },
  { listTitle: "위치 기반 서비스 이용약관", hyperLink: "/mypage/location" },
];
export function CustomerSupportSection() {
  const router = useRouter();

  return (
    <section
      className={clsx(
        "relative flex flex-col gap-2",
        "px-6 py-3",
        "h-fit w-84",
        "bg-background-secondary border-font-placeholder rounded-xl border",
      )}
    >
      <div className="text-body-3-medium text-font-high">고객 지원</div>

      <ul className="my-1 flex flex-col gap-3 pl-0.5">
        {LIST_MAP.map((item, idx) => (
          <li key={idx}>
            <button
              onClick={() => router.push(item.hyperLink)}
              className="flex w-full justify-between"
            >
              <div className="text-font-extralow text-body-4-regular">
                {item.listTitle}
              </div>
              <ArrowIcon className="text-font-extralow" width={9} height={15} />
            </button>
          </li>
        ))}
      </ul>

      <div className="text-caption-1-regular text-font-placeholder flex justify-between">
        <div>버전 정보</div>
        <div>v. 5.0.0</div>
      </div>
    </section>
  );
}
