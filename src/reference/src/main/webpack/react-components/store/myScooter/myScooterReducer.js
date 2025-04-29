import { MY_SCOOTER_DATA, CITY_HOMEPAGE } from "./myScooterTypes";

const initialState = {
  configuredAmount: 0,
  configuredImageUrl: "",
  configuredOpportunityId: "",
  configuredOrderId: "",
  configuredOrderNumber: "",
  configuredScooterName: "",
  configuredDate: "",
  configuredSKUId: "",
  isOrderCreated: null,
  isPrebooked: null,
  configuredBookingId: "",
  configuredAccessories: [],
  cityData: ""
};

/* User Order Reducer */
export default function myScooterReducer(state = initialState, action) {
  switch (action.type) {
    case MY_SCOOTER_DATA:
      let myScooterRecord = null;
      const accessoriesList = [];
      if (action.payload.opportunity_lines?.records.length) {
        myScooterRecord = action.payload.opportunity_lines.records.find(
          (element) => element.item_type === "Product"
        );
        action.payload.opportunity_lines.records.forEach((element) => {
          if (element.item_type === "Accessory") {
            accessoriesList.push(element.item_name);
          }
        });
      }
      return {
        ...state,
        configuredAmount: action.payload.amount,
        configuredImageUrl: action.payload.image_url,
        configuredOpportunityId: action.payload.opportunityId,
        configuredOrderId: action.payload.orderId,
        configuredOrderNumber: action.payload.orderNumber,
        configuredDate: action.payload.configuredDate,
        configuredScooterName: action.payload.productName,
        isOrderCreated: action.payload.isOrderCreated,
        isPrebooked: action.payload.isPrebooked,
        configuredBookingId: action.payload.bookingId,
        configuredSKUId: myScooterRecord && myScooterRecord.sku_id,
        configuredAccessories: accessoriesList.length && accessoriesList
      };
    case CITY_HOMEPAGE:
      return {
        cityData: action.payload.cityData
      };
    default:
      return state;
  }
}
