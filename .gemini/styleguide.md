# Omechu Review Guide

# Review Style

- Avoid general feedback, summaries, explanations of changes, or praises.
- Provide specific, objective insights only, without making broad comments on system impact or questioning intentions.
- Write all comments in Korean (ko-KR).

## **📌 Code Convention**

### **1. Naming Convention**

| Type                               | Notation                            | Example                                 |
| ---------------------------------- | ----------------------------------- | --------------------------------------- |
| Variables & Parameters & Functions | **camelCase**                       | `newUser`, `fetchData()`                |
| Classes & Components               | **PascalCase**                      | `User`, `EmptyList`                     |
| Constants                          | **UPPER_SNAKE_CASE**                | `const MAX_LIMIT = 100;`                |
| Folders                            | **kebab-case**                      | `user-profile/`, `food-recommendation/` |
| Component Files                    | **PascalCase.tsx**                  | `UserCard.tsx`, `Header.tsx`            |
| Hook Files                         | **use*.ts**                         | `useAuth.ts`, `useProfile.ts`           |
| Utility Files                      | **camelCase.ts**                    | `formatDate.ts`, `validation.ts`        |
| API Files                          | **camelCaseApi.ts or folder**       | `authApi.ts`, `profileApi.ts`           |
| Store Files                        | **feature.store.ts**                | `user.store.ts`                         |
| Type Files                         | **feature.types.ts**                | `user.types.ts`                         |
| Constant Files                     | **feature.const.ts**                | `routes.const.ts`                       |
| Type & Interface                   | **PascalCase (Interface-oriented)** | `interface UserData { name: string; }`  |

### **2. Function Writing Principles**

**Single Responsibility Principle (SRP)**

- Each function should **perform only one task**
- If a function becomes too long, **split it appropriately**

### **3. FSD Architecture & Import Convention**

#### **Layer Hierarchy**

- **app/** → **widgets/** → **entities/** → **shared/**
- Higher layers can only import from lower layers
- No circular dependencies or same-level imports allowed

#### **Import Rules**

**bad🚫**

```tsx
// Importing from higher layer (widgets importing from app)
import { AppProvider } from "@/app/providers";

// Importing between same-level layers
import { UserWidget } from "@/widgets/user"; // in another widget

// Using relative paths for cross-layer imports
import { Button } from "../../../shared/ui";
```

**good👍**

```tsx
// Correct layer hierarchy
import { Button } from "@/shared/ui"; // in widgets
import { useUser } from "@/entities/user"; // in widgets
import { Header } from "@/widgets/header"; // in app

// Using barrel exports
import { UserAvatar, UserInfo } from "@/entities/user";

// Relative imports only within same module
import { formatDate } from "./utils"; // same folder
import { UserModel } from "../model"; // within same entity
```

#### **Module Structure**

Each feature module should follow this structure:

```
feature/
├── api/          # API calls
├── model/        # State management
├── ui/           # Components
├── lib/          # Utils & helpers
├── types/        # Type definitions
└── index.ts      # Barrel exports
```

### **4. Design System**

- Use utility functions like cn for conditional styling with tailwindcss.
