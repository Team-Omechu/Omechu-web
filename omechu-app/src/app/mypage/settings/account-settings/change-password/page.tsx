"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

// 공용 컴포넌트
import AlertModal from "@/app/components/common/AlertModal";
import Header from "@/app/components/common/Header";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import Toast from "@/app/components/common/Toast";
import PasswordInput from "@/app/components/settings/PasswordInput";

// 테스트용 기존 비밀번호 (임시값)
const SAMPLE_PASSWORD = "kang@1234";

export default function ChagePassword() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // 비밀번호 입력값 상태
  const [inputPassword, setInputPassword] = useState("");
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");

  // 새 비밀번호 유효성 검사 결과 상태
  const [newPasswordError, setNewPasswordError] = useState<boolean | null>(
    null,
  );
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    boolean | null
  >(null);

  // 새 비밀번호 유효성 검사 함수
  const hasPasswordError = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;
    return !regex.test(password);
  };

  // 폼 전체 유효 여부
  const isFormValid =
    !hasPasswordError(inputNewPassword) &&
    inputNewPassword === inputConfirmPassword;

  // 토스트 메시지 상태
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 토스트 호출 함수
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  return (
    <>
      <Header
        title={"비밀번호 변경"}
        leftChild={
          <button onClick={() => router.push("./")}>
            <Image
              src={"/header_left_arrow.png"}
              alt={"뒤로가기"}
              width={22}
              height={30}
            />
          </button>
        }
      />

      <main className="mt-20 flex flex-col items-center px-4 py-2">
        <section className="w-full px-3">
          {/* 기존 비밀번호 입력 */}
          <PasswordInput
            label="기존 비밀번호"
            value={inputPassword}
            placeholder="기존 비밀번호를 입력해주세요"
            onChange={setInputPassword}
            showError={false}
          />

          {/* 새 비밀번호 입력 */}
          <PasswordInput
            label="새 비밀번호"
            value={inputNewPassword}
            placeholder="새 비밀번호를 입력해주세요"
            onChange={(value) => {
              setInputNewPassword(value);
              if (newPasswordError) setNewPasswordError(null);
            }}
            onBlur={() =>
              setNewPasswordError(hasPasswordError(inputNewPassword))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setNewPasswordError(hasPasswordError(inputNewPassword));
              }
            }}
            errorMessage="* 영문 대/소문자, 숫자, 특수문자 포함 8자 이상"
            showError={newPasswordError === true}
          />

          {/* 새 비밀번호 재확인 입력 */}
          <PasswordInput
            label="새 비밀번호 재확인"
            value={inputConfirmPassword}
            placeholder="새 비밀번호를 다시 입력해주세요"
            onChange={(value) => {
              setInputConfirmPassword(value);
              if (confirmPasswordError) setConfirmPasswordError(null);
            }}
            onBlur={() =>
              setConfirmPasswordError(inputConfirmPassword !== inputNewPassword)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setConfirmPasswordError(
                  inputConfirmPassword !== inputNewPassword,
                );
              }
            }}
            errorMessage="* 새 비밀번호가 일치하지 않습니다!"
            showError={confirmPasswordError === true}
          />
        </section>

        {/* 비밀번호 변경 버튼 */}
        <section className="mt-5">
          <button
            onClick={() => {
              if (inputPassword !== SAMPLE_PASSWORD) {
                triggerToast("비밀번호를 다시 확인해주세요!");
                return;
              }

              if (isFormValid) {
                setShowModal(true);
              }
            }}
            className={`mt-48 h-[45px] w-[335px] rounded-md text-[17px] font-medium text-white transition ${
              isFormValid
                ? "bg-[#fb4746] hover:bg-[#e2403f] active:bg-[#c93938]"
                : "bg-gray-300"
            }`}
          >
            비밀번호 변경하기
          </button>
        </section>

        {/* 변경 완료 모달 */}
        {showModal && (
          <ModalWrapper>
            <AlertModal
              title="비밀번호가 변경되었습니다!"
              confirmText="확인"
              onConfirm={() => router.push("/mypage/settings/account-settings")}
              onClose={() => setShowModal(false)}
            />
          </ModalWrapper>
        )}

        {/* 토스트 알림 */}
        <Toast message={toastMessage} show={showToast} />
      </main>
    </>
  );
}
