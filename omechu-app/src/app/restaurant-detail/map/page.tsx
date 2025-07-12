import dynamic from "next/dynamic";

// 클라이언트 컴포넌트를 동적으로 불러옴 (SSR 비활성화)
const MapClient = dynamic(() => import("./MapClient"), { ssr: false });

export default function Page() {
  return <MapClient />;
}
