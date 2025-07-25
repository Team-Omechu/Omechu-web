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
import { menus } from "@/constant/mainpage/resultData";

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
  const menuId = searchParams.get("menuId");
  console.log("menuId →", menuId);

  const menu = menus.find((item) => item.id === Number(menuId));

  if (!menu) {
    return <p className="p-4">해당 메뉴를 찾을 수 없습니다.</p>;
  }

  const handleClick = () => {
    router.push(`${pathname}/recipe-detail?menuId=${menu.id}`);
  };

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

      <main className="min-h-screen bg-[#F8D5FF] p-4 pt-8 text-sm text-black">
        <h1 className="mb-2 mt-4 text-center text-2xl font-extrabold text-[#2D9CDB]">
          {menu.title}
        </h1>

        <div className="mx-auto mb-6 flex h-36 w-36 justify-center">
          <Image
            src="/logo/logo.png"
            alt={`${menu.title || "메뉴 이미지"}`}
            className="rounded object-contain"
            width={144}
            height={144}
          />
        </div>

        <section className="px-4">
          <MenuInfo
            nutrition={menu.nutrition}
            allergens={menu.allergens}
            onRecipeClick={handleClick}
          />
        </section>
      </main>
    </>
  );
}
