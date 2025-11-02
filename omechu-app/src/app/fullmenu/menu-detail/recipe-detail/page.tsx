"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Header from "@/components/common/Header";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { useGetMenuInfoQuery } from "@/fullmenu/hooks/useMenuQueries";
import type { MenuDetail } from "@/lib/types/menu";

export default function RecipeDetail() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <RecipeDetailClient />
    </Suspense>
  );
}

function RecipeDetailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menuName = searchParams.get("menuName");
  console.log("menuName →", menuName);

  const {
    data: menuResponse,
    isLoading,
    error,
  } = useGetMenuInfoQuery(menuName || "", !!menuName);

  // API 응답 구조에서 메뉴 데이터 추출
  let menu: MenuDetail | undefined;
  if (menuResponse?.success) {
    menu = menuResponse.success;
  } else if (
    menuResponse &&
    typeof menuResponse === "object" &&
    "name" in menuResponse
  ) {
    menu = menuResponse as unknown as MenuDetail;
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <>
        <Header
          title=""
          leftChild={
            <button onClick={() => router.back()}>
              <Image
                src={"/arrow/left-header-arrow.svg"}
                alt="뒤로가기"
                width={22}
                height={22}
              />
            </button>
          }
        />
        <main className="min-h-screen bg-main-normal p-4 pt-8">
          <div className="mt-20">
            <LoadingIndicator />
          </div>
        </main>
      </>
    );
  }

  // 에러 또는 데이터 없음
  if (error || !menu) {
    return (
      <>
        <Header
          title=""
          leftChild={
            <button onClick={() => router.back()}>
              <Image
                src={"/arrow/left-header-arrow.svg"}
                alt="뒤로가기"
                width={22}
                height={22}
              />
            </button>
          }
        />
        <main className="min-h-screen bg-main-normal p-4 pt-8">
          <p className="mt-20 text-center text-gray-500">
            해당 메뉴를 찾을 수 없습니다.
          </p>
        </main>
      </>
    );
  }

  // 유튜브 watch 링크를 embed로 변환
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url; // 이미 embed 형식이거나 다른 플랫폼
  };

  return (
    <>
      <Header
        title=""
        leftChild={
          <button onClick={() => router.back()}>
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt="뒤로가기"
              width={22}
              height={22}
            />
          </button>
        }
      />

      <main className="min-h-screen p-5 pt-8 text-sm text-[#393939]">
        <h1 className="mb-12 mt-4 text-center text-2xl font-extrabold text-[#2D9CDB]">
          {menu.name} 레시피
        </h1>

        {menu.recipe_link_source && (
          <p className="mb-2 pr-1 text-end text-sm text-gray-400">
            출처 : {menu.recipe_link_source}
          </p>
        )}

        {/* 레시피 영상 */}
        {menu.recipe_link && (
          <section className="mb-6">
            <div className="mx-auto aspect-video w-full max-w-md overflow-hidden rounded-lg border border-grey-dark-hover shadow-xs">
              <iframe
                src={getEmbedUrl(menu.recipe_link) || ""}
                title={menu.recipe_video_name || "레시피 영상"}
                width="100%"
                height="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {menu.recipe_video_name && (
              <p className="mt-4 text-center text-base text-gray-500">
                &lt;{menu.recipe_video_name}&gt;
              </p>
            )}
          </section>
        )}
      </main>
    </>
  );
}
