import { VIDA_TEST_DRIVE_USER_DATA } from "./vidaTestDriveTypes";

const initialState = {
  source: "testdrive",
  subscribe: false,
  pincode: "",
  branchId: "",
  partnerId: "",
  state: "",
  city: "",
  modalVariant: "",
  dealerName: "",
  time: "",
  date: "",
  dealerLatitude: "",
  dealerLongitude: "",
  dealerAddress: "",
  timeLabel: ""
};
export default function testDriveVidaReducer(state = initialState, action) {
  switch (action.type) {
    case VIDA_TEST_DRIVE_USER_DATA:
      return {
        ...state,
        pincode: action.payload.pincode,
        branchId: action.payload.branchId,
        partnerId: action.payload.partnerId,
        state: action.payload.state,
        city: action.payload.city,
        dealerName: action.payload.dealerName,
        time: action.payload.time,
        date: action.payload.date,
        dealerLatitude: action.payload.dealerLatitude,
        dealerLongitude: action.payload.dealerLongitude,
        dealerAddress: action.payload.dealerAddress,
        timeLabel: action.payload.timeLabel,
        modalVariant: action.payload.modalVariant
      };
    default:
      return state;
  }
}
