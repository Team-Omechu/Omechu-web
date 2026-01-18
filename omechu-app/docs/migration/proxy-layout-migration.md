# Middleware to Proxy Migration & Layout Refactoring Plan

> **GitHub Issue**: [#218 - middleware → proxy.ts 마이그레이션 및 레이아웃 구조 개선](https://github.com/Team-Omechu/Omechu-web/issues/218)
> **Branch**: `refactor/proxy-layout-migration-#218`
> **작성일**: 2026-01-12
> **상태**: 🚧 진행 중

---

## 1. 개요

### 1.1 배경

Next.js 16에서 `middleware.ts`가 `proxy.ts`로 변경되었습니다. 이 마이그레이션을 진행하면서 동시에 레이아웃 구조도 개선합니다.

### 1.2 현재 문제점

| 문제                               | 위치                               | 영향                           |
| ---------------------------------- | ---------------------------------- | ------------------------------ |
| ClientLayout이 너무 많은 역할 담당 | `src/app/layouts/ClientLayout.tsx` | 유지보수 어려움                |
| BottomNav 표시 여부 하드코딩       | ClientLayout.tsx:67-137            | 새 페이지 추가시마다 배열 수정 |
| Route Group 활용도 낮음            | `(auth)`, `(omechu)`               | 레이아웃 분리 미흡             |
| Next.js 16 미적용                  | `middleware.ts`                    | 최신 패턴 미사용               |

### 1.3 UI 개편 사항 (중요!)

**BottomNavigation 완전 제거** - 새로운 디자인에서는 BottomNav가 없습니다.

- 기존: 하단 네비게이션 바 (홈, 검색, 마이페이지 등)
- 변경: 각 페이지별 액션 버튼 (예: "다음", "완료" 등)

### 1.4 개선 목표

- [x] Next.js 16 `proxy.ts` 패턴 적용
- [x] BottomNavigation 완전 제거
- [x] ClientLayout 역할 최소화 (Axios interceptor만)
- [ ] Route Group 레이아웃 활용도 개선
- [ ] JWT 저장 방식 개선 (백엔드 협의 필요)

---

## 2. 현재 파일 구조 분석

### 2.1 레이아웃 관련 파일

```
omechu-app/
├── middleware.ts                          # → proxy.ts로 변경 예정
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # 루트 레이아웃 (폰트, Provider)
│   │   ├── layouts/
│   │   │   └── ClientLayout.tsx           # 🔴 리팩토링 대상 (150줄)
│   │   ├── (auth)/
│   │   │   ├── layout.tsx                 # 인증 페이지 레이아웃
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── callback/
│   │   └── (omechu)/
│   │       ├── mainpage/
│   │       ├── mypage/
│   │       ├── onboarding/
│   │       ├── random-recommend/
│   │       └── settings/
│   ├── shared/
│   │   ├── ui/
│   │   │   └── Header.tsx                 # ✅ 재사용 가능
│   │   └── lib/
│   │       └── axiosInstance.ts           # Axios interceptor 설정
│   └── widgets/
│       └── layout/
│           └── BottomNavigation.tsx       # 🔴 삭제 예정
```

### 2.2 주요 파일 역할

| 파일                   | 현재 역할                                 | 변경 후                    |
| ---------------------- | ----------------------------------------- | -------------------------- |
| `middleware.ts`        | URL 리라이트                              | `proxy.ts`로 이름 변경     |
| `ClientLayout.tsx`     | Axios 초기화 + 세션 복구 + BottomNav 로직 | Axios 초기화 + 세션 복구만 |
| `BottomNavigation.tsx` | 하단 네비게이션                           | **삭제**                   |
| `Header.tsx`           | 공통 헤더                                 | 유지 (재사용)              |

---

## 3. 마이그레이션 단계

### Phase 1: middleware.ts → proxy.ts 마이그레이션

**파일 변경:**

```bash
# 방법 1: 수동 변경
mv omechu-app/middleware.ts omechu-app/proxy.ts

# 방법 2: Next.js codemod 사용
npx @next/codemod@canary middleware-to-proxy .
```

**코드 변경:**

```typescript
// Before (middleware.ts)
export function middleware(request: NextRequest) { ... }

// After (proxy.ts)
export function proxy(request: NextRequest) { ... }
```

**config 변경:**

```typescript
// skipMiddlewareUrlNormalize → skipProxyUrlNormalize
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

---

### Phase 2: BottomNavigation 제거

**삭제할 파일:**

- `src/widgets/layout/BottomNavigation.tsx` (또는 해당 경로)

**ClientLayout.tsx 수정 사항:**

```typescript
// 삭제할 코드 (67-137줄)
const noBottomNavRoutes = [...];
const dynamicNoBottomNavPrefixes = [...];
const showBottomNav = ...;

// 삭제할 JSX
{showBottomNav && <BottomNavigation />}
```

---

### Phase 3: ClientLayout 리팩토링

**현재 역할:**

1. ✅ Axios interceptors 초기화 → **유지**
2. ✅ 세션 복구 로직 → **유지 (선택적)**
3. ❌ BottomNav 로직 → **제거**
4. ❓ 라우트 보호 로직 → **JWT 저장 방식에 따라 결정**

**리팩토링 후 ClientLayout:**

```typescript
"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/entities/user/model/auth.store";
import { setupAxiosInterceptors } from "@/shared/lib/axiosInstance";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const interceptorsInitialized = useRef(false);

  // Axios interceptors 초기화
  useEffect(() => {
    if (!interceptorsInitialized.current) {
      setupAxiosInterceptors(useAuthStore);
      interceptorsInitialized.current = true;
    }
  }, []);

  return (
    <main className="bg-main-normal scrollbar-hide flex-1 overflow-y-scroll">
      {children}
    </main>
  );
}
```

---

### Phase 4: Route Group 레이아웃 정리

**현재 구조:**

```
app/
├── (auth)/           # 로그인, 회원가입
│   └── layout.tsx    # 단순 배경색만 설정
├── (omechu)/         # 메인 앱 페이지
│   └── (layout.tsx 없음)
└── layout.tsx        # 루트 레이아웃
```

**개선된 구조:**

```
app/
├── (auth)/           # 인증 페이지 (비로그인 전용)
│   └── layout.tsx    # 인증 전용 스타일
├── (omechu)/         # 앱 페이지 (로그인 필요)
│   └── layout.tsx    # 공통 앱 레이아웃 (필요시)
└── layout.tsx        # 루트 (폰트, 메타데이터, Provider)
```

---

## 4. JWT 토큰 저장 방식 (백엔드 협의 필요)

### 옵션 비교

| 방식                         | 보안 | proxy.ts 인증 | 백엔드 수정       | 복잡도    |
| ---------------------------- | ---- | ------------- | ----------------- | --------- |
| **httpOnly 쿠키**            | 높음 | 가능          | 필요 (Set-Cookie) | 중간      |
| **일반 쿠키 + localStorage** | 중간 | 가능          | 최소화            | 낮음      |
| **localStorage만 (현재)**    | 낮음 | 불가능        | 없음              | 가장 낮음 |

### 권장 사항

**보안 우선 시:** httpOnly 쿠키

- XSS 공격에 안전
- proxy.ts에서 서버 측 인증 가능
- 백엔드에서 응답 시 `Set-Cookie` 헤더 추가 필요

**현재 방식 유지 시:** localStorage

- 기존 코드 변경 최소화
- 클라이언트에서만 라우트 보호 (현재와 동일)
- proxy.ts는 URL 리라이트만 담당

### proxy.ts 인증 패턴 (쿠키 사용 시)

```typescript
// proxy.ts
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/mainpage", "/mypage", "/settings"];
const authRoutes = ["/sign-in", "/sign-up"];

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 쿠키에서 토큰 확인
  const token = req.cookies.get("accessToken")?.value;
  const isAuthenticated = !!token;

  // 미인증 사용자가 보호된 라우트 접근 시
  if (
    protectedRoutes.some((route) => path.startsWith(route)) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  // 인증된 사용자가 auth 페이지 접근 시
  if (authRoutes.some((route) => path.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/mainpage", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

---

## 5. 기존 컴포넌트 활용

### Header 컴포넌트 (`src/shared/ui/Header.tsx`)

기존 Header 컴포넌트가 Figma 디자인과 일치합니다:

```typescript
<Header
  title="기본 상태 입력"
  isRightChild={true}       // X 닫기 버튼 표시
  onLeftClick={() => router.back()}
  onRightClick={() => router.push('/mainpage')}
/>
```

**구조:**

- 왼쪽: 뒤로가기 화살표 (`/arrow/left-header-arrow.svg`)
- 중앙: 제목 (title prop)
- 오른쪽: X 닫기 버튼 (`/x/black_x_icon.svg`, isRightChild=true일 때)

---

## 6. 체크리스트

### Phase 1: proxy.ts 마이그레이션

- [ ] `middleware.ts` → `proxy.ts` 파일명 변경
- [ ] `middleware` → `proxy` 함수명 변경
- [ ] config 옵션명 변경 (해당되는 경우)
- [ ] 빌드 및 테스트

### Phase 2: BottomNavigation 제거

- [ ] `noBottomNavRoutes` 배열 삭제
- [ ] `dynamicNoBottomNavPrefixes` 배열 삭제
- [ ] `showBottomNav` 로직 삭제
- [ ] BottomNavigation 컴포넌트 import 제거
- [ ] JSX에서 BottomNavigation 제거
- [ ] BottomNavigation 컴포넌트 파일 삭제 (선택)

### Phase 3: ClientLayout 리팩토링

- [ ] 불필요한 import 제거
- [ ] BottomNav 관련 로직 제거
- [ ] main 태그에서 `pb-20` 조건부 클래스 제거
- [ ] 세션 복구 로직 검토 및 정리

### Phase 4: Route Group 정리

- [ ] (omechu) 레이아웃 필요성 검토
- [ ] (auth) 레이아웃 개선
- [ ] 페이지별 Header 적용 검토

### Phase 5: JWT 저장 방식 (백엔드 협의 후)

- [ ] 저장 방식 결정
- [ ] 필요시 쿠키 설정 로직 추가
- [ ] proxy.ts 인증 로직 추가 (쿠키 사용 시)

---

## 7. 참고 자료

- [Next.js 16 Upgrade Guide - Middleware to Proxy](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [GitHub Issue #218](https://github.com/Team-Omechu/Omechu-web/issues/218)

---

## 8. 예상 영향 범위

### 수정되는 파일

- `middleware.ts` → `proxy.ts`
- `src/app/layouts/ClientLayout.tsx`
- `src/app/layout.tsx` (필요시)

### 삭제되는 파일/코드

- `src/widgets/layout/BottomNavigation.tsx` (또는 해당 위치)
- ClientLayout 내 noBottomNavRoutes 배열 (70줄+)

### 테스트 필요 페이지

- 로그인/회원가입 플로우
- 메인페이지 접근
- 온보딩 플로우
- 마이페이지 및 설정

---

_이 문서는 마이그레이션 진행 중 업데이트됩니다._
