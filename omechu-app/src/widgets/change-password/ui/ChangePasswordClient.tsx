"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { changePassword } from "@/entities/user/api/authApi";
import { BaseModal, Header, Input, ModalWrapper, Toast } from "@/shared";

/**
 * 비밀번호 변경 페이지
 */
export default function ChangePasswordClient() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const [inputPassword, setInputPassword] = useState("");
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");
  const [passwordMatched] = useState<boolean | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<boolean | null>(
    null,
  );
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    boolean | null
  >(null);
  const [pending, setPending] = useState(false);

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
    setTimeout(() => setShowToast(false), 1000);
  };

  const handleSubmit = async () => {
    if (pending) return;

    if (!isFormValid) {
      if (hasPasswordError(inputNewPassword))
        triggerToast("비밀번호 형식을 확인해주세요.");
      else if (inputNewPassword !== inputConfirmPassword)
        triggerToast("새 비밀번호가 일치하지 않습니다.");
      else triggerToast("입력이 올바르지 않습니다.");
      return;
    }

    try {
      setPending(true);
      await changePassword({
        currentPassword: inputPassword,
        newPassword: inputNewPassword,
      });
      setShowModal(true);
    } catch (e: any) {
      const serverMsg =
        e?.response?.data?.error?.reason ||
        e?.response?.data?.message ||
        e?.message ||
        "비밀번호 변경에 실패했습니다.";
      triggerToast(serverMsg);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Header
        title="비밀번호 변경"
        leftChild={
          <button
            onClick={() => router.push("/settings/account-settings")}
            aria-label="뒤로가기"
          >
            <Image
              src="/arrow/left-header-arrow.svg"
              alt="뒤로가기"
              width={22}
              height={30}
            />
          </button>
        }
      />

      <main className="flex h-[calc(100dvh-3rem)] flex-col items-center px-4 py-2">
        {/* 토스트: fixed로 포지셔닝(SSR/스크롤 영향 최소화) */}
        <Toast
          message={toastMessage}
          show={showToast}
          className="fixed bottom-24 left-1/2 z-9999 -translate-x-1/2"
        />

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
          <button
            onClick={handleSubmit}
            disabled={pending}
            className={`mt-48 h-[50px] w-[335px] rounded-md text-[17px] font-medium text-white transition ${
              isFormValid
                ? "bg-primary-normal hover:bg-primary-normal-hover active:bg-primary-normal-active"
                : "bg-gray-300"
            } ${pending ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {pending ? "변경 중..." : "비밀번호 변경하기"}
          </button>
        </section>

        {showModal && (
          <ModalWrapper>
            <BaseModal
              title="비밀번호가 변경되었습니다!"
              rightButtonText="확인"
              isCloseButtonShow={false}
              onRightButtonClick={() => router.push("/settings/account-settings")}
            />
          </ModalWrapper>
        )}
      </main>
    </>
  );
}
