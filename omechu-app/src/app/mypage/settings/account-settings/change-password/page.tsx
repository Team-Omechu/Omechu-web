"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/app/components/common/Header";
import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import Toast from "@/app/components/common/Toast";

const SAMPLE_PASSWORD = "kang@1234";
const ERROR_NOT_CORRECT_NEW_MESSAGE =
  "* 영문 대/소문자, 숫자, 특수문자 포함 8자 이상";

export default function ChagePassword() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);

  const [inputPassword, setInputPassword] = useState("");
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");

  const [newPasswordError, setNewPasswordError] = useState<boolean | null>(
    null
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
            onClick={() => {
              router.push("./");
            }}
          >
            <Image
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />

      <main className="flex flex-col items-center px-2 py-2 mt-20">
        <section className="w-full px-3">
          {/* 기존 비밀번호 */}
          <div className="relative flex flex-col w-full gap-1 mb-5">
            <span className="text-base text-[#393939] font-normal ml-1">
              기존 비밀번호
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={inputPassword}
              placeholder="기존 비밀번호를 입력해주세요"
              onChange={(e) => setInputPassword(e.target.value)}
              onBlur={() => {
                if (inputPassword && inputPassword !== SAMPLE_PASSWORD) {
                  triggerToast("기존 비밀번호가 일치하지 않습니다!");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputPassword !== SAMPLE_PASSWORD) {
                  triggerToast("기존 비밀번호가 일치하지 않습니다!");
                }
              }}
              className="w-full h-10 text-sm text-[#828282] font-normal text-center border-[1px] border-[#626262] rounded-md"
            />
            <Image
              className="absolute rounded-full top-9 right-4 active:bg-gray-200"
              onClick={() => setShowPassword((prev) => !prev)}
              src={showPassword ? "/eye_closed.svg" : "/eye_closed.svg"}
              alt="비밀번호_보기"
              width={24}
              height={24}
            />
          </div>

          {/* 새 비밀번호 */}
          <div className="relative flex flex-col w-full gap-1 mb-5">
            <span className="text-base text-[#393939] font-normal ml-1">
              새 비밀번호
            </span>
            <input
              type={showNewPassword ? "text" : "password"}
              value={inputNewPassword}
              placeholder="새 비밀번호를 입력해주세요"
              onChange={(e) => setInputNewPassword(e.target.value)}
              onBlur={() =>
                setNewPasswordError(hasPasswordError(inputNewPassword))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setNewPasswordError(hasPasswordError(inputNewPassword));
                }
              }}
              className="w-full h-10 text-sm text-[#828282] font-normal text-center border-[1px] border-[#626262] rounded-md"
            />
            {newPasswordError && (
              <span className="text-xs font-normal text-red-500">
                {ERROR_NOT_CORRECT_NEW_MESSAGE}
              </span>
            )}
            <Image
              className="absolute rounded-full top-9 right-4 active:bg-gray-200"
              onClick={() => setShowNewPassword((prev) => !prev)}
              src={showNewPassword ? "/eye_closed.svg" : "/eye_closed.svg"}
              alt="비밀번호_보기"
              width={24}
              height={24}
            />
          </div>

          {/* 새 비밀번호 재확인 */}
          <div className="relative flex flex-col w-full gap-1 mb-5">
            <span className="text-base text-[#393939] font-normal ml-1">
              새 비밀번호 재확인
            </span>
            <input
              type={showNewConfirmPassword ? "text" : "password"}
              value={inputConfirmPassword}
              placeholder="새 비밀번호를 다시 입력해주세요"
              onChange={(e) => setInputConfirmPassword(e.target.value)}
              onBlur={() =>
                setConfirmPasswordError(
                  inputConfirmPassword !== inputNewPassword
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setConfirmPasswordError(
                    inputConfirmPassword !== inputNewPassword
                  );
                }
              }}
              className="w-full h-10 text-sm text-[#828282] font-normal text-center border-[1px] border-[#626262] rounded-md"
            />
            {confirmPasswordError && (
              <span className="text-xs font-normal text-red-500">
                * 새 비밀번호가 일치하지 않습니다!
              </span>
            )}
            <Image
              className="absolute rounded-full top-9 right-4 active:bg-gray-200"
              onClick={() => setShowNewConfirmPassword((prev) => !prev)}
              src={
                showNewConfirmPassword ? "/eye_closed.svg" : "/eye_closed.svg"
              }
              alt="비밀번호_보기"
              width={24}
              height={24}
            />
          </div>
        </section>

        {/* 변경 버튼 */}
        <section className="mt-5">
          <button
            onClick={() => {
              if (inputPassword !== SAMPLE_PASSWORD) {
                triggerToast("기존 비밀번호가 일치하지 않습니다!");
                return;
              }

              if (!isFormValid) {
                triggerToast("비밀번호를 다시 확인해 주세요");
                return;
              }

              setShowModal(true);
            }}
            className={`mt-48 w-[335px] h-[45px] text-white text-[17px] font-medium rounded-md transition
              ${
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

        <Toast message={toastMessage} show={showToast} />
      </main>
    </>
  );
}
