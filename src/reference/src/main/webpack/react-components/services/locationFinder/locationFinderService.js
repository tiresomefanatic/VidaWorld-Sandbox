import API from "../../../services/rest.service";
import config from "../../../site/scripts/config";
import appUtils from "../../../site/scripts/utils/appUtils";

function getStoreDetails(url) {
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
const googleAPIKey = appUtils.getConfig("googleAPIKey");
function getUserCityDetails(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleAPIKey}`;
  return new Promise((resolve, reject) => {
    API.getData(url)
      .then((response) => {
        if (response && response.status === 200) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { getStoreDetails, getUserCityDetails };
