"use client";

import { Suspense } from "react";

import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import Header from "@/app/components/common/Header";
import { menus } from "@/app/constant/mainpage/resultData";
import MenuInfo from "@/app/mainpage/components/MenuInfoCard";

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
  const params = useParams();
  const menuId = Number(params.menuId);

  const menu = menus.find((m) => m.id === menuId);
  if (!menu) {
    return <p className="p-4">해당 메뉴를 찾을 수 없습니다.</p>;
  }

  const name = searchParams.get("name");
  const encodedName = name ? `?name=${encodeURIComponent(name)}` : "";

  const handleClick = () => {
    router.push(`${pathname}/recipe-detail${encodedName}`);
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
              src={"/left_arrow.png"}
              alt={"뒤로가기"}
              width={10}
              height={10}
            />
          </button>
        }
      />

      <main className="min-h-screen bg-[#F8D5FF] p-4 pt-8 text-sm text-black">
        <h1 className="mb-2 mt-4 text-center text-2xl font-extrabold text-[#2D9CDB]">
          {name}
        </h1>

        <div className="mx-auto mb-6 flex h-36 w-36 justify-center">
          <Image
            src="/logo.png"
            alt={`${name || "메뉴 이미지"}`}
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
