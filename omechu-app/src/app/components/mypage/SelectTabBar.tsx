// -------------------------------------------
// [공용 컴포넌트] SelectTabBar 사용법
// -------------------------------------------
//* tabs: 버튼에 표시할 탭 이름 배열 (예: ["추천 목록", "제외 목록"])
//* selectedIndex: 현재 선택된 탭 인덱스 (0부터 시작)
//* onSelect: 탭 클릭 시 실행할 함수, 선택된 탭의 인덱스를 넘겨줌
//
// 이 컴포넌트는 가로로 나열된 버튼들 중 하나만 선택되도록 만든 탭형 UI임.
// 선택된 탭에만 파란 배경 + 검정 테두리 스타일이 적용됨.
//
// 사용 위치 예시:
// - 추천/제외 목록 전환
// - 카테고리 필터
// - 다단계 폼에서 단계 선택 등
//
// 예시 사용법:
//* const [selectedIndex, setSelectedIndex] = useState(0);
// <SelectTabBar
//   tabs={["추천 목록", "제외 목록"]}
//*  selectedIndex={selectedIndex}
//* onSelect={setSelectedIndex}
// />
// -------------------------------------------

type SelectTabBarProps = {
  tabs: string[]; // ["AAA 목록", "BBB 목록"] : AAA와 BBB는 상황에 따라 정의
  selectedIndex: number; // 현재 선택된 탭의 인덱스
  onSelect: (index: number) => void; // 탭 클릭 시 호출되는 함수
  className?: string;
};

export default function SelectTabBar({
  tabs,
  selectedIndex,
  onSelect,
  className,
}: SelectTabBarProps) {
  return (
    <section className="mb-2 flex w-full">
      {tabs.map((item, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`h-12 flex-1 text-lg font-medium ${className} ${
            selectedIndex === index
              ? "border-b-[3px] border-black bg-[#1f9bda] text-white"
              : "border-b-2 border-b-[#828282] bg-white text-[#828282]"
          }`}
        >
          {item}
        </button>
      ))}
    </section>
  );
}
