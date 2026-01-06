"use client";

import { useState } from "react";

import { BattleButton } from "@/shared_FSD/ui/button/BattleButton";

export default function BattleButtonTestPage() {
  const [log, setLog] = useState<string>("");

  const appendLog = (msg: string) => {
    setLog((prev) => msg + "\n" + prev);
  };

  return (
    <main className="space-y-6 p-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Default</h2>
        <BattleButton onClick={() => appendLog("default clicked")}>
          기본 버튼
        </BattleButton>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Font Color Variants</h2>
        <div className="flex gap-4">
          <BattleButton
            fontColor="default"
            onClick={() => appendLog("font default clicked")}
          >
            흰 글씨
          </BattleButton>

          <BattleButton
            bgColor="grey"
            fontColor="grey"
            onClick={() => appendLog("font black clicked")}
          >
            검은 글씨
          </BattleButton>

          <BattleButton
            fontColor="default"
            disabled
            onClick={() => appendLog("font disabled clicked")}
          >
            비활성 글씨
          </BattleButton>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Background Variants</h2>
        <div className="flex gap-4">
          <BattleButton
            bgColor="default"
            onClick={() => appendLog("bg default clicked")}
          >
            기본 배경
          </BattleButton>

          <BattleButton
            bgColor="grey"
            onClick={() => appendLog("bg grey clicked")}
          >
            회색 배경
          </BattleButton>

          <BattleButton
            bgColor="default"
            disabled
            onClick={() => appendLog("bg disabled clicked")}
          >
            비활성 배경
          </BattleButton>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Width Size Variants</h2>
        <div className="flex flex-wrap gap-4">
          <BattleButton width="xl" onClick={() => appendLog("xl clicked")}>
            XL 너비
          </BattleButton>

          <BattleButton width="md" onClick={() => appendLog("md clicked")}>
            MD 너비
          </BattleButton>

          <BattleButton width="sm" onClick={() => appendLog("sm clicked")}>
            SM 너비
          </BattleButton>

          <BattleButton width="xs" onClick={() => appendLog("xs clicked")}>
            XS 너비
          </BattleButton>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Disabled</h2>
        <BattleButton disabled onClick={() => appendLog("disabled clicked")}>
          비활성 버튼
        </BattleButton>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Log Output</h2>
        <pre className="rounded bg-gray-100 p-4 text-sm whitespace-pre-wrap">
          {log}
        </pre>
      </section>
    </main>
  );
}
