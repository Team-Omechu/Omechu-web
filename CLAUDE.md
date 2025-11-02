# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Omechu is a food recommendation web application built with Next.js 16, React 19, and TypeScript. The name "Omechu" comes from "오늘 뭐 먹지?" (What should I eat today?), and it helps users get personalized food and restaurant recommendations.

## Technology Stack

- **Framework**: Next.js 16.0.1 with App Router
- **Runtime**: React 19 with React DOM 19
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 4.1.16 with CSS-first configuration
- **State Management**: Zustand 5.0.6 with persistence
- **Data Fetching**: TanStack React Query 5.83.0 with Axios 1.11.0
- **Forms**: React Hook Form 7.59.0 with Zod 4.1.12 validation
- **Authentication**: JWT-based with refresh token rotation
- **Package Manager**: pnpm 10.20.0
- **Code Quality**: ESLint 9 Flat Config + Prettier with Husky pre-commit hooks

## Key Development Commands

```bash
# Development
pnpm dev                 # Start development server (runs on http://localhost:3000)

# Build & Production
pnpm build              # Build for production
pnpm start              # Start production server

# Code Quality
pnpm lint               # Run ESLint (note: use `npx eslint src` for direct checks)
pnpm format             # Format with Prettier
pnpm format:check       # Check formatting

# Git Hooks
pnpm prepare            # Setup Husky hooks (auto-runs on install)

# FSD Migration (planned)
pnpm fsd:migrate        # Run FSD migration script
pnpm fsd:check          # Check FSD architecture compliance
```

## Project Structure

### Current Structure
- **Main App**: `/omechu-app/` - Next.js application
- **Source Code**: `/omechu-app/src/app/` - Next.js App Router structure
- **Migrating to**: Feature-Sliced Design (FSD) architecture

### Planned FSD Layers
- **app/**: Application-wide settings, providers, and routing
- **entities/**: Business entities (User, Restaurant, Menu, Review)
- **widgets/**: Complex UI blocks composed of entities
- **shared/**: Reusable code (UI components, utils, hooks, API)

### Key Directory Organization

**Current App Router Structure** (`/omechu-app/src/app/`):
- `(auth)/` - Route group for authentication pages (sign-in, sign-up, forgot-password)
- `auth/` - Authentication business logic (hooks, schemas, components)
- `lib/` - Shared libraries (API clients, stores, hooks, providers)
- `components/` - Shared UI components organized by domain
- `mainpage/`, `mypage/`, `restaurant/`, `fullmenu/`, `onboarding/` - Feature modules
- `constant/` - Application constants and static data
- `ClientLayout.tsx` - Client-side layout wrapper with route guards
- `globals.css` - Tailwind CSS v4 configuration and global styles

## Core Architecture Patterns

### 1. Authentication System

**JWT-based with automatic token refresh:**
- Access token stored in Zustand store (persisted to localStorage)
- Refresh token used for automatic token renewal
- Axios interceptor in `/lib/api/axios.ts` handles 401 errors and token refresh
- Pending request queue prevents race conditions during token refresh
- Client-side route protection in `ClientLayout.tsx`

**Key Files:**
- `/lib/stores/auth.store.ts` - Zustand store with persistence
- `/lib/api/axios.ts` - Axios instance with interceptors
- `/auth/schemas/auth.schema.ts` - Zod validation schemas
- `ClientLayout.tsx` - Route guard implementation

**Important Notes:**
- Middleware (`middleware.ts`) handles URL rewrites but NOT authentication
- Authentication state is managed client-side only
- Logout clears both Zustand state and localStorage to prevent 401 loops

### 2. State Management Architecture

**Zustand stores with localStorage persistence:**
- `auth.store.ts` - User authentication (accessToken, refreshToken, user)
- `onboarding.store.ts` - Multi-step onboarding flow data
- `tagData.store.ts` - Food preference tags
- `questionAnswer.store.ts` - Recommendation questionnaire state
- `locationAnswer.store.ts` - Location/address search results
- `userInfoSetup.store.ts` - User profile setup flow

**Pattern:**
```typescript
// All stores use persist middleware with partialize
const store = create(persist(
  (set) => ({ /* state and actions */ }),
  {
    name: 'storage-key',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ /* only persist these fields */ })
  }
))
```

### 3. API Architecture

**Centralized Axios instance** (`/lib/api/axios.ts`):
- Base URL from `NEXT_PUBLIC_API_URL` environment variable
- Request interceptor injects Bearer token
- Response interceptor handles 401 with automatic token refresh
- Standardized response format: `{ resultType, error, success }`

**TanStack Query integration:**
- React Query Provider wraps entire app in `layout.tsx`
- Query hooks in feature-specific `/hooks/` directories
- DevTools available in development

### 4. Styling System (Tailwind CSS v4)

**CSS-First Configuration** (`src/app/globals.css`):
- No `tailwind.config.js` file (migrated to CSS)
- All theme customization in `@theme` block
- Custom CSS variables for colors, fonts, breakpoints
- Custom utilities defined with `@utility` directive

**Custom Design Tokens:**
```css
@theme {
  /* Colors: primary-*, secondary-*, main-*, grey-* */
  --color-primary-normal: #ff7676;

  /* Mobile breakpoint */
  --breakpoint-mobile: 375px;

  /* Animations */
  --animate-shake: shake 0.5s ease-in-out;

  /* Custom spacing */
  --max-width-screen-mobile: 375px;
}

