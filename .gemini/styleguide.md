
# Omechu Review Guide

# Review Style

- Avoid general feedback, summaries, explanations of changes, or praises.
- Provide specific, objective insights only, without making broad comments on system impact or questioning intentions.
- Write all comments in Korean (ko-KR).

## **📌 Code Convention**

### **1. Naming Convention**

| Type                               | Notation                                | Example                                |
| ---------------------------------- | --------------------------------------- | -------------------------------------- |
| Variables & Parameters & Functions | **camelCase**                           | `newUser`, `fetchData()`               |
| Classes & Components               | **PascalCase**                          | `User`, `EmptyList.tsx`                |
| Constants                          | **UPPER_SNAKE_CASE**                    | `const MAX_LIMIT = 100;`               |
| File Names                         | **Component → Pascal / Folder → camel** | `src/components/EmptyList.tsx`         |
| Type & Interface                   | **PascalCase (Interface-oriented)**     | `interface UserData { name: string; }` |

### **2. Function Writing Principles**

**Single Responsibility Principle (SRP)**

- Each function should **perform only one task**
- If a function becomes too long, **split it appropriately**


### **3. Import Convention**

- When referencing from upper layers to lower layers, only allow up to 2 depth.

**bad🚫**

```tsx
import { useCustomHook } from '@app/auth/model';
import { Component } from '@app/auth/ui';
```

**good👍**

```tsx
import { Component, useCustomHook } from '@app/auth';
```

- When referencing within the same slice, allow imports up to 2 depth using relative paths.

**bad🚫**

```tsx
// Within the same board slice
import { useCustomHook } from '@app/board/model';
import { Component } from '@app/board/ui';
```

**good👍**

```tsx
// Within the same board slice
import { useCustomHook } from '../model';
import { Component } from '../ui';
```

### **4. Design System**

- Use utility functions like cn, clsx for conditional styling with tailwindcss.
