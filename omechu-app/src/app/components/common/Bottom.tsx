import Image from "next/image"; // Next.js에서 제공하는 next/image 컴포넌트 사용

const BottomNav = () => {
  return (
    <div className="relative bottom-0 left-0 right-0 h-18 bg-white max-w-screen-mobile rounded-t-[10px] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between w-full px-5 py-2.5">
        <div className="flex flex-col items-center justify-center gap-1 py-1 rounded-lg cursor-pointer w-14 hover:bg-gray-100">
          <Image src="/Home.png" alt="Home" width={26} height={26} />
          <span className="text-xs font-medium">홈</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 py-1 rounded-lg cursor-pointer w-14 hover:bg-gray-100">
          <Image src="/menu.png" alt="menu" width={26} height={26} />
          <span className="text-xs font-medium">전체메뉴</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 py-1 rounded-lg cursor-pointer w-14 hover:bg-gray-100">
          <Image
            src="/restaurant.png"
            alt="restaurant"
            width={26}
            height={26}
          />
          <span className="text-xs font-medium">맛집</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 py-1 rounded-lg cursor-pointer w-14 hover:bg-gray-100">
          <Image src="/mypage.png" alt="mypage" width={26} height={26} />
          <span className="text-xs font-medium">마이페이지</span>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;

// (이삭) tailwindcss에 shadow-top 클래스는 없어서 직접 지정했습니다. shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]
