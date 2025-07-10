"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import Button from "@/app/components/auth/Button";
import Input from "@/app/components/auth/Input";
import TermsModal from "@/app/components/auth/TermsModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "@/lib/schemas/auth.schema";
import { termsForService } from "@/app/constant/terms/service";
import { termsForPersonlInfo } from "@/app/constant/terms/personlInfo";
import { termsForLocationlInfo } from "@/app/constant/terms/locationInfo";

type Term = {
  index: number | null;
  about: string | null;
  content: string;
};
export default function Signup() {
  // const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isAllAgreed, setIsAllAgreed] = useState(false);

  const [modalContent, setModalContent] = useState<{
    title: string;
    terms: Term[];
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      verificationCode: "",
      password: "",
      passwordConfirm: "",
      termsService: false,
      termsPrivacy: false,
      termsLocation: false,
      termsAge: false,
    },
  });

  const watchAgreements = watch([
    "termsService",
    "termsPrivacy",
    "termsLocation",
    "termsAge",
  ]);

  useEffect(() => {
    const allChecked = watchAgreements.every(Boolean);
    setIsAllAgreed(allChecked);
  }, [watchAgreements]);

  const handleAllAgreement = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsAllAgreed(checked);
    setValue("termsService", checked, { shouldValidate: true });
    setValue("termsPrivacy", checked, { shouldValidate: true });
    setValue("termsLocation", checked, { shouldValidate: true });
    setValue("termsAge", checked, { shouldValidate: true });
  };

  const showModal = (title: string, terms: Term[]) => {
    setModalContent({ title, terms });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);
    // TODO: 회원가입 API 연동
  };

  return (
    <div className="flex flex-col min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-grow px-6"
      >
        <div className="flex-grow w-full max-w-sm mx-auto pt-10">
          <h1 className="text-xl text-center mb-8 text-black">
            회원 정보를 입력해 주세요
          </h1>

          <div className="flex flex-col gap-4">
            <Input
              {...register("email")}
              label="이메일"
              type="email"
              placeholder="example@email.com"
              error={errors.email?.message}
              rightAddon={
                <Button
                  onClick={() => {}}
                  variant="gray"
                  size="small"
                  className="!bg-[#00B2FF] !text-white"
                  type="button"
                >
                  인증번호 재전송
                </Button>
              }
            />
            <Input
              {...register("verificationCode")}
              type="text"
              placeholder="인증번호를 입력해주세요"
              error={errors.verificationCode?.message}
              rightAddon={
                <Button
                  onClick={() => {}}
                  variant="gray"
                  size="small"
                  className="!bg-[#00B2FF] !text-white"
                  type="button"
                >
                  인증번호 확인
                </Button>
              }
            />
            <div className="flex flex-col">
              <Input
                {...register("password")}
                label="비밀번호"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해 주세요"
                error={errors.password?.message}
                rightAddon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2"
                  >
                    <Image
                      src={
                        showPassword
                          ? "/비밀번호보기.svg"
                          : "/mdi-light_eye.svg"
                      }
                      alt="toggle password visibility"
                      width={24}
                      height={24}
                    />
                  </button>
                }
              />
              <p
                className={`text-xs ${
                  errors.password ? "text-red-500" : "text-[#828282]"
                }`}
              >
                * 영문 대소문자, 숫자, 특수문자 포함 8자 이상
              </p>
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <Input
              {...register("passwordConfirm")}
              label="비밀번호 재확인"
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="비밀번호를 다시 입력해주세요"
              error={errors.passwordConfirm?.message}
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="p-2"
                >
                  <Image
                    src={
                      showPasswordConfirm
                        ? "/비밀번호보기.svg"
                        : "/mdi-light_eye.svg"
                    }
                    alt="toggle password visibility"
                    width={24}
                    height={24}
                  />
                </button>
              }
            />
          </div>

          <hr className="my-6 border-[#A3A3A3]" />

          <div className="space-y-3 text-[#393939]">
            <h2 className="text-center text-lg font-normal">
              서비스 약관에 동의해 주세요
            </h2>
            <label htmlFor="all" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="all"
                  checked={isAllAgreed}
                  onChange={handleAllAgreement}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full cursor-pointer checked:bg-[#00B2FF] checked:border-transparent focus:outline-none"
                />
                <span className="absolute inset-0 hidden items-center justify-center text-white peer-checked:flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <span className="ml-2 text-sm">
                아래의 내용을 모두 확인하였으며 모두 동의합니다
              </span>
            </label>
            <div className="pl-3 space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="termsService"
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="termsService"
                      {...register("termsService")}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full cursor-pointer checked:bg-[#00B2FF] checked:border-transparent focus:outline-none"
                    />
                    <span className="absolute inset-0 hidden items-center justify-center text-white peer-checked:flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <span className="ml-2 text-sm">
                    서비스 이용약관 동의(필수)
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => showModal("서비스 이용약관", termsForService)}
                  className="text-sm text-gray-500"
                >
                  보기
                </button>
              </div>
              {errors.termsService && (
                <p className="text-xs text-red-500">
                  {errors.termsService.message}
                </p>
              )}

              <div className="flex items-center justify-between">
                <label
                  htmlFor="termsPrivacy"
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="termsPrivacy"
                      {...register("termsPrivacy")}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full cursor-pointer checked:bg-[#00B2FF] checked:border-transparent focus:outline-none"
                    />
                    <span className="absolute inset-0 hidden items-center justify-center text-white peer-checked:flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <span className="ml-2 text-sm">
                    개인정보 처리방침 동의(필수)
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    showModal("개인정보 처리방침", termsForPersonlInfo)
                  }
                  className="text-sm text-gray-500"
                >
                  보기
                </button>
              </div>
              {errors.termsPrivacy && (
                <p className="text-xs text-red-500">
                  {errors.termsPrivacy.message}
                </p>
              )}

              <div className="flex items-center justify-between">
                <label
                  htmlFor="termsLocation"
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="termsLocation"
                      {...register("termsLocation")}
                      className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full cursor-pointer checked:bg-[#00B2FF] checked:border-transparent focus:outline-none"
                    />
                    <span className="absolute inset-0 hidden items-center justify-center text-white peer-checked:flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <span className="ml-2 text-sm">
                    위치 기반 서비스 이용약관 동의(필수)
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    showModal(
                      "위치 기반 서비스 이용약관",
                      termsForLocationlInfo
                    )
                  }
                  className="text-sm text-gray-500"
                >
                  보기
                </button>
              </div>
              {errors.termsLocation && (
                <p className="text-xs text-red-500">
                  {errors.termsLocation.message}
                </p>
              )}

              <label
                htmlFor="termsAge"
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="termsAge"
                    {...register("termsAge")}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full cursor-pointer checked:bg-[#00B2FF] checked:border-transparent focus:outline-none"
                  />
                  <span className="absolute inset-0 hidden items-center justify-center text-white peer-checked:flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <span className="ml-2 text-sm">
                  본인은 만 14세 이상입니다. (필수)
                </span>
              </label>
              {errors.termsAge && (
                <p className="text-xs text-red-500">
                  {errors.termsAge.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <footer className="w-full mt-auto py-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#1F9BDA] text-white text-xl font-normal hover:bg-[#1c8cc4] active:bg-[#197cae] disabled:bg-gray-300"
          >
            {isSubmitting ? "가입하는 중..." : "가입하기"}
          </button>
        </footer>
      </form>
      {modalContent && (
        <TermsModal
          title={modalContent.title}
          terms={modalContent.terms}
          onConfirm={closeModal}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
