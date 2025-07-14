import React from "react";

type UserInfoSetupLayoutProps = {
  title: string;
  children: React.ReactNode;
  contentClassName?: string;
  paddingClassName?: string;
};

const UserInfoSetupLayout = ({
  title,
  children,
  contentClassName = "",
  paddingClassName = "px-8",
}: UserInfoSetupLayoutProps) => {
  return (
    <div className="flex flex-col items-center w-full px-4 py-6">
      <section className="my-20 text-center">
        <h1 className="text-2xl font-bold text-black whitespace-pre-line">
          {title}
        </h1>
      </section>
      <section
        className={`w-full max-w-xs ${paddingClassName} ${contentClassName}`}
      >
        <div className="flex flex-col w-full gap-5 text-base">{children}</div>
      </section>
    </div>
  );
};

export default UserInfoSetupLayout;
