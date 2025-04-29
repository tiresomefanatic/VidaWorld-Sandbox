import Logger from "../../services/logger.service";
import analyticsUtils from "../../site/scripts/utils/analyticsUtils";

class BatteryDetails {
  constructor(el) {
    this.el = el;
    this.selector = {
      linkEle: this.el.querySelectorAll(".battery-details--button_nav")
    };

    if (this.selector.linkEle) {
      try {
        this.initBatteryDetails();
      } catch (error) {
        Logger.error(error);
      }
    }
  }

  ctaTracking(e, eventName) {
    const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.innerText,
        ctaLocation: "Battery warranty"
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  }

  initBatteryDetails() {
    const self = this;
    Array.from(self.selector.linkEle).forEach(function (element) {
      element.addEventListener("click", function () {
        self.ctaTracking(element, "ctaButtonClick");
      });
    });
  }

  static init(el) {
    return new BatteryDetails(el);
  }
}

export default BatteryDetails;
