import Cookies from "js-cookie";
import CONSTANT from "../constant";
import appUtils from "./appUtils";
import CryptoJS from "crypto-js";
import { RSAUtilsAccessories } from "./encryptDecryptUtils";

const loginUtils = {
  setSessionToken: function (token) {
    Cookies.set(CONSTANT.COOKIE_SESSION_TOKEN, token, {
      expires: appUtils.getConfig("tokenExpirtyInDays"),
      secure: true,
      sameSite: "strict"
    });
  },

  setVidaID: function (account_id, lead_id, cusNum) {
    Cookies.set(CONSTANT.COOKIE_ACCOUNT_ID, account_id, {
      expires: appUtils.getConfig("tokenExpirtyInDays"),
      secure: true,
      sameSite: "strict"
    });
    Cookies.set(CONSTANT.COOKIE_LEAD_ID, lead_id, {
      expires: appUtils.getConfig("tokenExpirtyInDays"),
      secure: true,
      sameSite: "strict"
    });
    Cookies.set(CONSTANT.COOKIE_CUSTOMER_NUMBER, cusNum, {
      expires: appUtils.getConfig("tokenExpirtyInDays"),
      secure: true,
      sameSite: "strict"
    });
  },

  getSessionToken: function () {
    return Cookies.get(CONSTANT.COOKIE_SESSION_TOKEN);
  },

  removeSessionToken: function () {
    Cookies.remove(CONSTANT.COOKIE_SESSION_TOKEN);
    Cookies.remove(CONSTANT.COOKIE_ACCOUNT_ID);
    Cookies.remove(CONSTANT.COOKIE_LEAD_ID);
    Cookies.remove(CONSTANT.COOKIE_CUSTOMER_NUMBER);
    Cookies.remove(CONSTANT.COOKIE_OPPORTUNITY_ID);
    Cookies.remove(CONSTANT.COOKIE_PIN_NUMBER);
    Cookies.remove(CONSTANT.COOKIE_ADOBE_ANALYTICS_DATA);
    Cookies.remove(CONSTANT.COOKIE_ADOBE_LOCATION_DATA);
  },

  isSessionActive: function () {
    return !!Cookies.get(CONSTANT.COOKIE_SESSION_TOKEN);
  },

  setAdobeAnalyticsData: function (
    email,
    phoneNo,
    city,
    state,
    pinCode,
    country
  ) {
    const md5AdobeAnalyticsData =
      CryptoJS.SHA256(email) + "|" + CryptoJS.SHA256(phoneNo);
    const userDetailsData =
      RSAUtilsAccessories.encrypt(email) +
      "|" +
      RSAUtilsAccessories.encrypt(phoneNo);
    // RSAUtils.encrypt(formData.number);
    Cookies.set(CONSTANT.COOKIE_ADOBE_ANALYTICS_DATA, md5AdobeAnalyticsData, {
      expires: appUtils.getConfig("tokenExpirtyInDays"),
      secure: true,
      sameSite: "strict"
    });
    Cookies.set(CONSTANT.COOKIE_ACCESSORIES_DATA, userDetailsData, {
      expires: appUtils.getConfig("tokenExpirtyInDays"),
      secure: true,
      sameSite: "strict"
    });
    const locationData = city + "|" + state + "|" + pinCode + "|" + country;
    Cookies.set(CONSTANT.COOKIE_ADOBE_LOCATION_DATA, locationData, {
      expires: appUtils.getConfig("tokenExpirtyInDays"),
      secure: true,
      sameSite: "strict"
    });
  },

  getVidaID: function () {
    const vidaIdList = {
      accountID:
        Cookies.get(CONSTANT.COOKIE_ACCOUNT_ID) !== "null"
          ? Cookies.get(CONSTANT.COOKIE_ACCOUNT_ID)
          : "",
      leadID:
        Cookies.get(CONSTANT.COOKIE_LEAD_ID) !== "null"
          ? Cookies.get(CONSTANT.COOKIE_LEAD_ID)
          : "",
      custNum: Cookies.get(CONSTANT.COOKIE_CUSTOMER_NUMBER)
        ? Cookies.get(CONSTANT.COOKIE_CUSTOMER_NUMBER)
        : "",
      opportunityID: Cookies.get(CONSTANT.COOKIE_OPPORTUNITY_ID)
        ? Cookies.get(CONSTANT.COOKIE_OPPORTUNITY_ID)
        : "",
      hE: Cookies.get(CONSTANT.COOKIE_ADOBE_ANALYTICS_DATA)
        ? Cookies.get(CONSTANT.COOKIE_ADOBE_ANALYTICS_DATA).split("|")[0]
        : "",
      hP: Cookies.get(CONSTANT.COOKIE_ADOBE_ANALYTICS_DATA)
        ? Cookies.get(CONSTANT.COOKIE_ADOBE_ANALYTICS_DATA).split("|")[1]
        : ""
    };
    return vidaIdList;
  },

  getVidaLocation: function () {
    const location = {
      city: Cookies.get(CONSTANT.COOKIE_ADOBE_LOCATION_DATA)
        ? Cookies.get(CONSTANT.COOKIE_ADOBE_LOCATION_DATA).split("|")[0]
        : "",
      state: Cookies.get(CONSTANT.COOKIE_ADOBE_LOCATION_DATA)
        ? Cookies.get(CONSTANT.COOKIE_ADOBE_LOCATION_DATA).split("|")[1]
        : "",
      country: Cookies.get(CONSTANT.COOKIE_ADOBE_LOCATION_DATA)
        ? Cookies.get(CONSTANT.COOKIE_ADOBE_LOCATION_DATA).split("|")[2]
        : "",
      pinCode: Cookies.get(CONSTANT.COOKIE_ADOBE_LOCATION_DATA)
        ? Cookies.get(CONSTANT.COOKIE_ADOBE_LOCATION_DATA).split("|")[3]
        : ""
    };
    return location;
  }
};

export default loginUtils;
