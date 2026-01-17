//! 26.01.13 작업

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  BaseModal,
  BottomButton,
  Header,
  ModalWrapper,
  OnboardingButton,
  ProgressBar,
} from "@/shared/index";

const ALLERGY_OPTIONS = [
  { label: "달걀", value: "egg" },
  { label: "우유", value: "milk" },
  { label: "메밀", value: "buckwheat" },
  { label: "대두", value: "soy" },
  { label: "밀", value: "wheat" },
  { label: "땅콩", value: "peanut" },
  { label: "호두", value: "walnut" },
  { label: "잣", value: "pine_nut" },
  { label: "돼지고기", value: "pork" },
  { label: "소고기", value: "beef" },
  { label: "닭고기", value: "chicken" },
  { label: "고등어", value: "mackerel" },
  { label: "새우", value: "shrimp" },
  { label: "게", value: "crab" },
  { label: "오징어", value: "squid" },
  { label: "조개류", value: "shellfish" },
  { label: "복숭아", value: "peach" },
  { label: "토마토", value: "tomato" },
  { label: "아황산류", value: "sulfites" },
  { label: "그 외", value: "other" },
] as const;

export default function AllergyForm() {
  const router = useRouter();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [showCancleModal, setShowCancleModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  return (
    <>
      <Header
        title="기본 상태 입력"
        onLeftClick={() => router.back()}
        onRightClick={() => setShowCancleModal(true)}
      />
      <ProgressBar currentStep={3} totalSteps={3} />
      <section className="relative flex min-h-[89dvh] flex-col items-center">
        <h1 className="text-foundation-grey-darker mt-12 text-center text-[28px] font-medium whitespace-pre-line">
          알레르기가 있나요?
        </h1>
        <div className="xs:mt-4 mt-10 h-fit w-63.5">
          <div className="grid grid-cols-3 gap-4">
            {ALLERGY_OPTIONS.slice(0, -2).map(({ label }, idx) => (
              <div key={idx}>
                <OnboardingButton
                  selected={selectedIndexes.includes(idx)}
                  width="xs"
                  onClick={() => {
                    if (selectedIndexes.includes(idx)) {
                      setSelectedIndexes(
                        selectedIndexes.filter((i) => i !== idx),
                      );
                    } else {
                      setSelectedIndexes([...selectedIndexes, idx]);
                    }
                  }}
                >
                  {label}
                </OnboardingButton>
              </div>
            ))}
          </div>
          <div className="mt-4 mb-20 grid grid-cols-2 gap-4">
            {ALLERGY_OPTIONS.slice(-2).map(({ label }, idx) => {
              const actualIdx = ALLERGY_OPTIONS.length - 2 + idx;
              return (
                <div key={actualIdx}>
                  <OnboardingButton
                    selected={selectedIndexes.includes(actualIdx)}
                    width="sm"
                    onClick={() => {
                      if (selectedIndexes.includes(actualIdx)) {
                        setSelectedIndexes(
                          selectedIndexes.filter((i) => i !== actualIdx),
                        );
                      } else {
                        setSelectedIndexes([...selectedIndexes, actualIdx]);
                      }
                    }}
                  >
                    {label}
                  </OnboardingButton>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <BottomButton
        disabled={selectedIndexes.length === 0}
        onClick={() => setShowSaveModal(true)}
      >
        저장
      </BottomButton>
      {showCancleModal && (
        <ModalWrapper>
          <BaseModal
            title="기본 상태 입력을 중단하시겠어요?"
            desc="지금까지 작성한 내용은 저장되지 않아요."
            isCloseButtonShow={false}
            leftButtonText="그만하기"
            rightButtonText="계속하기"
            onLeftButtonClick={() => router.push("/example-testpage/mypage")}
            onRightButtonClick={() => setShowCancleModal(false)}
          />
        </ModalWrapper>
      )}

      {showSaveModal && (
        <ModalWrapper>
          <BaseModal
            title="저장 완료!"
            desc="이제 맛있는 메뉴 추천을 받아볼까요?"
            leftButtonText="내 정보 보기"
            rightButtonText="추천 보기"
            onCloseClick={() => setShowSaveModal(false)}
            onLeftButtonClick={() => router.push("/example-testpage/mypage")}
            onRightButtonClick={() => {
              setShowSaveModal(false);
              router.push("/mainpage");
            }}
          />
        </ModalWrapper>
      )}
    </>
  );
}
