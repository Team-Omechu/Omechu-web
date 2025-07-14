import React from "react";

type QuestionAnswerLayoutProps = {
  title: string;
  children: React.ReactNode;
  contentClassName?: string;
  paddingClassName?: string; // paddingClassName prop 추가
};

const QuestionAnswerLayout = ({
  title,
  children,
  contentClassName = "",
  paddingClassName = "px-8", // 기본값을 'px-8'로 설정
}: QuestionAnswerLayoutProps) => {
  return (
    <div className="flex w-full flex-col items-center px-4 py-6">
      <section className="my-20 text-center">
        <h1 className="whitespace-pre-line text-2xl font-bold text-black">
          {title}
        </h1>
      </section>
      <section
        className={`w-full max-w-xs ${paddingClassName} ${contentClassName}`}
      >
        <div className="flex w-full flex-col gap-5 text-base">{children}</div>
      </section>
    </div>
  );
};

export default QuestionAnswerLayout;
