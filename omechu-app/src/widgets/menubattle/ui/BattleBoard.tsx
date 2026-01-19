import { Player } from "@/entities/menubattle/model/types";

export function BattleBoard({ players }: { players: Player[] }) {
  return (
    <>
      <p className="text-sm text-gray-600">
        &lt;참가자: {players.length}명&gt;
      </p>

      <div className="mt-2 flex justify-center gap-2">
        {players.map((p) => (
          <span key={p.id} className="rounded-full border px-3 py-1 text-sm">
            {p.name}
          </span>
        ))}
      </div>
    </>
  );
}
