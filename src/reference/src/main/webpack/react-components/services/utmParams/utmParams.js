import loginUtils from "../../../site/scripts/utils/loginUtils";

/*
get params from url
check if params are correct params
add/replace params in localstorage
if params not from url then fetch from lcoalstorage

and send in api

*/

export function clearUtmParams() {
  localStorage.setItem("utm_source", "");
  localStorage.setItem("utm_medium", "");
  localStorage.setItem("utm_campaign", "");
  localStorage.setItem("utm_adgroup", "");
}

export function getUtmParams() {
  const isLoggedIn = loginUtils.isSessionActive();

  // if (!isLoggedIn) {
  //   clearUtmParams();
  // }
  const queryString = location.href.split("?")[1];
  const params = new URLSearchParams("?" + queryString);
  let utmSource;
  let utmMedium;
  let utmCampaign;
  let utmAdgroup;

  if (params && params.get("utm_source")) {
    utmSource = params.get("utm_source");
    //
    localStorage.setItem("utm_source", utmSource);
  } else if (localStorage.getItem("utm_source")) {
    utmSource = localStorage.getItem("utm_source");
  }

  //utm_medium
  if (params && params.get("utm_medium")) {
    utmMedium = params.get("utm_medium");
    //
    localStorage.setItem("utm_medium", utmMedium);
  } else if (localStorage.getItem("utm_medium")) {
    utmMedium = localStorage.getItem("utm_medium");
  }

  //utm_campaign
  if (params && params.get("utm_campaign")) {
    utmCampaign = params.get("utm_campaign");
    //
    localStorage.setItem("utm_campaign", utmCampaign);
  } else if (localStorage.getItem("utm_campaign")) {
    utmCampaign = localStorage.getItem("utm_campaign");
  }

  //utm_adgroup
  if (params && params.get("utm_adgroup")) {
    utmAdgroup = params.get("utm_adgroup");

    //
    localStorage.setItem("utm_adgroup", utmAdgroup);
  } else if (localStorage.getItem("utm_adgroup")) {
    utmAdgroup = localStorage.getItem("utm_adgroup");
  }

  return {
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_adgroup: utmAdgroup
  };
}
