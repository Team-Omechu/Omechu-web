"use client";

import { useRouter } from "next/navigation";

import { Header } from "@/shared_FSD/ui/Header";

export default function HeaderTestPage() {
  const router = useRouter();

  const onLeftClick = () => {
    router.push("/");
  };
  const onRightClick = () => {
    router.push("/");
  };
  return (
    <main className="flex flex-col gap-3">
      <Header isRightChild={true} />

      <Header title="맞춤 추천" isRightChild={true} />

      <Header
        title="점심 메뉴 결정전 : The Battle"
        isRightChild={true}
        onLeftClick={onLeftClick}
        onRightClick={onRightClick}
      />
      <Header />
      <Header leftChild="홈으로" />
    </main>
  );
}
