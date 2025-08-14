"use client";

import { Suspense } from "react";

import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import Header from "@/components/common/Header";
import MenuInfo from "@/components/common/MenuInfoCard";
import { useGetMenuInfoQuery } from "@/fullmenu/hooks/useMenuQueries";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import type { MenuDetail } from "@/lib/types/menu";

export default function MenuDetail() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <MenuDetailClient />
    </Suspense>
  );
}
function MenuDetailClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const menuName = searchParams.get("menuName");
  console.log("menuName →", menuName);

  const {
    data: menuResponse,
    isLoading,
    error,
  } = useGetMenuInfoQuery(menuName || "", !!menuName);

  console.log("menuResponse:", menuResponse);

  // API 응답 구조에 따라 데이터 추출
  let menu: MenuDetail | undefined;
  if (menuResponse?.success) {
    menu = menuResponse.success;
  } else if (
    menuResponse &&
    typeof menuResponse === "object" &&
    "name" in menuResponse
  ) {
    // 응답이 직접 메뉴 객체인 경우
    menu = menuResponse as unknown as MenuDetail;
  }
  console.log("menu:", menu);

  if (isLoading) {
    return (
      <>
        <Header
          title={""}
          leftChild={
            <button onClick={() => router.push("/fullmenu")}>
              <Image
                src={"/arrow/left-header-arrow.svg"}
                alt={"뒤로가기"}
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

  if (error || !menu) {
    return (
      <>
        <Header
          title={""}
          leftChild={
            <button onClick={() => router.push("/fullmenu")}>
              <Image
                src={"/arrow/left-header-arrow.svg"}
                alt={"뒤로가기"}
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

  return (
    <>
      <Header
        title={""}
        leftChild={
          <button
            onClick={() => {
              router.push("/fullmenu");
            }}
          >
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"뒤로가기"}
              width={22}
              height={22}
            />
          </button>
        }
      />

      <main className="min-h-screen bg-main-normal p-4 pt-8 text-sm text-black">
        <h1 className="mb-2 mt-4 text-center text-2xl font-extrabold text-[#2D9CDB]">
          {menu.name}
        </h1>

        <div className="mx-auto mb-6 flex h-36 w-36 justify-center">
          <Image
            src={menu.image_link || "/logo/logo.png"}
            alt={`${menu.name || "메뉴 이미지"}`}
            className="rounded object-contain"
            width={144}
            height={144}
          />
        </div>

        <section className="px-4">
          <MenuInfo MenuItem={menu as MenuDetail} />
        </section>
      </main>
    </>
  );
}
