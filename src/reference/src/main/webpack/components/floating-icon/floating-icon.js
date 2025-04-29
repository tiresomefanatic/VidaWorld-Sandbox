import analyticsUtils from "../../site/scripts/utils/analyticsUtils";

class FloatingIcon {
  constructor(el) {
    const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
    this.el = el;
    this.selector = {
      dataVidaIcon: this.el.querySelectorAll("[data-vida-icon]")
    };

    if (isAnalyticsEnabled) {
      this.addIconEvents();
    }
  }

  addIconEvents() {
    for (let i = 0; i < this.selector.dataVidaIcon.length; i++) {
      this.selector.dataVidaIcon[i].addEventListener("click", function (e) {
        e.preventDefault();
        const customLink = {
          name: e.currentTarget.dataset.vidaIcon,
          position: "Bottom",
          type: "Icon",
          clickType: "other"
        };

        analyticsUtils.trackSocialIcons(customLink);
      });
    }
  }

  static init(el) {
    return new FloatingIcon(el);
  }
}

export default FloatingIcon;
