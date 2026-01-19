import { Menu } from "./types";

export function calculateMenuResult(userAngle: number, menus: Menu[]) {
  const normalized = ((userAngle % 360) + 360) % 360;

  let best = menus[0];
  let minDiff = Infinity;

  menus.forEach((m) => {
    const diff = Math.abs(normalized - m.centerAngle);
    if (diff < minDiff) {
      minDiff = diff;
      best = m;
    }
  });

  return {
    menu: best.name,
    diff: minDiff,
  };
}
