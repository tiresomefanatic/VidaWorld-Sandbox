import API from "./rest.service";
import appUtils from "../site/scripts/utils/appUtils";
import {
  setNearbyVidaCentreListDispatcher,
  setServiceablePincodesListDispatcher
} from "../react-components/store/testDrive/testDriveActions";
import Logger from "./logger.service";
import { setSpinnerActionDispatcher } from "../react-components/store/spinner/spinnerActions";
import CONSTANT from "../site/scripts/constant";

const checkBranchType = (branchType) => {
  return (
    branchType &&
    branchType.trim() !== "" &&
    (branchType === "experience centre" ||
      branchType === "pop-up store" ||
      branchType === "servicebranch")
  );
};

export function getStatesByCountryId(param) {
  const url = appUtils
    .getAPIUrl("geoDataUrl")
    .replace("$COUNTRY", param.toUpperCase());
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          setSpinnerActionDispatcher(false);
          if (response) {
            resolve(response.data);
          }
        })
        .catch((error) => {
          setSpinnerActionDispatcher(false);
          reject(error);
        });
    });
  }
}
export function getCitiesByCountryId(param) {
  const url = appUtils
    .getAPIUrl("geoDataUrl")
    .replace("$COUNTRY", param.toUpperCase());
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          setSpinnerActionDispatcher(false);
          if (response.data) {
            const cityList = [];
            response.data.states.forEach((state, stateIndex) => {
              state.cities.forEach((city, cityIndex) => {
                cityList.push({
                  state: state.value,
                  city: city.label,
                  label: city.label,
                  value: stateIndex + "-" + cityIndex
                });
              });
            });
            resolve(cityList);
          }
        })
        .catch((error) => {
          setSpinnerActionDispatcher(false);
          reject(error);
        });
    });
  }
}

export function getCityListForQuickReserve(param) {
  const url = appUtils
    .getAPIUrl("shortTermServiceableCitiesUrl")
    .replace("$COUNTRY", param.toUpperCase());
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          setSpinnerActionDispatcher(false);
          if (response.data) {
            const formattedCityList = [];
            response.data.forEach((state, stateIndex) =>
              state.cities.forEach((city, cityIndex) =>
                formattedCityList.push({
                  state: state.state,
                  city: city,
                  label: city,
                  value: stateIndex + "-" + cityIndex
                })
              )
            );
            resolve(formattedCityList);
          }
        })
        .catch((error) => {
          setSpinnerActionDispatcher(false);
          reject(error);
        });
    });
  }
}

export function getCityListForQuickTestDrive(country, isLttr) {
  const url = appUtils
    .getAPIUrl(!isLttr ? "availableTestRideCities" : "availableLTTRStateCities")
    .replace("$COUNTRY", country.toUpperCase());
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          setSpinnerActionDispatcher(false);
          if (response.data) {
            const formattedCityList = [];
            response.data.forEach((state, stateIndex) =>
              state.cities.forEach((city, cityIndex) =>
                formattedCityList.push({
                  state: state.state,
                  city: city.name ? city.name : city,
                  label: city.name ? city.name : city,
                  value: stateIndex + "-" + cityIndex
                })
              )
            );
            resolve(formattedCityList);
          }
        })
        .catch((error) => {
          setSpinnerActionDispatcher(false);
          reject(error);
        });
    });
  }
}

export function getStateCityList(country, isLttr) {
  const url = appUtils
    .getAPIUrl(!isLttr ? "availableTestRideCities" : "availableLTTRStateCities")
    .replace("$COUNTRY", country.toUpperCase());
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          setSpinnerActionDispatcher(false);
          if (response.data) {
            const formattedData = [];
            response.data.forEach((data, index) => {
              formattedData.push({
                state: data.state,
                cities: data.cities,
                label: data.state,
                value: data.state
              });
            });
            resolve(formattedData);
          }
        })
        .catch((error) => {
          setSpinnerActionDispatcher(false);
          reject(error);
        });
    });
  }
}

export function getCityListForDealers(param) {
  const url = appUtils
    .getAPIUrl("availableDealerCities")
    .replace("$COUNTRY", param.toUpperCase());
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          setSpinnerActionDispatcher(false);
          if (response.data) {
            const formattedCityList = [];
            response.data.forEach((state, stateIndex) =>
              state.cities.forEach((city, cityIndex) =>
                formattedCityList.push({
                  state: state.state,
                  city: city,
                  label: city,
                  value: stateIndex + "-" + cityIndex
                })
              )
            );
            resolve(formattedCityList);
          }
        })
        .catch((error) => {
          setSpinnerActionDispatcher(false);
          reject(error);
        });
    });
  }
}

