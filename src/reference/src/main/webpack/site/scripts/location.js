import {
  getStatesByCountryId,
  getShortTermServiceableLocations,
  getLongTermServiceableLocations,
  getVidaCentreList,
  getServiceablePincodesList,
  getGoogleMapData
} from "../../services/location.service";
import { setSpinnerActionDispatcher } from "../../react-components/store/spinner/spinnerActions";

export default class Location {
  constructor() {
    this.states = [];
    this.cities = [];
    this.serviceableLocations = [];
  }

  async getStates(countryId) {
    setSpinnerActionDispatcher(true);
    const result = await getStatesByCountryId(countryId);
    this.states = result.states;
    return this.states;
  }

  async getCities(countryId, stateId) {
    if (!this.states.length) {
      this.states = await getStates(countryId);
    }
    const stateObj = this.states.find((obj) => obj.value === stateId);
    this.cities = stateObj.cities;
    return this.cities;
  }

  async getShortTermServiceableLocations(countryId) {
    this.serviceableLocations = await getShortTermServiceableLocations(
      countryId
    );
    return this.serviceableLocations;
  }

  async getLongTermServiceableLocations(countryId) {
    this.serviceableLocations = await getLongTermServiceableLocations(
      countryId
    );
    return this.serviceableLocations;
  }

  async getVidaCentreList(city) {
    return await getVidaCentreList(city);
  }
  async getServiceablePincodesList(location) {
    setSpinnerActionDispatcher(true);
    return await getServiceablePincodesList(location);
  }

  async getGoogleMapDataByLocation(city, state) {
    return await getGoogleMapData(city, state);
  }
}
