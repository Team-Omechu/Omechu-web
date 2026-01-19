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
  name: string;
  centerAngle: number;
};
