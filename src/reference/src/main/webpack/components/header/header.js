import loginUtils from "../../site/scripts/utils/loginUtils";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getScrollTracker } from "../../react-components/services/scrollTracker/scrollTracker";
import analyticsUtils from "../../site/scripts/utils/analyticsUtils";
import { getUtmParams } from "../../react-components/services/utmParams/utmParams";
import appUtils from "../../site/scripts/utils/appUtils";

class Header {
  constructor(el) {
    this.el = el;

    // Scroll Header Animation
    // this.initHeaderAnimation();

    this.selector = {
      navLink: this.el.querySelector(".vida-header__nav-link"),
      app: document.querySelector("html"),
      hamburger: this.el.querySelector(".vida-header__menu-icon"),
      navMenu: this.el.querySelector(".vida-header__nav-menu"),
      closeMenu: this.el.querySelector(".vida-header__nav-close"),
      leavePage: this.el.querySelector("[data-logo-id]"),
      closePageModal: this.el.querySelector("[data-closepage]")
    };
    getUtmParams();
    this.addEvents();
    Header.enableUserAccessLinks(el);
    Header.navigateToTestRide(el);
  }

  addEvents() {
    const self = this;
    this.selector.hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      self.selector.app.classList.toggle("overflow-hidden");
      this.classList.toggle("vida-header__menu-icon--open");
      self.selector.navMenu.classList.toggle("vida-header__nav-menu--show");
    });

    this.selector.closeMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.selector.app.classList.toggle("overflow-hidden");
      this.selector.hamburger.classList.toggle("vida-header__menu-icon--open");
      this.selector.navMenu.classList.toggle("vida-header__nav-menu--show");
    });

    if (this.selector.navLink) {
      this.selector.navLink.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
      });
    }

    this.selector.navMenu.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  static enableUserAccessLinks(el) {
    const userAccessLinks = el.querySelectorAll(
      ".vida-header__user-access-link"
    );
    const userLoginLinks = el.querySelectorAll(".vida-header__user-login-link");
    const isLoggedIn = loginUtils.isSessionActive();
    userAccessLinks.forEach((userAccessLink) => {
      userAccessLink.style.display = isLoggedIn ? "block" : "none";
    });
    userLoginLinks.forEach((userLoginLink) => {
      userLoginLink.style.display = isLoggedIn ? "none" : "block";
    });
  }

  static navigateToTestRide(el) {
    const primaryButton = el.querySelector("#testRideBtn");
    const testRideLoginUrl = appUtils.getPageUrl("testDriveLoginUrl");
    const testRideUrl = appUtils.getPageUrl("testDriveUrl");
    const isLoggedIn = loginUtils.isSessionActive();

    primaryButton.addEventListener("click", function (e) {
      if (isLoggedIn) {
        window.location.href = testRideUrl;
      } else {
        window.location.href = testRideLoginUrl;
      }
    });
  }

  /* Scroll Header Animation */
  /*
  initHeaderAnimation() {
    const showAnim = gsap
      .from(".vida-header__wrapper", {
        yPercent: -100,
        paused: true,
        duration: 0.2
      })
      .progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: 99999,
      toggleClass: "active",
      onUpdate: (self) => {
        // self.direction === -1 ? showAnim.play() : showAnim.reverse();
        if (self.direction === -1) {
          showAnim.play();
          if (document.querySelector(".vida-scroll-navigation__wrapper")) {
            document
              .querySelector(".vida-scroll-navigation__wrapper")
              .classList.remove("vida-scroll-navigation__wrapper-sticky");
            if (document.querySelector(".vida-scroll-navigation--sticky")) {
              document
                .querySelector(".vida-scroll-navigation--sticky")
                .classList.remove("vida-scroll-navigation--sticky-header");
            }
          }

          if (
            document.querySelector(".vida-purchase-configurator__product-info")
          ) {
            document
              .querySelector(".vida-purchase-configurator__product-info")
              .classList.remove(
                "vida-purchase-configurator__product-info-sticky"
              );
          }

          if (document.querySelector(".vida-delivery-details__shipping")) {
            document
              .querySelector(".vida-delivery-details__shipping")
              .classList.remove("vida-delivery-details__shipping-sticky");
          }

          if (document.querySelector(".vida-billing-pricing__status")) {
            document
              .querySelector(".vida-billing-pricing__status")
              .classList.remove("vida-billing-pricing__status-sticky");
          }

          if (
            document.querySelector(".vida-purchase-configurator__scooter-info")
          ) {
            document
              .querySelector(".vida-purchase-configurator__scooter-info")
              .classList.remove(
                "vida-purchase-configurator__scooter-info-sticky"
              );
          }

          if (document.querySelector(".vida-banner-notification__wrapper")) {
            document
              .querySelector(".vida-banner-notification__wrapper")
              .classList.remove("vida-banner-notification__wrapper-sticky");
          }
        } else {
          showAnim.reverse();
          if (document.querySelector(".vida-scroll-navigation__wrapper")) {
            document
              .querySelector(".vida-scroll-navigation__wrapper")
              .classList.add("vida-scroll-navigation__wrapper-sticky");
            if (document.querySelector(".vida-scroll-navigation--sticky")) {
              document
                .querySelector(".vida-scroll-navigation--sticky")
                .classList.add("vida-scroll-navigation--sticky-header");
            }
          }

          if (
            document.querySelector(".vida-purchase-configurator__product-info")
          ) {
            document
              .querySelector(".vida-purchase-configurator__product-info")
              .classList.add("vida-purchase-configurator__product-info-sticky");
          }

          if (document.querySelector(".vida-delivery-details__shipping")) {
            document
              .querySelector(".vida-delivery-details__shipping")
              .classList.add("vida-delivery-details__shipping-sticky");
          }

          if (document.querySelector(".vida-billing-pricing__status")) {
            document
              .querySelector(".vida-billing-pricing__status")
              .classList.add("vida-billing-pricing__status-sticky");
          }

          if (
            document.querySelector(".vida-purchase-configurator__scooter-info")
          ) {
            document
              .querySelector(".vida-purchase-configurator__scooter-info")
              .classList.add("vida-purchase-configurator__scooter-info-sticky");
          }

          if (document.querySelector(".vida-banner-notification__wrapper")) {
            document
              .querySelector(".vida-banner-notification__wrapper")
              .classList.add("vida-banner-notification__wrapper-sticky");
          }
        }
      }
    });

    setTimeout(() => {
      window.scroll(0, 0);
    }, 100);
  }
  */

  static init(el) {
    if (
      analyticsUtils.isAnalyticsEnabled() &&
      window.appConfig &&
      window.appConfig.scrollTrackingBuckets
    ) {
      console.log("<<< footer init");
      getScrollTracker(window.appConfig.scrollTrackingBuckets);
    }
    return new Header(el);
  }
}

window.onclick = function () {
  if (
    document
      .querySelector(".vida-header__nav-menu")
      ?.classList.contains("vida-header__nav-menu--show")
  ) {
    document.querySelector("html").classList.remove("overflow-hidden");
    document
      .querySelector(".vida-header__menu-icon")
      .classList.remove("vida-header__menu-icon--open");
    document
      .querySelector(".vida-header__nav-menu")
      .classList.remove("vida-header__nav-menu--show");
  }
};

export default Header;
