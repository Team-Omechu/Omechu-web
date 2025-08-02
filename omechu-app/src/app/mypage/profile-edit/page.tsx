/* eslint-disable @next/next/no-img-element */
import Header from "@/components/common/Header";
import ProfileEditSection from "./ProfileEditSection";

export default function ProfileEditPage() {
  return (
    <>
      <Header
        title={"프로필 관리"}
        leftChild={
          <a href="/mypage">
            <img
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={22}
            />
          </a>
        }
      />
      <ProfileEditSection />
    </>
  );
}
