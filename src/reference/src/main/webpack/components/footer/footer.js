import analyticsUtils from "../../site/scripts/utils/analyticsUtils";
// import Logger from "../../services/logger.service";
class Footer {
  constructor(el) {
    const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
    this.el = el;
    this.selector = {
      socialLinks: this.el.querySelectorAll(".vida-footer__social-links")
    };

    if (isAnalyticsEnabled) {
      this.socialEvents();
    }
  }

  socialEvents() {
    let iconClickAction = "",
      parentElement = "";
    for (let i = 0; i < this.selector.socialLinks.length; i++) {
      iconClickAction = this.selector.socialLinks[i].firstElementChild;
      iconClickAction.addEventListener("click", function (event) {
        event.preventDefault();
        parentElement = event.target.parentElement;
        try {
          const customLink = {
            name: parentElement.dataset.socialIcon,
            position: "Bottom",
            type: "Link",
            clickType: "exit"
          };

          if (parentElement.href) {
            analyticsUtils.trackSocialIcons(customLink, function () {
              window.open(
                parentElement.href,
                parentElement.getAttribute("target")
              );
            });
          } else {
            analyticsUtils.trackSocialIcons(customLink);
          }
        } catch (error) {
          // Logger.error(error);
          console.log(error);
        }
      });
    }
  }

  static init(el) {
    return new Footer(el);
  }
}

export default Footer;
