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
    console.log("[TOAST] trigger:", msg);
    setToastMessage(msg);
    setShowToast(true);
    // 필요시 기존 타이머 clear 로직 추가 가능
    setTimeout(() => {
      console.log("[TOAST] hide");
      setShowToast(false);
    }, 2500);
  };

  const handleSubmit = async () => {
    console.log("[BTN] clicked");
    if (pending) {
      console.log("[BTN] ignored (pending)");
      return;
    }

    // 폼 유효성 실패도 토스트로 알려줌
    if (!isFormValid) {
      console.log("[VALIDATION] invalid form");
      if (hasPasswordError(inputNewPassword)) {
        triggerToast("비밀번호 형식을 확인해주세요.");
      } else if (inputNewPassword !== inputConfirmPassword) {
        triggerToast("새 비밀번호가 일치하지 않습니다.");
      } else {
        triggerToast("입력이 올바르지 않습니다.");
      }
      return;
    }

    try {
      setPending(true);
      console.log("[API] changePassword start", {
        currentPassword: !!inputPassword,
        newPasswordLen: inputNewPassword.length,
      });

      await changePassword({
        currentPassword: inputPassword,
        newPassword: inputNewPassword,
      });

      console.log("[API] changePassword success");
      setShowModal(true); // 성공 모달
    } catch (e: any) {
      // Axios 에러 바디 우선 파싱
      const serverMsg =
        e?.response?.data?.error?.reason ||
        e?.response?.data?.message ||
        e?.message ||
        "비밀번호 변경에 실패했습니다.";
      console.log("[API] changePassword fail:", e?.response || e);
      triggerToast(serverMsg);
    } finally {
      setPending(false);
    }
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
        {/* 토스트: 위치 이슈 방지를 위해 고정 포지션 예시 */}
        <Toast
          message={toastMessage}
          show={showToast}
          className="absolute bottom-72 left-1/2 z-[9999] -translate-x-1/2"
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
                ? "bg-primary-normal hover:bg-primary-normalHover active:bg-primary-normalActive"
                : "bg-gray-300"
            } ${pending ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {pending ? "변경 중..." : "비밀번호 변경하기"}
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
