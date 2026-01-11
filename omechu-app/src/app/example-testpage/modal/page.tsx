"use client";

import { useState } from "react";

import Image from "next/image";

import { BaseModal } from "@/shared_FSD/index";

export default function BaseModalTestPage() {
  const [open, setOpen] = useState(true);

  return (
    <main className="relative mb-48 flex h-full flex-col items-center gap-5 p-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-[10px] border px-4 py-2"
      >
        모달 열기
      </button>

      {open && (
        <div className="flex flex-col items-center gap-10">
          <BaseModal
            title="저장 완료!"
            desc="이제 맛있는 메뉴 추천을 받아볼까요?"
            leftButtonText="내 정보 보기"
            rightButtonText="추천 받기"
            onCloseClick={() => {}}
            onLeftButtonClick={() => {}}
            onRightButtonClick={() => {}}
          />

          <BaseModal
            title="메뉴추천을 중단하시겠어요?"
            leftButtonText="그만하기"
            rightButtonText="계속하기"
            onCloseClick={() => {}}
            onLeftButtonClick={() => {}}
            onRightButtonClick={() => {}}
          />
          <BaseModal
            title={`추천목록에서 메뉴를\n제외하시겠어요? `}
            isCloseButtonShow={false}
            leftButtonText="취소"
            rightButtonText="확인"
            onLeftButtonClick={() => {}}
            onRightButtonClick={() => {}}
          />
          <BaseModal
            title="로그아웃 하시겠어요?"
            leftButtonText="취소"
            rightButtonText="확인"
            onCloseClick={() => {}}
            onLeftButtonClick={() => {}}
            onRightButtonClick={() => {}}
          />
          <BaseModal
            title="비밀번호가 변경되었어요."
            rightButtonText="확인"
            isCloseButtonShow={true}
            onCloseClick={() => {}}
            onRightButtonClick={() => {}}
          />
          <BaseModal
            isLogoShow={true}
            isCloseButtonShow={false}
            title="딱 맞는 추천을 원하시나요?"
            desc="로그인 후 더 다양한 서비스를 누려보세요."
            rightButtonText="로그인하기"
            onRightButtonClick={() => {}}
          />

          <div className="bg-foundation-grey-dark h-0.5 w-full rounded-full" />

          <BaseModal
            leftButtonText="다시추천"
            rightButtonText="선택하기"
            onLeftButtonClick={() => {}}
            onRightButtonClick={() => {}}
          >
            <Image
              src={"/sample/sample-pasta.png"}
              alt="음식 이미지"
              width={130}
              height={130}
            />
            <div className="text-body-2-bold text-font-high w-full px-3 text-center leading-tight">
              토마토 파스타 토마토 파스타 토마토 파스타 토마토 파스타 토마토
              파스타
            </div>
          </BaseModal>
        </div>
      )}
    </main>
  );
}
