import { atom } from "recoil";

export const roundState = atom({
  key: "roundState",
  default: 0,
});

export const goalState = atom({
  key: "goalState",
  default: 0,
});
