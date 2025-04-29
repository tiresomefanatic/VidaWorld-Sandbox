import Store from "../store";
import { SAMPLE_DATA, COUNTRY_LIST } from "./sampleTypes";

/* Sample Data Action */
const setSampleDataAction = (sampleData) => {
  return {
    type: SAMPLE_DATA,
    payload: sampleData
  };
};

export const setSampleDataDispatcher = (sampleData) => {
  Store.dispatch(setSampleDataAction(sampleData));
};

/* Country Data Action */
const setCountriesDataAction = (data) => {
  return {
    type: COUNTRY_LIST,
    payload: data
  };
};

export const setCountriesDataDispatcher = (sampleData) => {
  Store.dispatch(setCountriesDataAction(sampleData));
};
