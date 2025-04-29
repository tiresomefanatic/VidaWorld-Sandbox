import Store from "../store";
import { VIDA_TEST_DRIVE_USER_DATA } from "./vidaTestDriveTypes";

/* Test Drive Data Action */
export const setVidaTestDriveDataAction = (vidaTestDriveData) => {
  return {
    type: VIDA_TEST_DRIVE_USER_DATA,
    payload: vidaTestDriveData
  };
};

export const setVidaTestDriveDispatcher = (vidaTestDriveData) => {
  Store.dispatch(setVidaTestDriveDataAction(vidaTestDriveData));
};
