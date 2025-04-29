import API from "../../../services/rest.service";
import appUtils from "../../../site/scripts/utils/appUtils";

export function getProductDetailsData() {
  const url = appUtils.getAPIUrl("productListUrl");
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

export function getProductBranchesData() {
  const url = appUtils.getAPIUrl("productBranchesUrl");
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          if (response?.data) {
            const transformedData = [];
            response.data.forEach((item) => {
              transformedData.push({
                ...item,
                ...{
                  label: item.cityName + ", " + item.stateName,
                  value: item.id
                }
              });
            });
            resolve(transformedData);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export function getProductPricesData() {
  const url = appUtils.getAPIUrl("productPriceUrl");
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
