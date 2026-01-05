import Link from "next/link";

export default function ExampleTestPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-body-3-bold">공용 컴포넌트 테스트</h1>

      <Link href="/example_testpage/button">Button</Link>
      <Link href="/example_testpage/button/bottom-button">BottomButton</Link>
    </div>
  );
}
