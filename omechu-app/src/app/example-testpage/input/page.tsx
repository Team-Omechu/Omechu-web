"use client";

import { useState } from "react";

import { Input } from "@/shared_FSD/ui/input/Input";

export default function InputVariantsPage() {
  const [values, setValues] = useState<{ [key: string]: string }>({});

  // 모든 variant 조합
  const widths: Array<"default" | "md" | "sm" | "xs"> = [
    "default",
    "md",
    "sm",
    "xs",
  ];
  const heights: Array<"md" | "sm"> = ["md", "sm"];
  const rounded: Array<"sm" | "md"> = ["sm", "md"];
  const types: Array<"email" | "password" | "number" | "text" | "search"> = [
    "email",
    "password",
    "number",
    "text", // nickname용
    "search",
  ];

  return (
    <main className="flex flex-col gap-6 p-8">
      {types.map((t) =>
        heights.map((h) =>
          widths.map((w) =>
            rounded.map((r) => {
              const key = `${t}-${w}-${h}-${r}`;
              return (
                <div key={key} className="flex flex-col gap-2">
                  <span className="text-caption-2-medium">
                    {`type=${t}, width=${w}, height=${h}, rounded=${r}`}
                  </span>
                  <Input
                    type={t}
                    width={w}
                    height={h}
                    rounded={r}
                    placeholder={`${t} 입력`}
                    value={values[key] || ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    onSearch={
                      t === "search"
                        ? () => console.log(`검색: ${values[key] || ""}`)
                        : undefined
                    }
                  />
                </div>
              );
            }),
          ),
        ),
      )}
    </main>
  );
}
