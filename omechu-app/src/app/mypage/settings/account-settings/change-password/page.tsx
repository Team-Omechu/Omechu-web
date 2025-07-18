"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

// 공용 컴포넌트
import AlertModal from "@/app/components/common/AlertModal";
import Header from "@/app/components/common/Header";
import Input from "@/app/components/common/Input";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import Toast from "@/app/components/common/Toast";

const SAMPLE_PASSWORD = "kang@1234"; // 테스트용 기존 비밀번호

export default function ChangePassword() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const [inputPassword, setInputPassword] = useState("");
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");
  const [passwordMatched, setPasswordMatched] = useState<boolean | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<boolean | null>(
    null,
  );
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    boolean | null
  >(null);

  const hasPasswordError = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;
    return !regex.test(password);
  };

  const isFormValid =
    !hasPasswordError(inputNewPassword) &&
    inputNewPassword === inputConfirmPassword;

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

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
          <button
            onClick={() => router.push("/mypage/settings/account-settings")}
          >
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"뒤로가기"}
              width={22}
              height={30}
            />
          </button>
        }
      />

      <main className="mt-16 flex flex-col items-center px-4 py-2">
        <section className="flex w-full flex-col gap-4 px-3">
          <Input
            label="기존 비밀번호"
            type="password"
            value={inputPassword}
            placeholder="기존 비밀번호를 입력해주세요"
            successMessage={passwordMatched ? "비밀번호가 확인되었습니다!" : ""}
            onChange={setInputPassword}
            showError={false}
          />

          <Input
            label="새 비밀번호"
            type="password"
            value={inputNewPassword}
            placeholder="새 비밀번호를 입력해주세요"
            onChange={(v) => {
              setInputNewPassword(v);
              if (newPasswordError) setNewPasswordError(null);
            }}
            onBlur={() =>
              setNewPasswordError(hasPasswordError(inputNewPassword))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter")
                setNewPasswordError(hasPasswordError(inputNewPassword));
            }}
            errorMessage="* 영문 대/소문자, 숫자, 특수문자 포함 8자 이상"
            showError={newPasswordError === true}
          />

          <Input
            label="새 비밀번호 재확인"
            type="password"
            value={inputConfirmPassword}
            placeholder="새 비밀번호를 다시 입력해주세요"
            onChange={(v) => {
              setInputConfirmPassword(v);
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

        <section className="relative mt-5 flex w-full flex-col items-center">
          <Toast
            message={toastMessage}
            show={showToast}
            className={"bottom-20"}
          />
          <button
            onClick={() => {
              if (inputPassword !== SAMPLE_PASSWORD) {
                triggerToast("비밀번호를 다시 확인해주세요!");
                setPasswordMatched(false);
                return;
              }
              setPasswordMatched(true);
              if (isFormValid) {
                setShowModal(true);
              }
            }}
            className={`mt-48 h-[45px] min-w-80 rounded-md text-[17px] font-medium text-white transition ${
              isFormValid
                ? "bg-[#fb4746] hover:bg-[#e2403f] active:bg-[#c93938]"
                : "bg-gray-300"
            }`}
          >
            비밀번호 변경하기
          </button>
        </section>

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
      </main>
    </>
  );
}
