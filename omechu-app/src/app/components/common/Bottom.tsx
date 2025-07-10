"use client";
import Image from "next/image"; // Next.js에서 제공하는 next/image 컴포넌트 사용
import { useRouter } from "next/navigation";

const navItems: {
  title: string;
  routingUrl: string;
  imgSrc: string;
  imgAlt: string;
}[] = [
  {
    title: "홈",
    routingUrl: "/",
    imgSrc: "/Home.png",
    imgAlt: "홈",
  },
  {
    title: "전체메뉴",
    routingUrl: "/fullmenu",
    imgSrc: "/menu.svg",
    imgAlt: "전체메뉴",
  },
  {
    title: "맛집",
    routingUrl: "/restaurant-detail",
    imgSrc: "/restaurant.png",
    imgAlt: "맛집",
  },
  {
    title: "마이페이지",
    routingUrl: "/mypage",
    imgSrc: "/mypage.png",
    imgAlt: "마이페이지",
  },
];

const BottomNav = () => {
  const router = useRouter(); // React의 useNavigator처럼 변수 선언

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 h-20 bg-[#f6f6f6] w-full max-w-screen-mobile rounded-t-[10px] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:bg-[#7a7a7a]">
      <div className="flex justify-between w-full px-5 py-2.5">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              router.push(item.routingUrl);
            }}
            className="flex flex-col items-center justify-center gap-1 py-1 rounded-lg cursor-pointer w-14 hover:bg-[#eeeeee] active:bg-[#e2e2e2] dark:hover:bg-[#626262] dark:active:bg-[#494949]"
          >
            <Image src={item.imgSrc} alt={item.imgAlt} width={26} height={26} />
            <span className="text-xs font-medium">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;

// (이삭) tailwindcss에 shadow-top 클래스는 없어서 직접 지정했습니다. shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]
