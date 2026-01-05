"use client";

import PaginationButton from "@/shared_FSD/ui/button/PaginationButton";
import { Header } from "@/shared_FSD/ui/Header";
import { ProgressBar } from "@/shared_FSD/ui/ProgressBar";

export default function PaginationTestPage() {
  const handlePrev = () => {
    console.log("prev click");
  };

  const handleNext = () => {
    console.log("next click");
  };

  return (
    <>
      <Header />
      <ProgressBar currentStep={1} totalSteps={5} />
      <main className="flex w-full px-2.5">
        <div className="flex w-full items-center">
          <PaginationButton direction="left" onClick={handlePrev} />
          <div className="text-font-highlight flex flex-1 flex-col items-center justify-center text-lg">
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
            <div>본문 컨텐츠 영역</div>
          </div>
          <PaginationButton direction="right" onClick={handleNext} />
        </div>
      </main>
    </>
  );
}
