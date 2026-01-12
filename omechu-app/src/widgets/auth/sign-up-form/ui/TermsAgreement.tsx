"use client";

import React from "react";

import { useFormContext } from "react-hook-form";

import type { SignupFormValues } from "@/entities/user/model/auth.schema";
import { CheckBox } from "@/shared";

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
    <div className="flex flex-col gap-[18px]">
      {/* 제목 */}
      <h2 className="text-body-4-medium text-font-high text-center">
        서비스 약관에 동의해 주세요
      </h2>

      {/* 전체 동의 */}
      <CheckBox
        id="all"
        label={
          <span className="text-caption-1-regular text-font-high">
            아래의 내용을 모두 확인하였으며 모두 동의합니다
          </span>
        }
        checked={isAllAgreed}
        onChange={handleAllAgreement}
        variant="round"
      />

      {/* 개별 약관 */}
      <div className="ml-4 flex flex-col gap-3">
        {/* 서비스 이용약관 */}
        <div className="flex items-center justify-between">
          <CheckBox
            id="termsService"
            label={
              <span className="text-caption-1-regular text-font-high">
                서비스 이용약관 동의(필수)
              </span>
            }
            {...register("termsService")}
            variant="round"
          />
          <button
            type="button"
            onClick={() => setActiveModal("service")}
            className="text-caption-2-regular text-font-extralow"
          >
            보기
          </button>
        </div>
        {shouldShowServiceError && (
          <p className="text-caption-2-regular text-status-error ml-6">
            {errors.termsService?.message}
          </p>
        )}

        {/* 개인정보 처리방침 */}
        <div className="flex items-center justify-between">
          <CheckBox
            id="termsPrivacy"
            label={
              <span className="text-caption-1-regular text-font-high">
                개인정보 처리방침 동의(필수)
              </span>
            }
            {...register("termsPrivacy")}
            variant="round"
          />
          <button
            type="button"
            onClick={() => setActiveModal("privacy")}
            className="text-caption-2-regular text-font-extralow"
          >
            보기
          </button>
        </div>
        {shouldShowPrivacyError && (
          <p className="text-caption-2-regular text-status-error ml-6">
            {errors.termsPrivacy?.message}
          </p>
        )}

        {/* 위치 기반 서비스 */}
        <div className="flex items-center justify-between">
          <CheckBox
            id="termsLocation"
            label={
              <span className="text-caption-1-regular text-font-high">
                위치 기반 서비스 이용약관 동의(필수)
              </span>
            }
            {...register("termsLocation")}
            variant="round"
          />
          <button
            type="button"
            onClick={() => setActiveModal("location")}
            className="text-caption-2-regular text-font-extralow"
          >
            보기
          </button>
        </div>
        {shouldShowLocationError && (
          <p className="text-caption-2-regular text-status-error ml-6">
            {errors.termsLocation?.message}
          </p>
        )}

        {/* 만 14세 이상 */}
        <CheckBox
          id="termsAge"
          label={
            <span className="text-caption-1-regular text-font-high">
              본인은 만 14세 이상입니다. (필수)
            </span>
          }
          {...register("termsAge")}
          variant="round"
        />
        {shouldShowAgeError && (
          <p className="text-caption-2-regular text-status-error ml-6">
            {errors.termsAge?.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default TermsAgreement;
