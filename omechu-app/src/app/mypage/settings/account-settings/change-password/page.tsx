/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { changePassword } from "@/lib/api/auth";

// 공용 컴포넌트
import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import Input from "@/components/common/Input";
import ModalWrapper from "@/components/common/ModalWrapper";
import Toast from "@/components/common/Toast";

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
            <img
              src={"/arrow/left-header-arrow.svg"}
              alt={"뒤로가기"}
              width={22}
              height={30}
            />
          </button>
        }
      />

      <main className="flex h-[calc(100dvh-3rem)] flex-col items-center px-4 py-2">
        <section className="flex w-full flex-col gap-4 px-3 pt-16">
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
            onClick={async () => {
              // 실제 API 호출
              if (!isFormValid) return;

              try {
                await changePassword({
                  currentPassword: inputPassword,
                  newPassword: inputNewPassword,
                });
                setShowModal(true); // 성공 시 모달
              } catch (e: any) {
                triggerToast(e.message || "비밀번호 변경에 실패했습니다.");
              }
            }}
            className={`mt-48 h-[50px] w-[335px] rounded-md text-[17px] font-medium text-white transition ${
              isFormValid
                ? "bg-primary-normal hover:bg-primary-normalHover active:bg-primary-normalActive"
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
