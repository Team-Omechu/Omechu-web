# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Omechu (오메추 - "오늘 뭐 먹지?") is a food recommendation web application that provides personalized menu and restaurant recommendations based on user preferences, context, and conditions.

## Development Commands

All commands run from `/omechu-app/` directory:

```bash
pnpm dev          # Development server at http://localhost:3000
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint (use `npx eslint src` on Windows if pnpm lint fails)
pnpm format       # Prettier formatting
pnpm format:check # Check formatting
```

Omechu (오메추 - "오늘 뭐 먹지?") is a food recommendation web application that provides personalized menu and restaurant recommendations based on user preferences, context, and conditions.

## Development Commands

All commands run from `/omechu-app/` directory:

```bash
pnpm dev          # Development server at http://localhost:3000
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint (use `npx eslint src` on Windows if pnpm lint fails)
pnpm format       # Prettier formatting
pnpm format:check # Check formatting
```

## Technology Stack

- **Framework**: Next.js 16 with App Router, React 19
- **Language**: TypeScript 5.8.3 (strict mode)
- **Styling**: Tailwind CSS 4 (CSS-first config in `globals.css`, no JS config file)
- **State**: Zustand 5 (client), TanStack React Query 5 (server)
- **Forms**: React Hook Form 7 + Zod 4
- **API**: Axios with JWT auth interceptors
- **Framework**: Next.js 16 with App Router, React 19
- **Language**: TypeScript 5.8.3 (strict mode)
- **Styling**: Tailwind CSS 4 (CSS-first config in `globals.css`, no JS config file)
- **State**: Zustand 5 (client), TanStack React Query 5 (server)
- **Forms**: React Hook Form 7 + Zod 4
- **API**: Axios with JWT auth interceptors
- **Package Manager**: pnpm 10.20.0

## Project Architecture (FSD)

The project uses **Feature-Sliced Design** architecture:

```
omechu-app/src/
├── app/           # Next.js App Router pages and layouts
├── widgets/       # Complex UI blocks (can import from entities, shared)
├── entities/      # Business entities (user, menu, restaurant, etc.)
└── shared/        # Reusable code (ui, api, lib, config, store)
```

### FSD Layer Rules

- **Layer hierarchy**: app → widgets → entities → shared
- Higher layers can only import from lower layers
- No circular dependencies or same-level imports
- Use barrel exports (`index.ts`) for cross-layer imports

### Path Aliases (tsconfig.json)

```typescript
"@/*"         → "./src/*"
"@/app/*"     → "./src/app/*"
"@/entities/*"→ "./src/entities/*"
"@/widgets/*" → "./src/widgets/*"
"@/shared/*"  → "./src/shared/*"
```

### Entity Module Structure

```
entity/
├── api/          # API calls
├── model/        # State management (hooks, stores)
├── ui/           # Components
├── lib/          # Utils & helpers
├── types/        # Type definitions
└── index.ts      # Barrel exports
```

## Naming Conventions

| Type                | Convention           | Example         |
| ------------------- | -------------------- | --------------- |
| Variables/Functions | camelCase            | `fetchData()`   |
| Components/Classes  | PascalCase           | `UserAvatar`    |
| Constants           | UPPER_SNAKE_CASE     | `MAX_LIMIT`     |
| Folders             | kebab-case           | `user-profile/` |
| Component files     | `*.tsx`              | `UserCard.tsx`  |
| Hook files          | `use*.ts`            | `useAuth.ts`    |
| Store files         | `*.store.ts`         | `auth.store.ts` |
| API files           | `*.api.ts` or folder | `authApi.ts`    |
| Type files          | `*.types.ts`         | `user.types.ts` |

## Core Architecture Patterns

### Authentication

- JWT-based with automatic token refresh
- Access token in Zustand store (persisted to localStorage)
- Axios interceptor handles 401 errors with token refresh queue

### Authentication

- JWT-based with automatic token refresh
- Access token in Zustand store (persisted to localStorage)
- Axios interceptor handles 401 errors with token refresh queue
- Client-side route protection in `ClientLayout.tsx`
- Middleware only handles URL rewrites, NOT authentication

Key files:

- Auth store: `src/entities/user/model/auth.store.ts`
- Axios instance: `src/shared/lib/axiosInstance.ts`

### State Management

**Zustand stores** (with persist middleware):

- `auth.store.ts` - Authentication state
- `onboarding.store.ts` - Multi-step onboarding flow
- `tagData.store.ts` - Food preference tags
- `questionAnswer.store.ts` - Recommendation questionnaire
- `userInfoSetup.store.ts` - User profile setup

### API Layer

- Centralized Axios instance with interceptors
- Base URL from `NEXT_PUBLIC_API_URL`
- Response format: `{ resultType, error, success }`
- React Query for caching/mutations

### Styling (Tailwind CSS v4)

CSS-first configuration in `src/app/globals.css`:

- All theme customization in `@theme` block
- Custom utilities via `@utility` directive
- Mobile-first: 375px fixed width layout
- Korean typography (Noto Sans KR)

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=<backend-api-url>
NEXT_PUBLIC_KAKAO_MAP_API_KEY=...
NEXT_PUBLIC_GOOGLE_PLACE_API_KEY=...
```

## Important Notes

### Zod v4 Syntax

- Custom utilities via `@utility` directive
- Mobile-first: 375px fixed width layout
- Korean typography (Noto Sans KR)

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=<backend-api-url>
NEXT_PUBLIC_KAKAO_MAP_API_KEY=...
NEXT_PUBLIC_GOOGLE_PLACE_API_KEY=...
```

## Important Notes

### Zod v4 Syntax

```typescript
// Correct v4 syntax:
// Correct v4 syntax:
z.enum(["a", "b"], { message: "error" });
// NOT: z.enum(["a", "b"], { errorMap: () => ({ message: "error" }) })
```

### Date Libraries

Both `dayjs` and `date-fns` are installed. Prefer `date-fns` for new code.

### Image Handling

- AWS S3 for uploads
- Next.js Image with `remotePatterns` configured
- NFC normalization for Korean filenames

### Code Quality

- ESLint 9 flat config (`eslint.config.mjs`)
- Import ordering: React → Next → Internal (@/\*) → Relative
- Husky pre-commit hooks run lint-staged
