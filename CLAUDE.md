# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Omechu is a food recommendation web application built with Next.js 15, React 19, and TypeScript. The name "Omechu" comes from "오늘 뭐 먹지?" (What should I eat today?), and it helps users get personalized food and restaurant recommendations.

## Technology Stack

- **Framework**: Next.js 15.4.2 with App Router
- **Runtime**: React 19 with React DOM 19
- **Language**: TypeScript 5.8.3
- **Styling**: TailwindCSS 3 with custom design system
- **State Management**: Zustand 5.0.6 with persistence
- **Data Fetching**: TanStack React Query 5.83.0 with Axios 1.11.0
- **Forms**: React Hook Form 7.59.0 with Zod 3.25.72 validation
- **Authentication**: JWT-based with refresh token rotation
- **Package Manager**: Yarn 4.9.2
- **Code Quality**: ESLint + Prettier with Husky pre-commit hooks

## Key Development Commands

```bash
# Development
yarn dev                 # Start development server

# Build & Production
yarn build              # Build for production
yarn start              # Start production server

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format with Prettier
yarn format:check       # Check formatting

# Git Hooks
yarn prepare            # Setup Husky hooks
```

## Project Structure

- **Main App**: `/omechu-app/` - Contains the Next.js application
- **Source Code**: `/omechu-app/src/app/` - App Router structure
- **Components**: Organized by feature areas (common, mainpage, mypage, etc.)
- **API Layer**: Centralized in `/lib/api/` with axios instance
- **State Management**: Zustand stores in `/lib/stores/`
- **Types & Schemas**: Zod schemas for validation and TypeScript types

## Core Architecture Patterns

### 1. Authentication System

- **JWT-based authentication** with access/refresh token pattern
- **Automatic token refresh** via axios interceptors
- **Persistent auth state** using Zustand with localStorage
- **Kakao Social Login** integration
- **Protected routes** handled client-side in `ClientLayout.tsx`

### 2. State Management Architecture

Multiple Zustand stores with persistence:

- `auth.store.ts` - User authentication state
- `onboarding.store.ts` - User onboarding flow data
- `tagData.store.ts` - Food preference tags
- `questionAnswer.store.ts` - Recommendation questions
- `locationAnswer.store.ts` - Location preferences
- `userInfoSetup.store.ts` - User profile setup

### 3. API Architecture

- **Centralized axios instance** with automatic token injection
- **Standardized API response format**: `{ resultType, error, success }`
- **TanStack Query integration** for caching and background updates
- **Environment-based API URL** via `NEXT_PUBLIC_API_URL`

### 4. Mobile-First Design System

Custom TailwindCSS configuration with:

- **Mobile-optimized breakpoints** (max-width: 375px)
- **Custom color palette** (primary, secondary, main, grey variants)
- **Korean typography** using Noto Sans KR
- **Custom animations** (shake effect for validation)
- **Responsive layout** with fixed mobile width

## Key Features & User Flows

### 1. Food Recommendation Flow

1. **Main Page** → Question-based recommendation OR random recommendation
2. **Multi-step questionnaire** (meal time, purpose, mood, companions, budget)
3. **Location selection** with address search
4. **Personalized recommendations** based on user profile + preferences
5. **Restaurant integration** with Google Places API

### 2. User Management

- **Email/password registration** with email verification
- **Kakao social login**
- **Comprehensive onboarding** (profile, gender, exercise, food preferences, allergies)
- **User profile management** with image upload to AWS S3

### 3. Restaurant & Review System

- **Restaurant search and filtering**
- **User-generated reviews** with ratings and images
- **Favorites system** (heart functionality)
- **Restaurant detail pages** with maps integration

## Important Development Notes

### 1. Mobile-First Architecture

- **Fixed width layout** (375px) optimized for mobile
- **Bottom navigation** conditionally rendered based on routes
- **Touch-friendly UI** with proper spacing and tap targets

### 2. Form Handling Pattern

- **React Hook Form + Zod** for all forms
- **Consistent validation schemas** in dedicated schema files
- **Error handling** with toast notifications and inline validation

### 3. Image Management

- **AWS S3 integration** for user uploads
- **Next.js Image optimization** with configured domains
- **Proper image fallbacks** and loading states

### 4. Route Protection

- **Middleware for URL rewrites** (query params → dynamic segments)
- **Client-side route guards** in `ClientLayout.tsx`
- **Conditional navigation** based on auth state and user onboarding status

### 5. Code Quality Standards

- **Strict TypeScript** configuration with `noImplicitAny: true`
- **Consistent commit conventions** (feat, fix, refactor, etc.)
- **Pre-commit hooks** for linting and formatting
- **Import organization** with path aliases (`@/`)

## Database & Backend Integration

- External API backend (URL via environment variable)
- User profiles with preferences and allergies
- Restaurant data integrated with Google Places API
- Review and rating system
- Favorites/wishlist functionality

## Development Environment Setup

1. **Node.js** and **Yarn 4.9.2** required
2. **Environment variables** needed for API URL and external services
3. **AWS S3 configuration** for image uploads
4. **Google Places API** for restaurant data

## Important File Locations

- **Main layout**: `/omechu-app/src/app/layout.tsx`
- **Client routing**: `/omechu-app/src/app/ClientLayout.tsx`
- **Auth store**: `/omechu-app/src/app/lib/stores/auth.store.ts`
- **API client**: `/omechu-app/src/app/lib/api/axios.ts`
- **Tailwind config**: `/omechu-app/tailwind.config.js`
- **TypeScript config**: `/omechu-app/tsconfig.json`

## Special Considerations

- **Korean language support** throughout the application
- **Mobile-optimized** user experience with touch interactions
- **Complex multi-step forms** with state persistence
- **Real-time location services** integration
- **Social authentication** with Kakao platform

This codebase follows modern React/Next.js patterns with a focus on mobile user experience, comprehensive form handling, and robust authentication flows.
