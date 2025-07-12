import React from "react";

type OnboardingStepLayoutProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};

const OnboardingStepLayout = ({
  title,
  children,
}: OnboardingStepLayoutProps) => {
  return (
    <div className="flex flex-col items-center w-full gap-10">
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <div className="flex flex-col w-full max-w-xs gap-4">{children}</div>
    </div>
  );
};

export default OnboardingStepLayout;
