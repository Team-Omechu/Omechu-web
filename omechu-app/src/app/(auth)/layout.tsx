/**
 * 인증 관련 페이지 공통 레이아웃
 * - 기본 컨테이너만 제공
 * - Header, 로고는 각 하위 레이아웃에서 처리
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
