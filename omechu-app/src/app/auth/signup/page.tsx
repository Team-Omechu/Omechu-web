"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";

// import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Button from "@/app/components/auth/Button";
import Input from "@/app/components/auth/Input";
import TermsModal from "@/app/components/auth/TermsModal";
import { termsForLocationlInfo } from "@/app/constant/terms/locationInfo";
import { termsForPersonlInfo } from "@/app/constant/terms/personlInfo";
import { termsForService } from "@/app/constant/terms/service";
import { signupSchema, SignupFormValues } from "@/lib/schemas/auth.schema";

export default function Signup() {
  // const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isAllAgreed, setIsAllAgreed] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
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

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);
    // TODO: 회원가입 API 연동
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F8D5FF] px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-xl font-bold text-black">
          회원 정보를 입력해 주세요
        </h1>

        <div className="space-y-4">
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
                인증번호 전송
              </Button>
            }
          />
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
                  src="/eye_open.svg"
                  alt="toggle password visibility"
                  width={24}
                  height={24}
                />
              </button>
            }
          />
          <p className="mt-1 -translate-y-3 text-xs text-[#828282]">
            * 영문, 숫자, 특수문자 포함 8자 이상
          </p>
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
                  src="/eye_open.svg"
                  alt="toggle password visibility"
                  width={24}
                  height={24}
                />
              </button>
            }
          />
        </div>

        <hr className="my-6 border-[#E0DFFD]" />

        <div className="space-y-3 text-gray-800">
          <h2 className="text-lg font-bold">서비스 약관에 동의해 주세요</h2>
          <label htmlFor="all" className="flex cursor-pointer items-center">
            <div className="relative">
              <input
                type="checkbox"
                id="all"
                checked={isAllAgreed}
                onChange={handleAllAgreement}
                className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-gray-300 checked:border-transparent checked:bg-[#00B2FF] focus:outline-none"
              />
              <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
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
          <div className="space-y-2 pl-7">
            <div className="flex items-center justify-between">
              <label
                htmlFor="termsService"
                className="flex cursor-pointer items-center"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="termsService"
                    {...register("termsService")}
                    className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-gray-300 checked:border-transparent checked:bg-[#00B2FF] focus:outline-none"
                  />
                  <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
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
                <span className="ml-2 text-sm">서비스 이용약관 동의(필수)</span>
              </label>
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
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
                className="flex cursor-pointer items-center"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="termsPrivacy"
                    {...register("termsPrivacy")}
                    className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-gray-300 checked:border-transparent checked:bg-[#00B2FF] focus:outline-none"
                  />
                  <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
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
                onClick={() => setShowPrivacyModal(true)}
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
                className="flex cursor-pointer items-center"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="termsLocation"
                    {...register("termsLocation")}
                    className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-gray-300 checked:border-transparent checked:bg-[#00B2FF] focus:outline-none"
                  />
                  <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
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
                onClick={() => setShowLocationModal(true)}
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
              className="flex cursor-pointer items-center"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  id="termsAge"
                  {...register("termsAge")}
                  className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-gray-300 checked:border-transparent checked:bg-[#00B2FF] focus:outline-none"
                />
                <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
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
              <p className="text-xs text-red-500">{errors.termsAge.message}</p>
            )}
          </div>
        </div>
        <div className="mt-8">
          <Button
            type="submit"
            variant="gray"
            size="large"
            disabled={isSubmitting}
            className="!bg-[#00B2FF] !text-white"
          >
            {isSubmitting ? "가입하는 중..." : "가입하기"}
          </Button>
        </div>
      </form>

      {showTermsModal && (
        <TermsModal
          title="서비스 이용약관"
          terms={termsForService}
          onConfirm={() => {
            setValue("termsService", true, { shouldValidate: true });
            setShowTermsModal(false);
          }}
          onClose={() => setShowTermsModal(false)}
        />
      )}
      {showPrivacyModal && (
        <TermsModal
          title="개인정보 처리방침"
          terms={termsForPersonlInfo}
          onConfirm={() => {
            setValue("termsPrivacy", true, { shouldValidate: true });
            setShowPrivacyModal(false);
          }}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}
      {showLocationModal && (
        <TermsModal
          title="위치기반서비스 이용약관"
          terms={termsForLocationlInfo}
          onConfirm={() => {
            setValue("termsLocation", true, { shouldValidate: true });
            setShowLocationModal(false);
          }}
          onClose={() => setShowLocationModal(false)}
        />
      )}
    </div>
  );
}
