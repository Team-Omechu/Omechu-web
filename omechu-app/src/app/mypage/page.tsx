/* eslint-disable @next/next/no-img-element */
import ProfileSection from "./ProfileSection";
import MenuSection from "./MenuSection";
import BottomNav from "../components/common/Bottom";
import Header from "../components/common/Header";
import Link from "next/link";

const menuList: { title: string; href: string }[] = [
  { title: "프로필 관리", href: "/mypage/profile-edit" },
  { title: "기본 상태 입력", href: "/mypage/user-info-edit" },
  { title: "추천 목록 관리", href: "/mypage/recommended-list" },
  { title: "먹부림 기록", href: "/mypage/foodie-log" },
  { title: "활동 내역", href: "/mypage/my-activity" },
  { title: "찜 목록", href: "/mypage/favorites" },
];

export default function MyPage() {
  return (
    <>
      <Header
        className={"border-b-0"}
        rightChild={
          <Link href="/mypage/settings">
            <img src="/setting/setting.svg" alt="설정" width={25} height={25} />
          </Link>
        }
      />

      <main className="flex h-[calc(100dvh-8rem)] w-full flex-col items-center justify-start gap-16 overflow-y-auto px-10 py-16 pb-[env(safe-area-inset-bottom)] scrollbar-hide">
        <ProfileSection />
        <MenuSection menuList={menuList} />
      </main>
      <BottomNav />
    </>
  );
}
