// -------------------------------------------
// [공용 컴포넌트] Header 사용법
// -------------------------------------------
// title: 중앙에 표시될 텍스트 또는 노드 (예: 문자열, <div> 등)
// leftChild: 왼쪽에 들어갈 버튼이나 아이콘 등 (예: 뒤로가기 버튼)
// rightChild: 오른쪽에 들어갈 요소 (예: 확인 버튼, 설정 아이콘 등)
// className: 전체 header에 커스텀 스타일 추가할 때 사용
// swapLeftRight: true로 설정하면 leftChild와 rightChild의 위치를 바꿈
//
// 사용 위치 예시:
// 페이지 상단, 모달 상단 등 어디든 헤더가 필요한 부분에서 사용 가능
//
// 예시 1 - 기본 사용:
// <Header
//   title="회원가입"
//   leftChild={<button>뒤로</button>}
//   rightChild={<button>완료</button>}
// />
//
// 예시 2 - 버튼 위치 바꾸기 (모달에서 '네' / '아니요' 순서 뒤집을 때):
// <Header
//   title="삭제하시겠어요?"
//   leftChild={<button>아니요</button>}
//   rightChild={<button>네</button>}
//   swapLeftRight={true}
// />
// -------------------------------------------

"use client";

import Image from "next/image";

type FloatingActionButtonProps = {
  onClick: () => void; // 클릭 시 실행할 함수 (예: scrollToTop)
  alt?: string; // 이미지 대체 텍스트 (기본값: "floating-button")
};

export default function FloatingActionButton({
  onClick,
  alt = "floating-button",
}: FloatingActionButtonProps) {
  return (
    <section className="fixed z-10 transform -translate-x-1/2 bottom-4 left-1/2">
      <button onClick={onClick}>
        <Image
          src="/components/common/floatingActionButton.svg"
          alt={alt}
          width={36}
          height={36}
        />
      </button>
    </section>
  );
}
