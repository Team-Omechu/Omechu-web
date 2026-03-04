"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { handleLocation, useLocationAnswerStore } from "@/entities/location";
import { useQuestionAnswerStore } from "@/entities/question";
import { useTagStore } from "@/entities/tag";
import { useAuthStore, useRecommendManagement } from "@/entities/user";
import { Header } from "@/shared";
import { MainPick, MainStartSection } from "@/widgets/mainpage";

export default function MainPage() {
  const router = useRouter();

  // 로그인 여부 확인
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  // 이전 맞춤 추천 옵션 리셋 용
  const { tagDataReset } = useTagStore();
  const { locationReset, setX, setY, setLocationDenied } =
    useLocationAnswerStore();
  const { questionReset, addException, resetExceptions } =
    useQuestionAnswerStore();

  // StartButton 선택 옵션
  const [picked, setPicked] = useState<MainPick>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // 제외 음식 api
  const { data, refetch } = useRecommendManagement();

  // 이전 맞춤 추천 옵션 리셋 함수
  const resetAll = () => {
    tagDataReset();
    locationReset();
    questionReset();
    handleLocation(setX, setY, setLocationDenied);
  };

  // StartButton 라우팅 처리 함수
  const go = (next: string, pick: Exclude<MainPick, null>) => {
    if (isNavigating) return;
    setIsNavigating(true);
    setPicked(pick);

    window.setTimeout(() => {
      resetAll();
      router.push(next);
    }, 120);
  };

  // 1) "이 페이지로 돌아왔을 때" API를 다시 치게 만들기
  useEffect(() => {
    // 로그인이 안되어 있을 시 재요청 block
    if (!isLoggedIn) return;

    const runRefetch = () => {
      // refetch는 Promise 반환하지만 여기서는 fire-and-forget
      void refetch();
    };

    // BFCache(뒤로가기 복원)까지 커버
    const onPageShow = () => runRefetch();
    // 포커스 복귀 시점 커버
    const onFocus = () => runRefetch();

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", onFocus);

    // 최초 진입 시에도 한 번 갱신하고 싶으면 아래 한 줄 유지
    runRefetch();

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", onFocus);
    };
    //prettier-ignore
  }, [refetch]);

  //2) 응답에서 exceptedMenus.name만 뽑아서 addException에 넣기
  useEffect(() => {
    if (!isLoggedIn) {
      //로그아웃 후 메인페이지 리다이렉 시 이전 로그인 상태에서 남아있던 제외목록을 지워주기
      resetExceptions();
      return;
    }

    const exceptedMenus = data?.exceptedMenus;
    if (!Array.isArray(exceptedMenus)) return;

    // 서버 제외목록이 "갱신"되는 걸 정확히 반영하려면:
    // 기존 exceptions를 한번 비우고 최신 목록으로 다시 채우는 게 안전
    resetExceptions();

    exceptedMenus
      .filter((m) => m && typeof m.name === "string" && m.name.trim())
      .forEach((m) => addException(m.name.trim()));
  }, [data, addException, resetExceptions]);

  return (
    <div className="scrollbar-hide relative flex h-screen w-full justify-center overflow-hidden bg-linear-to-b from-pink-200 to-purple-300">
      <Header variant="mypage" className="absolute top-0 left-0 z-20" />

      <div className="pointer-events-none absolute inset-0 bg-black/65" />

      <div className="relative mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl">
        {/*메인페이지 배경화면 이미지*/}
        <Image
          src="/mainpage/mainpage.svg"
          alt="메인 페이지"
          fill
          style={{ objectFit: "cover" }}
          className="object-cover lg:object-contain"
        />
      </div>

      {/*StartButton List*/}
      <MainStartSection
        picked={picked}
        onPickStart={() => go("/mainpage/question-answer/1", "start")}
        onPickBattle={() => go("/menu-battle", "battle")}
        onPickRandom={() => go("/random-recommend", "random")}
      />
    </div>
  );
}
