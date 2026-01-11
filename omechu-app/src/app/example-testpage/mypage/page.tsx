<<<<<<< HEAD
=======
<<<<<<< HEAD
//! 26.01.13 작업

>>>>>>> 7a424794 (fix:변경사항 저장)
"use client";

import { useState } from "react";

import { Header, ModalWrapper } from "@/shared";
import { MypageModal } from "@/shared/ui/modal/MypageModal";

import CustomerSupportSection from "./ui/CustomerSupportSection";
import SetAlarmSection from "./ui/SetAlarmSection";
import UserInfoSection from "./ui/UserInfoSection";

const MOCK_USER_INFO = {
  name: "제나",
  exerciseStatus: "다이어트 중",
  favoriteFood: "한식 다른 나라",
  allergy: "갑각류",
};

export default function MypageMain() {
  const [userInfo, setUserInfo] = useState(MOCK_USER_INFO);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleCloseModal = () => {
    setInputValue("");
    setIsModalOpen(false);
  };

  const handleSubmitNickname = () => {
    if (!inputValue.trim()) return;

    // TODO: 닉네임 변경 API
    setUserInfo((prev) => ({
      ...prev,
      name: inputValue,
    }));

    handleCloseModal();
  };

  return (
    <>
      <Header title="마이페이지" isRightChild />

      <main className="relative mt-10 flex h-[80dvh] flex-col items-center gap-6 px-5">
        <UserInfoSection
          {...userInfo}
          onNicknameClick={() => {
            setInputValue(userInfo.name);
            setIsModalOpen(true);
          }}
        />
        <SetAlarmSection />
        <CustomerSupportSection />
      </main>

      {isModalOpen && (
        <ModalWrapper className="pb-52" onClose={handleCloseModal}>
          <MypageModal
            title="닉네임 변경"
            placeholder={userInfo.name}
            inputValue={inputValue}
            onChangeInput={setInputValue}
            onLeftButtonClick={handleCloseModal}
            onRightButtonClick={handleSubmitNickname}
          />
        </ModalWrapper>
      )}
=======
import { Header } from "@/shared_FSD/index";

export default function MypageMain() {
  return (
    <>
      <Header />
>>>>>>> 36422d58 (fix:변경사항 저장)
    </>
  );
}
