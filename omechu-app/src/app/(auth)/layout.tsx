export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-main-normal">
      {/* 
        이 레이아웃은 공통 배경색과 최소 높이만 제공합니다.
        자식 페이지(children)가 내부에서 flex, 정렬 등을 직접 제어합니다.
      */}
      {children}
    </div>
  );
}
