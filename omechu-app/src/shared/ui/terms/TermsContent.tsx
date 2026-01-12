import type { TermsItem } from "@/shared/constants/terms";

interface TermsContentProps {
  /** 약관 데이터 */
  data: TermsItem[];
  /** 텍스트 크기 (기본: base) */
  textSize?: "sm" | "base";
  /** 컨테이너 클래스명 */
  className?: string;
}

/**
 * 약관 내용 렌더링 공통 컴포넌트
 * - TermsPageTemplate (전체 페이지)와 TermsModal (모달)에서 공통으로 사용
 */
export default function TermsContent({
  data,
  textSize = "base",
  className = "",
}: TermsContentProps) {
  const titleSizeClass = textSize === "sm" ? "text-sm" : "text-base";
  const contentSizeClass = textSize === "sm" ? "text-sm" : "text-base";

  return (
    <div className={className}>
      {data.map((item, key) => (
        <section
          key={item.index || key}
          className="mb-5 flex flex-col justify-start gap-1"
        >
          {/* 조항 번호, 제목 */}
          {item.index && item.about && (
            <div className={`${titleSizeClass} font-bold`}>
              제 {item.index}조 ({item.about})
            </div>
          )}

          {/* 부칙 등 특수 케이스 */}
          {!item.index && !item.about && item.content === "부칙" && (
            <div className={`${titleSizeClass} font-bold`}>{item.content}</div>
          )}

          {/* 조항 내용 */}
          <div
            className={`whitespace-pre-wrap ${contentSizeClass} font-normal leading-relaxed ${
              item.index ? "text-font-low" : "text-font-high"
            }`}
          >
            {item.content}
          </div>
        </section>
      ))}
    </div>
  );
}
