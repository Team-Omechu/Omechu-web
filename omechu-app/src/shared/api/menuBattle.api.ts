import { fetchJSON } from "./fetchJSON";

export const menuBattleAPI = {
  createBattle: (payload: { creatorNickname: string; menuIds: number[] }) =>
    fetchJSON<{
      battleId: string;
    }>("/menu/battles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  getBattle: (battleId: string) => fetchJSON(`/menu/battles/${battleId}`),

  joinBattle: (battleId: string, nickname: string) =>
    fetchJSON(`/menu/battles/${battleId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    }),

  spin: (battleId: string, nickname: string) =>
    fetchJSON(`/menu/battles/${battleId}/spin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    }),
};
