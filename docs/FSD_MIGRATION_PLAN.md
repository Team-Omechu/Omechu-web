# FSD Architecture Migration Plan

## 🎯 목표

현재 Next.js App Router 구조를 FSD(Feature-Sliced Design) 아키텍처로 마이그레이션

## 📚 FSD 레이어 정의

### 1. **Shared Layer** (의존성 없음)

가장 하위 레이어로 다른 레이어에서 공통으로 사용하는 코드

```
shared/
├── api/
│   ├── base/
│   │   ├── axios.instance.ts
│   │   └── api.types.ts
│   └── index.ts
├── ui/
│   ├── button/
│   │   ├── button.ui.tsx
│   │   ├── button.types.ts
│   │   └── index.ts
│   ├── input/
│   ├── modal/
│   └── index.ts
├── lib/
│   ├── utils/
│   │   ├── format.util.ts
│   │   ├── validation.util.ts
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── use-debounce.hook.ts
│   ├── use-intersection.hook.ts
│   └── index.ts
├── constants/
│   ├── routes.const.ts
│   ├── api.const.ts
│   └── index.ts
└── types/
    ├── common.types.ts
    └── index.ts
```

### 2. **Entities Layer**

비즈니스 엔티티와 도메인 로직

```
entities/
├── user/
│   ├── api/
│   │   ├── user.api.ts
│   │   └── auth.api.ts
│   ├── model/
│   │   ├── user.store.ts
│   │   └── auth.store.ts
│   ├── ui/
│   │   ├── user-avatar/
│   │   │   ├── user-avatar.ui.tsx
│   │   │   └── index.ts
│   │   └── user-info/
│   ├── lib/
│   │   └── user.util.ts
│   └── types/
│       └── user.types.ts
├── restaurant/
│   ├── api/
│   │   └── restaurant.api.ts
│   ├── model/
│   │   └── restaurant.store.ts
│   ├── ui/
│   │   ├── restaurant-card/
│   │   └── restaurant-rating/
│   └── types/
├── menu/
│   ├── api/
│   ├── model/
│   ├── ui/
│   └── types/
├── review/
│   ├── api/
│   ├── model/
│   ├── ui/
│   └── types/
└── order/
```

### 3. **Widgets Layer**

독립적으로 동작하는 UI 블록

```
widgets/
├── header/
│   ├── ui/
│   │   ├── header.ui.tsx
│   │   └── header-menu.ui.tsx
│   └── model/
│       └── header.store.ts
├── bottom-navigation/
│   ├── ui/
│   │   └── bottom-navigation.ui.tsx
│   └── lib/
│       └── navigation.util.ts
├── food-recommendation-flow/
│   ├── ui/
│   │   ├── step-budget.ui.tsx
│   │   ├── step-mood.ui.tsx
│   │   └── step-purpose.ui.tsx
│   ├── model/
│   │   └── recommendation.store.ts
│   └── api/
│       └── recommendation.api.ts
├── restaurant-detail-section/
├── review-list-section/
└── user-profile-section/
```

### 4. **App Layer**

애플리케이션 설정과 초기화

```
app/
├── providers/
│   ├── react-query.provider.tsx
│   ├── auth.provider.tsx
│   └── index.tsx
├── routes/
│   ├── public.routes.tsx
│   ├── private.routes.tsx
│   └── index.tsx
├── layouts/
│   ├── main.layout.tsx
│   ├── auth.layout.tsx
│   └── index.tsx
└── styles/
    └── globals.css
```

## 📝 네이밍 컨벤션

### 파일 네이밍

- **컴포넌트**: `component-name.ui.tsx`
- **훅**: `use-feature.hook.ts`
- **유틸리티**: `feature.util.ts`
- **상수**: `feature.const.ts`
- **타입**: `feature.types.ts`
- **스토어**: `feature.store.ts`
- **API**: `feature.api.ts`
- **배럴 익스포트**: `index.ts`

### 폴더 네이밍

- **kebab-case** 사용
- 기능별 그룹핑
- 명확한 계층 구조

### Import 규칙

```typescript
// ✅ Good - 절대 경로 사용
import { Button } from "@/shared/ui";
import { useUser } from "@/entities/user";
import { Header } from "@/widgets/header";

// ❌ Bad - 상대 경로
import { Button } from "../../../shared/ui/button";
```

## 🔄 마이그레이션 순서

### Phase 1: 기반 구조 설정

1. FSD 폴더 구조 생성
2. tsconfig.json paths 설정
3. 배럴 익스포트 파일 생성

### Phase 2: Shared 레이어

1. `components/common` → `shared/ui`
2. `lib/api` → `shared/api`
3. `constant` → `shared/constants`
4. 공용 hooks → `shared/hooks`

### Phase 3: Entities 레이어

1. User 엔티티 마이그레이션
2. Restaurant 엔티티 마이그레이션
3. Menu 엔티티 마이그레이션
4. Review 엔티티 마이그레이션

### Phase 4: Widgets 레이어

1. Header 위젯 마이그레이션
2. Bottom Navigation 위젯
3. 주요 섹션별 위젯화

### Phase 5: App 레이어

1. Provider 통합
2. 라우팅 로직 정리
3. 레이아웃 구성

## 🚀 예상 효과

### 장점

- **명확한 의존성 관계**: 상위 레이어는 하위 레이어만 import
- **높은 재사용성**: 컴포넌트와 로직의 모듈화
- **쉬운 테스트**: 각 레이어별 독립적 테스트 가능
- **확장성**: 새로운 기능 추가 시 명확한 위치
- **팀 협업 개선**: 명확한 구조로 충돌 최소화

### 주의사항

- 초기 마이그레이션 시간 소요
- 팀원 전체 교육 필요
- 기존 import 경로 전면 수정

## 📅 예상 일정

- Phase 1: 1일
- Phase 2: 2-3일
- Phase 3: 3-4일
- Phase 4: 2-3일
- Phase 5: 1-2일

총 예상 기간: 9-14일

## 🔧 설정 파일 변경사항

### tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@/app/*": ["./src/app/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

### package.json scripts

```json
{
  "scripts": {
    "lint:fsd": "eslint --ext .ts,.tsx src/ --config .eslintrc.fsd.js",
    "arch:check": "npx @feature-sliced/steiger"
  }
}
```

## 📚 참고 자료

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design)
- [FSD Best Practices](https://feature-sliced.design/docs/reference/best-practices)
- [FSD Examples](https://github.com/feature-sliced/examples)
