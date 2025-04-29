import { combineReducers } from "redux";
import sampleReducer from "./sample/sampleReducer";
import notificationReducer from "./notification/notificationReducer";
import userAccessReducer from "./userAccess/userAccessReducer";
import userProfileDataReducer from "./userProfile/userProfileReducer";
import preBookingReducer from "./preBooking/preBookingReducer";
import scooterInfoReducer from "./scooterInfo/scooterInfoReducer";
import testDriveReducer from "./testDrive/testDriveReducer";
import userTestRideReducer from "./userTestRide/userTestRideReducer";
import userLongTestRideReducer from "./userLongTestRide/userLongTestRideReducer";
import userOrderReducer from "./userOrder/userOrderReducer";
import purchaseConfigReducer from "./purchaseConfig/purchaseConfigReducer";
import spinnerReducer from "./spinner/spinnerReducer";
import myScooterReducer from "./myScooter/myScooterReducer";
import testDriveVidaReducer from "./vidaTestDrive/vidaTestDriveReducer";

const rootReducer = combineReducers({
  sampleReducer,
  notificationReducer,
  userAccessReducer,
  userProfileDataReducer,
  preBookingReducer,
  scooterInfoReducer,
  testDriveReducer,
  userTestRideReducer,
  userLongTestRideReducer,
  userOrderReducer,
  purchaseConfigReducer,
  spinnerReducer,
  myScooterReducer,
  testDriveVidaReducer
});
export default rootReducer;
