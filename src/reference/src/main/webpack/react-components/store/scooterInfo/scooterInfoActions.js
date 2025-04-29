import Store from "../store";
import { SCOOTER_INFO } from "./scooterInfoTypes";

/* Scooter Info Action */
export const setScooterInfoAction = (scooterInfo) => {
  return {
    type: SCOOTER_INFO,
    payload: scooterInfo
  };
};

export const setScooterInfoDispatcher = (scooterInfo) => {
  Store.dispatch(setScooterInfoAction(scooterInfo));
};
