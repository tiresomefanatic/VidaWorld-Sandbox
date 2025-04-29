import { setSpinnerActionDispatcher } from "../../react-components/store/spinner/spinnerActions";
import CONSTANT from "../../site/scripts/constant";
import loginUtils from "../../site/scripts/utils/loginUtils";
import Cookies from "js-cookie";

const visualizerResize = () => {
  const headerHeight = document.querySelector(".vida-header").offsetHeight;
  document.querySelector(".vida-product-configurator").style.height = `${
    window.innerHeight - headerHeight
  }px`;
};
class Configurator {
  constructor(el) {
    this.el = el;
    this.set3dScooter();
  }
  set3dScooter() {
    const isSessionActive = loginUtils.getSessionToken();
    let urlParams = "";
    if (isSessionActive) {
      const allVidaId = loginUtils.getVidaID();
      urlParams = "?auth-state=true&cust_no=" + allVidaId.custNum;
    } else {
      urlParams = "?auth-state=false";
    }

    setSpinnerActionDispatcher(true);

    const iframeUrl = document.querySelector(
      ".vida-product-configurator__visualizer"
    ).dataset.src;

    const cookieObj = new URLSearchParams(
      document.cookie.replaceAll("&", "%26").replaceAll("; ", "&")
    );
    const alloyInterval = setInterval(() => {
      //TODO: Temp fix, will rework on the setinterval
      if (alloy) {
        clearInterval(alloyInterval);
        alloy("getIdentity")
          .then(function (result) {
            setSpinnerActionDispatcher(false);
            const cookiePinNo = cookieObj.get(CONSTANT.COOKIE_PIN_NUMBER);
            let pinNumber = "";
            if (cookiePinNo) {
              if (cookiePinNo === "null") {
                pinNumber = result.identity.ECID;
              } else {
                pinNumber = cookiePinNo;
              }
            } else {
              pinNumber = result.identity.ECID;
            }

            document
              .querySelector(".vida-product-configurator__visualizer")
              .setAttribute(
                "src",
                iframeUrl + urlParams + "&pin_no=" + pinNumber
              );

            visualizerResize();
            window.addEventListener("resize", visualizerResize);

            Cookies.set(CONSTANT.COOKIE_PIN_NUMBER, pinNumber, {
              expires: appUtils.getConfig("tokenExpirtyInDays"),
              secure: true,
              sameSite: "strict"
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }, 1000);
  }

  static init(el) {
    return new Configurator(el);
  }
}

export default Configurator;
