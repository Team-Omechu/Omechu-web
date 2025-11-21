/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";

type MenuItem = {
  title: string;
  href: string;
};

interface MenuSectionProps {
  menuList: MenuItem[];
}

export default function MenuSection({ menuList }: MenuSectionProps) {
  const router = useRouter();

  return (
    <section className="border-secondary-normal w-full rounded-lg border-2 bg-white">
      {menuList.map((item, index) => {
        const isLast = index === menuList.length - 1;
        return (
          <div key={index}>
            <button
              onClick={() => router.push(item.href)}
              className="text-secondary-normal hover:bg-grey-light-hover active:bg-grey-light-active flex w-full items-center justify-between rounded-lg bg-white px-4 pt-3 pb-2.5 hover:text-[#0182CA] active:text-[#0182CA]"
            >
              <span className="pl-3 text-lg">{item.title}</span>
              <img
                src={"/arrow/right_arrow.svg"}
                width={13}
                height={13}
                alt=""
              />
            </button>
            {!isLast && (
              <div className="bg-secondary-light-active mx-auto h-[1.2px] w-[calc(100%-2.5rem)]" />
            )}
          </div>
        );
      })}
    </section>
  );
}
