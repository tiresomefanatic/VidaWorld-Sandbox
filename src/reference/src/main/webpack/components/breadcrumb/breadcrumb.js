import Logger from "../../services/logger.service";
import analyticsUtils from "../../site/scripts/utils/analyticsUtils";

class Breadcrumb {
  constructor(el) {
    this.el = el;
    this.selector = {
      linkEle: this.el.querySelectorAll(".cmp-breadcrumb__item-link"),
      pageNameEle: this.el.querySelector(".cmp-breadcrumb__item--active")
    };

    if (this.selector.linkEle) {
      try {
        this.initBreadcumb();
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
        ctaLocation: this.selector.pageNameEle.innerText
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  }

  initBreadcumb() {
    const self = this;
    Array.from(self.selector.linkEle).forEach(function (element) {
      element.addEventListener("click", function () {
        self.ctaTracking(element, "breadcrumbClick");
      });
    });
  }

  static init(el) {
    return new Breadcrumb(el);
  }
}

export default Breadcrumb;
