import analyticsUtils from "../scripts/utils/analyticsUtils";
import Logger from "../../services/logger.service";
import appUtils from "./utils/appUtils";

const analyticsCtaClick = (e, redirectionUrl) => {
  const customLink = {
    name: e.target.innerText,
    position: e.target.dataset.linkPosition,
    type: e.target.role,
    clickType: "other"
  };
  if (redirectionUrl) {
    const additionalPageName = "";
    const additionalJourneyName = "";
    analyticsUtils.trackCtaClick(
      customLink,
      additionalPageName,
      additionalJourneyName,
      function () {
        if (e.target.getAttribute("target")) {
          window.open(redirectionUrl, e.target.getAttribute("target"));
        } else {
          window.location.href = redirectionUrl;
        }
      }
    );
  } else {
    analyticsUtils.trackCtaClick(customLink);
  }
};
class VidaApp {
  constructor() {
    // deviceUtils.rotateDevice();
    const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
    this.selector = {
      ctaAnchor: document.querySelectorAll(".cta--anchor"),
      logoCtaAnchor: document.querySelector(".logo--cta--anchor"),
      closeBtn: document.querySelector(".vida-leave-page-notification__close")
    };
    //this.handlePageModal();

    if (isAnalyticsEnabled) {
      analyticsUtils.initAnalyticsData();
      this.triggerAnalyticsEvents();
    }
  }

  handlePageModal() {
    const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
    const showLeavePageNotification = appUtils.getPageConfig(
      "showLeavePageNotification"
    );

    // if (isAnalyticsEnabled) {
    //   this.selector?.logoCtaAnchor?.addEventListener("click", function (e) {
    //     e.preventDefault();
    //     const customLink = {
    //       name: "Vida World Logo",
    //       position: "Top",
    //       type: "Link",
    //       clickType: "other"
    //     };
    //     const additionalPageName = "";
    //     const additionalJourneyName = "";
    //     analyticsUtils.trackCtaClick(
    //       customLink,
    //       additionalPageName,
    //       additionalJourneyName,
    //       function () {
    //         window.location.href = e.currentTarget.href;
    //       }
    //     );
    //   });
    // }

    for (let i = 0; i < this.selector.ctaAnchor.length; i++) {
      this.selector.ctaAnchor[i].addEventListener("click", function (e) {
        e.preventDefault();
        try {
          if (
            showLeavePageNotification &&
            showLeavePageNotification.toLowerCase() == "true"
          ) {
            document.querySelector(
              ".vida-leave-page-notification"
            ).style.display = "block";
            document.querySelector("html").classList.add("overflow-hidden");
            document
              .querySelector(".vida-leave-page-notification__redirection")
              .setAttribute("href", e.currentTarget.href);

            if (isAnalyticsEnabled) {
              analyticsCtaClick(e);
            }
          } else if (isAnalyticsEnabled) {
            analyticsCtaClick(e, e.currentTarget.href);
          }
        } catch (error) {
          Logger.error(error);
        }
      });
    }

    if (this.selector.closeBtn) {
      this.selector.closeBtn.addEventListener("click", function () {
        document.querySelector(".vida-leave-page-notification").style.display =
          "none";
        if (
          !document
            .querySelector(".vida-header__nav-menu")
            .classList.contains("vida-header__nav-menu--show")
        ) {
          document.querySelector("html").classList.remove("overflow-hidden");
        }
      });
    }
  }

  pageListName() {
    const url = window.location.pathname;
    if (url === "/") {
      return "indexUrl";
    } else {
      try {
        const fileName = url.substring(url.lastIndexOf("/") + 1);
        const fileUrl = Object.entries(
          window.appConfig.globalConfig.pageList
        ).find(
          (item) => item[1].substring(item[1].lastIndexOf("/") + 1) === fileName
        );

        return fileUrl ? fileUrl[0] : "indexUrl";
      } catch (error) {
        Logger.error(error);
      }
    }
  }

  triggerAnalyticsEvents() {
    try {
      const pageUrlName = this.pageListName();
      switch (pageUrlName) {
        // case "testDriveUrl":
        // case "vidaTestRideNewUrl":
        //   // test ride analytics is called on form interaction
        //   analyticsUtils.trackPageLoad();
        //   analyticsUtils.trackDatalayerPageLoad();
        //   break;
        case "profileUrl":
          setTimeout(() => {
            analyticsUtils.trackPageLoad();
            analyticsUtils.trackDatalayerPageLoad();
          }, 1500);
          break;
        default:
          analyticsUtils.trackPageLoad();
          analyticsUtils.trackDatalayerPageLoad();
          break;
      }
    } catch (error) {
      Logger.error(error);
    }
  }
  static init(el) {
    return new VidaApp(el);
  }
}

export default VidaApp;
