//! 26.01.12 작업 중
// TODO : onClick 수정

"use client";

import { useState } from "react";

import clsx from "clsx";

import { ArrowIcon } from "@/shared_FSD/assets/icons/index";

export default function SetAlarmSection() {
  const [isAlarmOn, setIsAlarmOn] = useState(true);

  return (
    <section
      className={clsx(
        "relative flex flex-col gap-2",
        "px-6 py-3",
        "h-fit w-84",
        "bg-background-secondary border-font-placeholder rounded-xl border",
      )}
    >
      <div className="text-body-3-medium text-font-high">알림 설정</div>
      <div className="flex w-full justify-between">
        <span className="text-body-4-regular text-font-low w-fit">
          식사 시간 알림
        </span>
        <span className="flex w-fit items-center gap-4">
          <span className="text-body-4-medium text-brand-primary pr-4">
            {isAlarmOn ? "ON" : "OFF"}
          </span>
        </span>
      </div>
      <button
        className="absolute right-4 bottom-4"
        onClick={() => setIsAlarmOn((prev) => !prev)}
      >
        <ArrowIcon className="text-font-extralow" width={9} height={15} />
      </button>
    </section>
  );
}
