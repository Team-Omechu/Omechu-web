"use client";
import Image from "next/image"; // Next.js에서 제공하는 next/image 컴포넌트 사용
import { useRouter } from "next/navigation";

const BottomNav = () => {
  const router = useRouter(); // React의 useNavigator처럼 변수 선언

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 h-20 bg-white w-full max-w-screen-mobile rounded-t-[10px] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between w-full px-5 py-2.5">
        <div
          onClick={() => {
            router.push("/");
          }}
          className="flex flex-col items-center justify-center gap-1 py-1 rounded-lg cursor-pointer w-14 hover:bg-gray-100"
        >
          <Image src="/Home.png" alt="Home" width={26} height={26} />
          <span className="text-xs font-medium">홈</span>
        </div>
        <div
          onClick={() => {
            router.push("/");
          }}
          className="flex flex-col items-center justify-center gap-1 py-1 rounded-lg cursor-pointer w-14 hover:bg-gray-100"
        >
          <Image src="/menu.png" alt="menu" width={26} height={26} />
          <span className="text-xs font-medium">전체메뉴</span>
        </div>
        <div
          onClick={() => {
            router.push("/");
          }}
          className="flex flex-col items-center justify-center gap-1 py-1 rounded-lg cursor-pointer w-14 hover:bg-gray-100"
        >
          <Image
            src="/restaurant.png"
            alt="restaurant"
            width={26}
            height={26}
          />
          <span className="text-xs font-medium">맛집</span>
        </div>
        <div
          onClick={() => {
            router.push("/mypage");
          }} // 아직 mypage 구현 전 -> div 눌러도 이동 X
          className="flex flex-col items-center justify-center gap-1 py-1 rounded-lg cursor-pointer w-14 hover:bg-gray-100"
        >
          <Image src="/mypage.png" alt="mypage" width={26} height={26} />
          <span className="text-xs font-medium">마이페이지</span>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;

// (이삭) tailwindcss에 shadow-top 클래스는 없어서 직접 지정했습니다. shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]