export function getShortTermServiceableLocations(param) {
  const url = appUtils
    .getAPIUrl("shortTermServiceableCitiesUrl")
    .replace("$COUNTRY", param.toUpperCase());
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

export function getLongTermServiceableLocations(param) {
  const url = appUtils
    .getAPIUrl("longTermServiceableCitiesUrl")
    .replace("$COUNTRY", param);
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

export function getVidaCentreList(param) {
  const url = appUtils
    .getAPIUrl("serviceableBranchesUrl")
    .replace("$CITY", param);
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          if (response.data.length > 0 && response.status === 200) {
            const filteredCentreList = response.data
              .map((item) => {
                return {
                  ...item,
                  label: item.experienceCenterName,
                  value: item.id
                };
              })
              .filter((branch) => checkBranchType(branch.type.toLowerCase()));

            const centreList = [
              {
                type: CONSTANT.CENTERLIST.EXPERIENCE_CENTER,
                items: []
              },
              {
                type: CONSTANT.CENTERLIST.POP_UP_STORES,
                items: []
              },
              {
                type: CONSTANT.CENTERLIST.SERVICE_CENTRE,
                items: []
              }
            ];
            filteredCentreList.forEach((centre) => {
              const branchType = centre.type.toLowerCase();
              if (branchType === "experience centre") {
                centreList[0].items.push(centre);
              } else if (branchType === "pop-up store") {
                centreList[1].items.push(centre);
              } else if (branchType === "servicebranch") {
                centreList[2].items.push(centre);
              }
            });
            setNearbyVidaCentreListDispatcher([...centreList]);
            resolve([...centreList]);
          } else {
            setNearbyVidaCentreListDispatcher([]);
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
          Logger.error(error);
        });
    });
  }
}

export function getVidaCentreBranchList(param) {
  const url = appUtils
    .getAPIUrl("serviceableBranchesUrl")
    .replace("$CITY", param);
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          if (response.data.length > 0 && response.status === 200) {
            const filteredCentreList = response.data
              .map((item) => {
                return {
                  ...item,
                  label: item.experienceCenterName,
                  value: item.id
                };
              })
              .filter(
                (branch) =>
                  branch.type === "ServiceBranch" ||
                  branch.type === "Experience Centre"
              );

            resolve(filteredCentreList);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
          Logger.error(error);
        });
    });
  }
}

export function getVidaCentreByBranchID(param) {
  const url = appUtils
    .getAPIUrl("getBranchesByIdAPIUrl")
    .replace("$branchId", param);
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          if (response.data.length > 0 && response.status === 200) {
            const selectedDealer = response.data;
            resolve(selectedDealer);
          } else {
            resolve([]);
          }
        })
        .catch((error) => {
          reject(error);
          Logger.error(error);
        });
    });
  }
}

export function getServiceablePincodesList(location) {
  const url = appUtils
    .getAPIUrl("serviceablePincodesUrl")
    .replace("$COUNTRY", location.country)
    .replace("$STATE", location.state)
    .replace("$CITY", location.city);
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          setSpinnerActionDispatcher(false);
          if (response) {
            setServiceablePincodesListDispatcher(response.data);
          }
          resolve(response.data);
        })
        .catch((error) => {
          setSpinnerActionDispatcher(false);
          reject(error);
        });
    });
  }
}

export function getGoogleMapData(city, state) {
  const url = appUtils
    .getAPIUrl("googleMapUrl")
    .replace("$CITY", city)
    .replace("$STATE", state)
    .replace("$GOOGLEAPIKEY", appUtils.getConfig("googleAPIKey"));
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          if (response.status === 200 && response.data.results[0]) {
            resolve(response.data.results[0].geometry.location);
          } else {
            reject(response.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export function getLongTermPackageList(cityId) {
  const url = appUtils.getAPIUrl("lttrPackageMasterUrl");
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          if (response) {
            const packageList = response.data
              .find((city) => city.id == cityId)
              .packages.map((item) => {
                return {
                  ...item,
                  label: item.name,
                  value: item.packageId
                };
              });
            resolve([...packageList]);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export function getLongTermVehicleList(cityId) {
  const url = appUtils
    .getAPIUrl("lttrVehicleMasterUrl")
    .replace("$CITYID", cityId);

  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          if (response) {
            const vehicleList = response.data.map((item) => {
              return {
                ...item,
                label: item.ModelName,
                value: item.SkuId
              };
            });
            resolve([...vehicleList]);
            setSpinnerActionDispatcher(false);
          }
        })
        .catch((error) => {
          reject(error);
          setSpinnerActionDispatcher(false);
        });
    });
  }
}
export function getPickupLocations(city, state) {
  const url = appUtils
    .getAPIUrl("pickupLocationUrl")
    .replace("$CITY", city)
    .replace("$STATE", state);
  if (url) {
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
}
