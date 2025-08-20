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
    <section className="w-full rounded-lg border-2 border-secondary-normal bg-white">
      {menuList.map((item, index) => {
        const isLast = index === menuList.length - 1;
        return (
          <div key={index}>
            <button
              onClick={() => router.push(item.href)}
              className="flex w-full items-center justify-between rounded-lg bg-white px-4 pb-2.5 pt-3 text-secondary-normal hover:bg-grey-lightHover hover:text-[#0182CA] active:bg-grey-lightActive active:text-[#0182CA]"
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
              <div className="mx-auto h-[1.2px] w-[calc(100%-2.5rem)] bg-secondary-lightActive" />
            )}
          </div>
        );
      })}
    </section>
  );
}
