"use client";

import { MenuModal } from "@/shared_FSD/index";

export default function MenuModalTestPage() {
  const mockData = [
    { menuTitle: "샤브샤브", src: "/sample/sample-pasta.png" },
    { menuTitle: "스테이크", src: "/logo/logo.svg" },
    { menuTitle: "사케동" },
  ];

  return (
    <main className="relative flex h-screen flex-col items-center gap-6 p-8">
      <section className="flex w-full flex-col gap-4">
        {mockData.map(({ menuTitle, src }) => (
          <MenuModal
            key={menuTitle}
            menuTitle={menuTitle}
            src={src}
            onCloseClick={() => console.log("모달 닫기")}
            onLeftButtonClick={() => console.log("다시 추천 받기")}
            onRightButtonClick={() => console.log("메뉴 선택하기")}
          />
        ))}
      </section>
    </main>
  );
}
