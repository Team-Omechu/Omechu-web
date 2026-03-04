"use client";

import type { MenuItem } from "@/entities/menu";
import { RecommendedFoodCard } from "@/shared";

type Props = {
  menus: MenuItem[];
  openMenu: string | null;
  onToggleMenu: (menuName: string) => void;
};

export function ResultMenuList({ menus, openMenu, onToggleMenu }: Props) {
  return (
    <div className="mt-3 ml-2.5 flex flex-col gap-4 px-4">
      {menus.map((menu) => (
        <RecommendedFoodCard
          key={menu.menu}
          menuTitle={menu.menu}
          menuDesc={menu.text}
          src={menu.image_link || ""}
          onCardClick={() => onToggleMenu(menu.menu)}
          selected={openMenu === menu.menu}
        />
      ))}
    </div>
  );
}
