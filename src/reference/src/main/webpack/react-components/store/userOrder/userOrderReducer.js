import {
  USER_PRE_BOOKING_DATA,
  USER_ORDER_DATA,
  USER_PURCHASE_BUTTON_SHOW,
  USER_PURCHASE_NO_ORDERS
} from "./userOrderTypes";

const initialState = {
  userPreBookingData: null,
  userOrderData: null,
  userPurchaseButtonShow: null,
  userPurchaseNoOrders: null
};

/* User Order Reducer */
export default function userOrderReducer(state = initialState, action) {
  switch (action.type) {
    case USER_PRE_BOOKING_DATA:
      return {
        ...state,
        userPreBookingData: action.payload
      };
    case USER_ORDER_DATA:
      return {
        ...state,
        userOrderData: action.payload
      };
    case USER_PURCHASE_BUTTON_SHOW:
      return {
        ...state,
        userPurchaseButtonShow: action.payload
      };
    case USER_PURCHASE_NO_ORDERS:
      return {
        ...state,
        userPurchaseNoOrders: action.payload
      };
    default:
      return state;
  }
}
