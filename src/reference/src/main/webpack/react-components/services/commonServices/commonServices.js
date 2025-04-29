import API from "../../../services/rest.service";
import appUtils from "../../../site/scripts/utils/appUtils";

export function getAddressTypesData() {
  const url = appUtils.getAPIUrl("addressTypesUrl");
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
export function updateNameToSendInApi(val = "", lname = "") {
  if (appUtils.checkIfFalsy(val)) {
    return "";
  }
  let firstName;
  const fullNameArr = val.trim().split(" ");
  if (fullNameArr.length > 1) {
    firstName = fullNameArr.splice(0, 1).toString();
  } else {
    firstName = fullNameArr[0];
  }
  const lastName = appUtils.checkIfFalsy(lname) ? fullNameArr.join(" ") : lname;
  return [firstName, lastName];
}

export function updateNameToDisplay(fname = "", lname = "") {
  if (appUtils.checkIfFalsy(fname)) {
    return "";
  }
  const fullNameArr = fname.toString().trim().split(" ");
  const firstName = fullNameArr.splice(0, 1).toString();

  const lastName = fullNameArr.splice(0, fullNameArr.length).join(" ");
  if (fname === lname) {
    return fname;
  } else {
    return `${firstName}${
      (lname && " " + lname) || (lastName && " " + lastName) || ""
    }`;
  }
}

export function shuffleArray(obj) {
  return obj ? obj.sort(() => Math.random() - 0.5) : "";
}

export function getBikeDetailsByColor(color = "", bikeDetails = []) {
  return bikeDetails.find((bike) =>
    (bike?.color || "").toUpperCase().includes((color || "").toUpperCase())
  );
}

// To get the scooter image details from selected scooter variant on color string
export function getBikeDetailsByString(color = "", bikeDetails = []) {
  return bikeDetails.find((bike) =>
    (bike?.color || "").toUpperCase().includes((color || "").toUpperCase())
  );
}

// To get the scooter data from selected scooter variant on color string
export function getScooterDataByColorString(color = "", bikeDetails = []) {
  return bikeDetails.find((bike) =>
    (bike?.product?.vaahan_color || "")
      .toUpperCase()
      .includes((color || "").toUpperCase())
  );
}
