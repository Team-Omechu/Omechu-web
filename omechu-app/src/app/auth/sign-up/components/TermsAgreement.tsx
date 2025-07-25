"use client";

import React from "react";

import { useFormContext } from "react-hook-form";

import Checkbox from "@/auth/components/Checkbox";
import type { SignupFormValues } from "@/lib/schemas/auth.schema";

type ModalType = "service" | "privacy" | "location";

type TermsAgreementProps = {
  setActiveModal: (modal: ModalType | null) => void;
};

const TermsAgreement = ({ setActiveModal }: TermsAgreementProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormValues>();

  const termNames = [
    "termsService",
    "termsPrivacy",
    "termsLocation",
    "termsAge",
  ] as const;

  // '전체 동의' 상태를 useEffect나 useState 없이 직접 계산합니다.
  // 이것이 바로 "완벽하고 확실한" 로직입니다.
  const isAllAgreed = watch(termNames).every(Boolean);

  const handleAllAgreement = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    termNames.forEach((name) =>
      setValue(name, checked, { shouldValidate: true }),
    );
  };

  return (
    <div className="space-y-3 text-grey-darkHover">
      <h2 className="text-center text-lg text-grey-darker">
        서비스 약관에 동의해 주세요
      </h2>
      <Checkbox
        id="all"
        label="아래의 내용을 모두 확인하였으며 모두 동의합니다"
        checked={isAllAgreed}
        onChange={handleAllAgreement}
        variant="round"
      />

      <div className="space-y-2 py-3 pl-2">
        <div className="flex items-center justify-between">
          <Checkbox
            id="termsService"
            label="서비스 이용약관 동의 (필수)"
            {...register("termsService")}
            variant="round"
          />
          <button
            type="button"
            onClick={() => setActiveModal("service")}
            className="text-sm text-gray-500"
          >
            보기
          </button>
        </div>
        {errors.termsService && (
          <p className="pl-2 text-xs text-red-500">
            {errors.termsService.message}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Checkbox
            id="termsPrivacy"
            label="개인정보 처리방침 동의 (필수)"
            {...register("termsPrivacy")}
            variant="round"
          />
          <button
            type="button"
            onClick={() => setActiveModal("privacy")}
            className="text-sm text-gray-500"
          >
            보기
          </button>
        </div>
        {errors.termsPrivacy && (
          <p className="pl-2 text-xs text-red-500">
            {errors.termsPrivacy.message}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Checkbox
            id="termsLocation"
            label="위치 기반 서비스 이용약관 동의 (필수)"
            {...register("termsLocation")}
            variant="round"
          />
          <button
            type="button"
            onClick={() => setActiveModal("location")}
            className="text-sm text-gray-500"
          >
            보기
          </button>
        </div>
        {errors.termsLocation && (
          <p className="pl-2 text-xs text-red-500">
            {errors.termsLocation.message}
          </p>
        )}
      </div>

      <div className="pl-2">
        <Checkbox
          id="termsAge"
          label="본인은 만 14세 이상입니다. (필수)"
          {...register("termsAge")}
          variant="round"
        />
        {errors.termsAge && (
          <p className="pl-2 text-xs text-red-500">{errors.termsAge.message}</p>
        )}
      </div>
    </div>
  );
};

export default TermsAgreement;
