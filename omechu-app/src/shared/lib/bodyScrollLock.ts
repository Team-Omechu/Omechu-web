// omechu-app/src/app/lib/utils/bodyScrollLock.ts
let lockCount = 0;
let previousOverflow: string | null = null;

export function lockBodyScroll() {
  if (typeof window === "undefined") return;
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;
}

export function unlockBodyScroll() {
  if (typeof window === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow ?? "";
    previousOverflow = null;
  }
}
