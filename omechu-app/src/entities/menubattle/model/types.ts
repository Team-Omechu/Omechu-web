export type Player = {
  id: string;
  name: string;
  joinedAt: number;
};

export type PlayerResult = {
  playerId: string;
  name: string;
  menu: string;
  diff: number;
  stoppedAt: number;
};

export type Menu = {
  menuId: string;
  menuName: string;
  centerAngle: number;
  color: string;
};
