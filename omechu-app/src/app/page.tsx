import BottomNav from "./components/common/Bottom";
import Header from "./components/common/Header";

export default function Home() {
  return (
    <>
      <Header leftChild={"<"} title={"메인페이지"} rightChild={">"} />
      <div className="flex items-center justify-center w-full h-1/2 pb-20 text-4xl font-bold text-orange-600 bg-[#f8d6ff]">
        Hello Omechu!
      </div>
      <BottomNav />
    </>
  );
}
