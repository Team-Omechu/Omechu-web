"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { changePassword } from "@/entities/user/api/authApi";
import {
  BaseModal,
  Button,
  FormField,
  Header,
  Input,
  ModalWrapper,
  Toast,
} from "@/shared";

export default function ChangePasswordPage() {
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
        onBackClick={() => router.push("/mypage/account-setting")}
        showHomeButton={false}
      />

      <main className="relative mt-12 flex h-[80dvh] w-full flex-col items-center justify-between gap-8 px-6">
        <section className="flex w-full flex-col gap-5">
          <FormField label={"기존 비밀번호"} id={""}>
            <Input placeholder={"비밀번호를 입력해주세요"} />
          </FormField>

          <FormField
            label={"새 비밀번호"}
            id={""}
            helperText="* 대소문자, 숫자 및 특수문자 포함 8자 이상"
          >
            <Input placeholder={"새 비밀번호를 입력해주세요"} />
          </FormField>

          <FormField
            label={"새 비밀번호 재확인"}
            id={""}
            helperText="* 대소문자, 숫자 및 특수문자 포함 8자 이상"
          >
            <Input placeholder={"새 비밀번호를 다시 입력해주세요"} />
          </FormField>
        </section>
        <Button onClick={() => setShowModal(true)}>비밀번호 변경하기</Button>
      </main>
      {showModal && (
        <ModalWrapper>
          <BaseModal
            title="비밀번호가 변경되었어요."
            rightButtonText="확인"
            isCloseButtonShow={false}
            onRightButtonClick={() => router.push("/settings/account-setting")}
          />
        </ModalWrapper>
      )}
    </>
  );
}
