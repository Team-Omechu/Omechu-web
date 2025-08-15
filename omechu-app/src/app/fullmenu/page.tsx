import { Suspense } from "react";
import FullMenuClient from "./components/FullMenuClient";

export default function FullMenuPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <FullMenuClient />
    </Suspense>
  );
}
