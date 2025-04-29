import Logger from "js-logger";
import API from "./rest.service";
import appUtils from "../site/scripts/utils/appUtils";

Logger.useDefaults({
  formatter: function (messages) {
    messages.unshift("::");
    messages.unshift(new Date().toUTCString());
  }
});

/* Send messages to a custom logging endpoint for analysis
Logger.setHandler(function (messages, context) {
    // Send messages to a custom logging endpoint for analysis.
});
*/

if (process.env.NODE_ENV === "production") {
  Logger.setLevel(Logger.WARN);
}

export default Logger;

export function generateMmiToken() {
  const url = appUtils.getAPIUrl("currentPagePath") + ".getMMIDetails.html";
  if (url) {
    return new Promise((resolve, reject) => {
      API.getData(url)
        .then((response) => {
          if (response.status === 200) {
            const tokenData = response.data.token;
            resolve(tokenData);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
