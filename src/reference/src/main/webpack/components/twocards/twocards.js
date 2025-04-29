import Logger from "../../services/logger.service";
import analyticsUtils from "../../site/scripts/utils/analyticsUtils";

class TwoCards {
  constructor(el) {
    this.el = el;
    this.selector = {
      navigationIcon: this.el.querySelectorAll(".navigation-icon-wrapper")
    };

    if (this.selector.navigationIcon) {
      try {
        this.handleRedirect();
      } catch (error) {
        Logger.error(error);
      }
    }
  }

  ctaTracking(e, eventName) {
    const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
    if (isAnalyticsEnabled) {
      const str = e.dataset.heading.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, "");
      const customLink = {
        ctaText: str,
        ctaLocation: e.dataset.ctaLocation
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  }

  handleRedirect() {
    const self = this;
    Array.from(self.selector.navigationIcon).forEach(function (element) {
      element.addEventListener("click", function () {
        self.ctaTracking(element, "ctaButtonClick");
      });
    });
  }

  static init(el) {
    return new TwoCards(el);
  }
}

export default TwoCards;
