<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> f82ba1e4 ([#220]feat:MypageModal 구현)
<<<<<<< HEAD
//! 26.01.13 작업
=======
"use client";

import { Header, MypageModal } from "@/shared_FSD/index";
>>>>>>> cfa94326 ([#220]feat:MypageModal 구현)

>>>>>>> 54b356d0 (fix:변경사항 저장)
"use client";

import { useState } from "react";

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
<<<<<<< HEAD
      <Header />
=======
      <Header title="마이페이지" isRightChild={true} />
<<<<<<< HEAD
      <main className="relative mt-10 flex h-[80dvh] flex-col items-center gap-6 px-5">
        <UserInfoSection
          onNicknameClick={() => {
            setInputValue(userInfo.name);
            setIsModalOpen(true);
          }}
          {...userInfo}
        />
=======
      <main className="mt-10 flex h-[80dvh] flex-col items-center gap-6 px-5">
        <MypageModal
          title={"닉네임 변경"}
          onLeftButtonClick={() => {}}
          onRightButtonClick={() => {}}
        />
        <UserInfoSection {...MOCK_USER_INFO} />
>>>>>>> cfa94326 ([#220]feat:MypageModal 구현)
        <SetAlarmSection />
        <CustomerSupportSection />
      </main>

      {isModalOpen && (
        <ModalWrapper className="pb-52" onClose={handleCloseModal}>
          <MypageModal
            title={"닉네임 변경"}
            placeholder={userInfo.name}
            onChangeInput={(value) => setInputValue(value)}
            inputValue={inputValue}
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
>>>>>>> 54b356d0 (fix:변경사항 저장)
    </>
  );
}
