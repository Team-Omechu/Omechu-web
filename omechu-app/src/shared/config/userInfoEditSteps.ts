export type StepKey = "start" | "exercise" | "prefer" | "body_type" | "allergy";

export const stepOrder: StepKey[] = [
  "start",
  "exercise",
  "prefer",
  "body_type",
  "allergy",
];

export const slugToIndex: Record<StepKey, number> = {
  start: 0,
  exercise: 1,
  prefer: 2,
  body_type: 3,
  allergy: 4,
};

export const indexToSlug: Record<number, StepKey> = {
  0: "start",
  1: "exercise",
  2: "prefer",
  3: "body_type",
  4: "allergy",
};
