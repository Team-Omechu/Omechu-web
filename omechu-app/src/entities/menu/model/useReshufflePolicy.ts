"use client";

import { useCallback, useRef, useState } from "react";

import type { MenuItem } from "@/entities/menu";

type RefetchFn = () => Promise<unknown>;

type Args = {
  isLoggedIn: boolean;
  menus: MenuItem[];
  addException: (menuName: string) => void;
  refetch: RefetchFn;
  setOpenMenu: (v: string | null) => void;
};

type Return = {
  handleReshuffle: () => void;
  showLoginModalForReshuffle: boolean;
  closeLoginModalForReshuffle: () => void;
  reshuffleAttemptCount: number;
};

//Args 타입을 props로 받고 Return 타입을 props로 반환함
export function useReshufflePolicy({
  isLoggedIn,
  menus,
  addException,
  refetch,
  setOpenMenu,
}: Args): Return {
  const attemptsRef = useRef(0);
  const [reshuffleAttemptCount, setReshuffleAttemptCount] = useState(0);
  const [showLoginModalForReshuffle, setShowLoginModalForReshuffle] =
    useState(false);

  const closeLoginModalForReshuffle = useCallback(() => {
    setShowLoginModalForReshuffle(false);
  }, []);

  // menus에서 받은 음식 3개를 나눠서 addException에 각각 넣기
  const applyExceptionsAndRefetch = useCallback(() => {
    const exceptionMenus = menus.slice(0, 3).map((m) => m.menu);
    const unique = Array.from(new Set(exceptionMenus));
    unique.forEach(addException);

    void refetch();
    setOpenMenu(null);
  }, [menus, addException, refetch, setOpenMenu]);

  // setState 가 연쇄적으로 발생하는 부수 효과를 방지 (리액트의 렌더 중 업데이트 방지)
  const handleReshuffle = useCallback(() => {
    if (!isLoggedIn) {
      const next = attemptsRef.current + 1;
      attemptsRef.current = next;
      setReshuffleAttemptCount(next);

      if (next >= 3) {
        setShowLoginModalForReshuffle(true);
        return;
      }

      applyExceptionsAndRefetch();
      return;
    }

    // 로그인 상태면 무제한
    applyExceptionsAndRefetch();
  }, [isLoggedIn, applyExceptionsAndRefetch]);

  return {
    handleReshuffle,
    showLoginModalForReshuffle,
    closeLoginModalForReshuffle,
    reshuffleAttemptCount,
  };
}