/* Custom utility */
@utility scrollbar-hide { /* ... */ }
```

**Mobile-First Design:**
- Fixed width layout (375px) for mobile
- Korean typography (Noto Sans KR font)
- Custom color system (primary, secondary, main, grey)
- Touch-friendly spacing and interactions

### 5. Form Handling Pattern

**React Hook Form + Zod v4:**
- Form validation schemas in `/schemas/` directories
- `@hookform/resolvers` for Zod integration
- Toast notifications for validation errors
- Multi-step forms use Zustand for state persistence

**Zod v4 Breaking Changes:**
```typescript
// OLD (v3):
z.enum(['a', 'b'], { errorMap: () => ({ message: 'error' }) })

// NEW (v4):
z.enum(['a', 'b'], { message: 'error' })
```

### 6. Route Protection & Middleware

**Middleware** (`middleware.ts`):
- **ONLY handles URL rewrites** (query params → dynamic segments)
- Example: `/restaurant-detail?id=123` → `/restaurant-detail/123`
- Does NOT handle authentication

**Client-side Route Guards** (`ClientLayout.tsx`):
- Checks `useAuthStore` for authentication state
- Redirects unauthenticated users
- Conditionally renders bottom navigation

## Important Development Notes

### 1. ESLint Configuration

**ESLint 9 Flat Config** (`eslint.config.mjs`):
- Uses flat config format (NOT `.eslintrc`)
- Import ordering enforced: React → Next → Internal (@/*) → Parent/Sibling
- Automatic import sorting with `--fix`
- TypeScript-aware with `@typescript-eslint/eslint-plugin`

**Known Issue:**
- `pnpm lint` may fail on Windows (use `npx eslint src` instead)

### 2. Date Library Usage

**Two date libraries present** (consider consolidating):
- `date-fns` - Used in `CustomDatePicker.tsx`
- `dayjs` - Used in `FoodieLogClient.tsx`

**Recommendation:** Standardize on `date-fns` for better tree-shaking

### 3. Image Management

- AWS S3 integration for user-uploaded images
- Next.js Image component with `remotePatterns` in `next.config.ts`
- Configured domains: `omechu-s3-bucket.s3.ap-northeast-2.amazonaws.com`

### 4. Code Quality Standards

**Enforced by pre-commit hooks:**
- ESLint with `--fix` for auto-fixable issues
- Prettier formatting
- Import organization (via ESLint)

**TypeScript Configuration:**
- Strict mode enabled
- `noImplicitAny: true`
- Path aliases: `@/*` → `./src/app/*`

### 5. Mobile-First Constraints

- **Fixed width**: 375px mobile viewport
- **Bottom navigation**: Conditional rendering based on route
- **Touch interactions**: Proper tap target sizes
- **Korean language**: Primary UI language

## Database & Backend Integration

- External REST API backend
- API URL via `NEXT_PUBLIC_API_URL` environment variable
- Google Places API for restaurant data
- AWS S3 for image storage
- Kakao OAuth for social login

## Environment Variables Required

```bash
NEXT_PUBLIC_API_URL=<backend-api-url>
# Additional variables for AWS S3, Kakao OAuth, Google Places
```

## Key File Locations

- **Root Layout**: `src/app/layout.tsx`
- **Client Layout**: `src/app/ClientLayout.tsx`
- **Auth Store**: `src/app/lib/stores/auth.store.ts`
- **API Client**: `src/app/lib/api/axios.ts`
- **Tailwind Config**: `src/app/globals.css` (CSS-first, no JS config)
- **TypeScript Config**: `tsconfig.json`
- **ESLint Config**: `eslint.config.mjs`
- **PostCSS Config**: `postcss.config.mjs`

## Known Issues & Workarounds

1. **`pnpm lint` fails on Windows**: Use `npx eslint src` directly
2. **Console.log statements**: Present in 40+ files (should be cleaned up before production)
3. **Date library duplication**: Both `dayjs` and `date-fns` installed

## Special Considerations

- **Korean language** throughout the application
- **Mobile-optimized** UX with 375px fixed width
- **Complex multi-step forms** with Zustand state persistence
- **JWT-based auth** with client-side token refresh
- **Kakao social login** integration
- **Google Places API** for restaurant data
- **AWS S3** for image uploads

This codebase follows modern React/Next.js patterns with a focus on mobile user experience, comprehensive form handling, and robust authentication flows.
