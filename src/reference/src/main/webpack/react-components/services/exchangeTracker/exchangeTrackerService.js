import API from "../../../services/rest.service";
import appUtils from "../../../site/scripts/utils/appUtils";

export function getExchangeTrackerDetailsData() {
  const url = appUtils.getAPIUrl("heroSureUrl");
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          if (response) {
            resolve(response.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export async function getMasterBrandList() {
  const url = appUtils.getAPIUrl("exchangeVehicleMasterUrl");
  if (url) {
    try {
      const response = await API.getData(url);
      if (response) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }
}
