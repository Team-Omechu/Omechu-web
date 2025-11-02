"use client";

import React from "react";

import { useFormContext } from "react-hook-form";

import Checkbox from "@/components/common/Checkbox";
import type { SignupFormValues } from "@/entities/user/model/auth.schema";

type ModalType = "service" | "privacy" | "location";

type TermsAgreementProps = {
  setActiveModal: (modal: ModalType | null) => void;
};

const TermsAgreement = ({ setActiveModal }: TermsAgreementProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors, touchedFields, submitCount },
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

  // 에러 메시지는 해당 체크박스를 만졌거나(form touched) 또는 한 번이라도 제출을 시도했을 때만 노출
  const shouldShowServiceError =
    !!errors.termsService && (touchedFields.termsService || submitCount > 0);
  const shouldShowPrivacyError =
    !!errors.termsPrivacy && (touchedFields.termsPrivacy || submitCount > 0);
  const shouldShowLocationError =
    !!errors.termsLocation && (touchedFields.termsLocation || submitCount > 0);
  const shouldShowAgeError =
    !!errors.termsAge && (touchedFields.termsAge || submitCount > 0);

  const handleAllAgreement = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    termNames.forEach((name) =>
      setValue(name, checked, { shouldValidate: true }),
    );
  };

  return (
    <div className="space-y-3 text-grey-dark-hover">
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
            className="text-sm text-grey-normal-active"
          >
            보기
          </button>
        </div>
        {shouldShowServiceError && (
          <p className="pl-2 text-xs text-primary-normal">
            {errors.termsService?.message}
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
            className="text-sm text-grey-normal-active"
          >
            보기
          </button>
        </div>
        {shouldShowPrivacyError && (
          <p className="pl-2 text-xs text-primary-normal">
            {errors.termsPrivacy?.message}
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
            className="text-sm text-grey-normal-active"
          >
            보기
          </button>
        </div>
        {shouldShowLocationError && (
          <p className="pl-2 text-xs text-primary-normal">
            {errors.termsLocation?.message}
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
        {shouldShowAgeError && (
          <p className="pl-2 text-xs text-primary-normal">
            {errors.termsAge?.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default TermsAgreement;
