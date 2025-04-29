import axios from "axios";
import CONSTANT from "../site/scripts/constant";
import Logger from "./logger.service";

const options = {
  headers: {
    "Content-Type": "application/json"
  }
};

// Request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    Logger.error(error);
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const { status } = error.response;
    const errorCode = CONSTANT.HTTP_ERROR_CODES[status];
    if (errorCode) {
      Logger.error(errorCode);
    }

    return Promise.reject(error.response);
  }
);

async function getData(url) {
  return await axios
    .get(url, options)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
}

async function postData(url, params = {}) {
  return await axios
    .post(url, params, options)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
}

export default {
  getData,
  postData
};
