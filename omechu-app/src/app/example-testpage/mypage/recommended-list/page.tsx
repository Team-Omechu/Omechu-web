import { Header } from "@/shared_FSD/index";

export default function RecommendedListPage() {
  return (
    <>
      <Header title="추천 목록 관리" isRightChild={true} />
      <main className="relative mt-10 flex h-[80dvh] flex-col items-center gap-6 px-5"></main>
    </>
  );
}
