"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import apiClient from "@/lib/api/client";

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

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const userId = 1; // 실제 프로젝트에서는 store/context에서 가져와야 함

  const handleNavClick = async (item: (typeof navItems)[0]) => {
    if (item.title === "마이페이지") {
      try {
        const res = await apiClient.get(`/test/profile/${userId}`);
        // profile 데이터: res.data
        router.push(item.routingUrl);
      } catch (err) {
        alert("프로필 정보를 불러오지 못했습니다.");
      }
    } else {
      router.push(item.routingUrl);
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 h-20 w-full min-w-[375px] -translate-x-1/2 rounded-t-[10px] bg-grey-light pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex w-full justify-between px-5 py-2.5">
        {navItems.map((item, index) => {
          const isActive = pathname === item.routingUrl;
          const iconSrc = isActive ? item.imgSrcOn : item.imgSrcOff;

          return (
            <div
              key={index}
              onClick={() => handleNavClick(item)}
              className="flex w-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg py-1 hover:bg-[#eeeeee] active:bg-grey-lightActive"
            >
              <Image src={iconSrc} alt={item.imgAlt} width={26} height={26} />
              <span
                className={`text-xs font-medium ${isActive ? "text-black dark:text-white" : "text-gray-500"}`}
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
