"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
// import { fetchProfile } from "@/mypage/api/profile";
import { useAuthStore } from "@/lib/stores/auth.store";

const navItems: {
  title: string;
  routingUrl: string;
  imgSrcOff: string;
  imgSrcOn: string;
  imgAlt: string;
}[] = [
  {
    title: "홈",
    routingUrl: "/mainpage",
    imgSrcOff: "/bottomNav/bottomNav_home_off.svg",
    imgSrcOn: "/bottomNav/bottomNav_home_on.svg",
    imgAlt: "홈",
  },
  {
    title: "전체메뉴",
    routingUrl: "/fullmenu",
    imgSrcOff: "/bottomNav/bottomNav_menu_off.svg",
    imgSrcOn: "/bottomNav/bottomNav_menu_on.svg",
    imgAlt: "전체메뉴",
  },
  {
    title: "맛집",
    routingUrl: "/restaurant",
    imgSrcOff: "/bottomNav/bottomNav_restaurant_off.svg",
    imgSrcOn: "/bottomNav/bottomNav_restaurant_on.svg",
    imgAlt: "맛집",
  },
  {
    title: "마이페이지",
    routingUrl: "/mypage",
    imgSrcOff: "/bottomNav/bottomNav_mypage_off.svg",
    imgSrcOn: "/bottomNav/bottomNav_mypage_on.svg",
    imgAlt: "마이페이지",
  },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  const prevTokenRef = useRef<string | null | undefined>(accessToken);

  const handleNavClick = (item: (typeof navItems)[number]) => {
    if (pathname === item.routingUrl) return; // 이미 그 페이지면 무시
    router.push(item.routingUrl);
  };

  useEffect(() => {
    if (hasHydrated && !accessToken) {
      // 로그아웃 등 토큰이 없을 때 프로필 캐시 제거
      queryClient.removeQueries({ queryKey: ["profile"], exact: false });
    }
  }, [accessToken, hasHydrated, queryClient]);

  useEffect(() => {
    if (!hasHydrated) return;
    const prev = prevTokenRef.current;
    if (!prev && accessToken) {
      // 로그인 직후: 이전 비인증 상태에서 남아있을 수 있는 profile 쿼리 캐시/에러 제거
      queryClient.removeQueries({ queryKey: ["profile"], exact: false });
    }
    prevTokenRef.current = accessToken;
  }, [accessToken, hasHydrated, queryClient]);

  return (
    <div className="bg-grey-light fixed bottom-0 left-1/2 z-50 h-20 w-full min-w-[375px] -translate-x-1/2 rounded-t-[10px] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex w-full justify-between px-5 py-2.5">
        {navItems.map((item, index) => {
          const isActive = pathname === item.routingUrl;
          const iconSrc = isActive ? item.imgSrcOn : item.imgSrcOff;

          return (
            <div
              key={index}
              onClick={() => handleNavClick(item)}
              className="active:bg-grey-light-active flex w-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg py-1 hover:bg-[#eeeeee]"
            >
              <Image src={iconSrc} alt={item.imgAlt} width={26} height={26} />
              <span
                className={`text-xs font-medium ${isActive ? "text-[#393939] dark:text-white" : "text-gray-500"}`}
              >
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
