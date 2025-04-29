import Store from "../store";
import { MY_SCOOTER_DATA, CITY_HOMEPAGE } from "./myScooterTypes";

/* User Pre Booking Action */
const setMyScooterAction = (myScooterData) => {
  return {
    type: MY_SCOOTER_DATA,
    payload: myScooterData
  };
};

export const setMyScooterDispatcher = (myScooterData) => {
  Store.dispatch(setMyScooterAction(myScooterData));
};

/** Set cityHomepage dispatcher */
export const setHomepageCityAction = (cityHomepage) => {
  return {
    type: CITY_HOMEPAGE,
    payload: cityHomepage
  };
};

export const setHomepageCityDispatcher = (cityHomepage) => {
  Store.dispatch(setHomepageCityAction(cityHomepage));
};
