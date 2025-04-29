import API from "../../../services/rest.service";

export function postContactData(url, param) {
  if (url) {
    return new Promise((resolve, reject) => {
      API.postData(url, param)
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
