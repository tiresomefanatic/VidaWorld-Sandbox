import config from "../config";

const appUtils = {
  getConfig: (key) => {
    const configObj = {
      ...config.globalConfig,
      ...window.appConfig.globalConfig
    };
    return configObj[key];
  },
  getAnalyticsConfig: (key) => {
    return (
      window.appConfig.analyticsConfig && window.appConfig.analyticsConfig[key]
    );
  },
  getPageConfig: (key) => {
    return window.appConfig.pageConfig && window.appConfig.pageConfig[key];
  },
  getAPIUrl: (key) => {
    return window.appConfig &&
      window.appConfig.globalConfig &&
      window.appConfig.globalConfig.apiUrl
      ? window.appConfig.globalConfig.apiUrl[key]
      : null;
  },
  getPageUrl: (key) => {
    return window.appConfig &&
      window.appConfig.globalConfig &&
      window.appConfig.globalConfig.pageList
      ? window.appConfig.globalConfig.pageList[key]
      : null;
  },
  checkIfFalsy: (value) => {
    return (
      value == null ||
      value === false ||
      value === 0 ||
      value === NaN ||
      (typeof value === "string" && value.trim().length === 0) ||
      value === undefined ||
      typeof value === "undefined"
    );
  }
};

export default Object.freeze(appUtils);
