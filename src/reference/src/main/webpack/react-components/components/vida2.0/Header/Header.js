import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { getUtmParams } from "../../../../react-components/services/utmParams/utmParams";
import { getScrollTracker } from "../../../../react-components/services/scrollTracker/scrollTracker";

import appUtils from "../../../../site/scripts/utils/appUtils";
import UserLogin from "../UserLogin/UserLogin";
import Logout from "../Logout/Logout";
import { connect } from "react-redux";
import { useAllUserTestRides } from "../../../hooks/userProfile/userProfileHooks";
import CONSTANT from "../../../../site/scripts/constant";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import { debounce } from "../../../../site/scripts/helper";

const Header = (props) => {
  const { config, allUserTestRidesData } = props;
  const [isOpened, setIsOpened] = useState(false);
  const [isSelectedTabIndex, setIsSelectedTabIndex] = useState();
  const headerRef = useRef(null);
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const isLoggedIn = loginUtils.isSessionActive();
  const getAllTestRides = useAllUserTestRides();
  const handleTogglePopup = (value) => {
    setIsOpened(value);
  };
  const location = window.location;

  // to remove the blur-effect
  const removeBlurEffect = (event) => {
    event.target.classList.remove("blur-effect");
  };

  const stopScroll = debounce((event) => removeBlurEffect(event), 100);

  // to handle the scroll event
  const handleScroll = (event) => {
    event.target.classList.add("blur-effect");
    stopScroll(event);
  };

  const ordersUrl = appUtils.getPageUrl("ordersUrl");

  // restrict scrolling on hamburger open
  useEffect(() => {
    if (isOpened) {
      document.querySelector("html").classList.add("overflow-hidden");
    } else {
      document.querySelector("html").classList.remove("overflow-hidden");
    }
  }, [isOpened]);

  useEffect(() => {
    const pagePathName = window.location.pathname;

    // index refers to navbar options count
    // indexes 0,1,2,3 used for explore,try,buy,love respectively
    switch (pagePathName) {
      case "/products.html":
        return setIsSelectedTabIndex(0);
      case "/test-ride.html":
        return setIsSelectedTabIndex(1);
      case "/reserve.html":
        return setIsSelectedTabIndex(2);
      case "/love.html":
        return setIsSelectedTabIndex(3);
      default:
        return setIsSelectedTabIndex();
    }
  });
  useEffect(() => {
    const element = document.getElementById("header-slide");
    getUtmParams();
    getScrollTracker(window.appConfig.scrollTrackingBuckets);
    console.log("header mounted, class list ===>", element?.classList);
    element?.classList?.remove("slide-left");
    return () => {
      setTimeout(() => {
        element?.classList?.remove("slide-left");
        setIsOpened(false);
        console.log("slide-left removed after 500ms ===>", element?.classList);
      }, 500);
    };
  }, []);

  // if the clickevent is outside of hamburger-menu, close the hamburger
  const handleOutsideClick = (e) => {
    if (headerRef.current && !headerRef.current.contains(e.target)) {
      setIsOpened(false);
    }
  };

  // to detect the click event outside of hamburger-menu
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaHamburgerAnalytics = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition,
        clickURL: e.currentTarget.href
      };
      analyticsUtils.trackCTAClicksVida2(customLink);
    }
  };

  const vidaLogoAnalytics = (e) => {
    e.preventDefault();
    const customLink = {
      ctaText: "Vida World Logo",
      ctaLocation: "header"
    };
    const additionalPageName = "";
    const additionalJourneyName = "";
    analyticsUtils.trackCtaClickV2(
      customLink,
      additionalPageName,
      additionalJourneyName,
      function () {
        window.location.href = e.currentTarget.href;
      }
    );
  };

  const ctaAnalytics = (e) => {
    e.preventDefault();
    const customLink = {
      ctaText: e.target.innerText,
      ctaLocation: e.target.dataset.linkPosition
    };
    const additionalPageName = "";
    const additionalJourneyName = "";
    analyticsUtils.trackCtaClickV2(
      customLink,
      additionalPageName,
      additionalJourneyName,
      function () {
        window.location.href = e.currentTarget.href;
      }
    );
  };

  const checkforTRApplicable = async (url) => {
    const testRideData = await getAllTestRides();
    if (allUserTestRidesData.items && allUserTestRidesData.items.length > 0) {
      const shortTestRideData = allUserTestRidesData?.items.filter(
        (item) => !item.IsLTTR
      );

      const confirmedData = shortTestRideData.filter(
        (item) => item.dmpl__Status__c === CONSTANT.TEST_RIDE_STATUS.CONFIRMED
      );

      if (confirmedData.length > 0) {
        window.location.href = ordersUrl + "?" + "testride";
        setIsSelectedTabIndex();
      } else {
        window.location.href = url;
      }
    } else {
      window.location.href = url;
    }
  };

  const handleTabSwitch = (event, index, url) => {
    setIsSelectedTabIndex(index);
    ctaAnalytics(event);
    if (index == 1) {
      //checking for Test Ride
      if (isLoggedIn) {
        checkforTRApplicable(url);
      } else {
        window.location.href = url;
      }
    }
  };

  const goToPrevPage = () => {
    window.history.back();
  };

  const testRideHandler = (e, url, isNewTab) => {
    ctaHamburgerAnalytics(e);
    setIsOpened(false);
    if (isLoggedIn && url.includes("test")) {
      checkforTRApplicable(url);
    } else {
      window.open(url, isNewTab ? "_blank" : "_self");
    }
  };

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     getAllTestRides();
  //   }
  // }, [isLoggedIn]);

  return (
    <div className={`vida-header-wrapper ${config.headerVariation}`}>
      <div className="vida-header-container">
        <div className="vida-logo-container">
          <div className="vida-logo">
            <a
              href={config.vidaLogoNavLink}
              onClick={(e) => vidaLogoAnalytics(e)}
            >
              <img
                src={config.headerVidaLogo}
                alt={config?.headerLogoAlt || "vida_logo"}
                title={config?.headerLogoTitle}
              ></img>
            </a>
          </div>
          <div className="hero-logo">
            <a
              href={config.heroLogoNavLink}
              target={config.headerLogoNewTab ? "_blank" : "_self"}
              rel="noreferrer"
            >
              <img
                src={config.headerHeroLogo}
                alt={config?.headerHeroLogoAlt || "hero_logo"}
                title={config?.headerHeroLogoTitle}
              ></img>
            </a>
          </div>
        </div>
        <div className="vida-header-title-container">
          <div className="vida-header-title-flex-container">
            {config.vidaHeaderBackIcon && (
              <div className="vida-header-back-icon">
                <a
                  onClick={goToPrevPage}
                  href="#"
                  target={config.headerBacknNewTab ? "_blank" : "_self"}
                  rel="noreferrer"
                >
                  <img
                    src={config.vidaHeaderBackIcon}
                    alt="vida_header_back_icon"
                  ></img>
                </a>
              </div>
            )}
            <div className="vida-header-title">
              {window.location.pathname.includes("charging-locator") ||
              (window.location.pathname.includes("dealers-locator") &&
                !isDesktop) ? (
                <h1>{appUtils.getConfig("pageTitle")}</h1>
              ) : window.location.pathname.includes("love") ? (
                <h2>{appUtils.getConfig("pageTitle")}</h2>
              ) : (
                <span>{appUtils.getConfig("pageTitle")}</span>
              )}
            </div>
          </div>
        </div>
        <div className="vida-navbar-container">
          {config.navbarOptions.map((item, index) => (
            <div
              className={
                isSelectedTabIndex == index
                  ? "vida-navbar-option active-option"
                  : "vida-navbar-option"
              }
              key={index}
            >
              <div className="vida-navbar-option-icon">
                <a
                  className="vida-navbar-option-link"
                  href={item?.navLink}
                  target={item?.newTab ? "_blank" : "_self"}
                  rel="noreferrer"
                  onClick={(event) =>
                    handleTabSwitch(event, index, item?.navLink)
                  }
                >
                  <img
                    className="vida-navbar-option-img"
                    src={item?.image}
                    alt="vida_navbar_option"
                  ></img>
                </a>
              </div>
              <p>
                <a
                  href={item?.navLink}
                  target={item?.newTab ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="vida-navbar-option-text"
                  data-link-position={config.dataPosition || "header"}
                  onClick={(event) =>
                    handleTabSwitch(event, index, item?.navLink)
                  }
                >
                  {item?.title}
                </a>
              </p>
            </div>
          ))}
          {config?.vidaCustomerCareIcon && (
            <div className="vida-header-customer-care-icon">
              <a
                href={config.vidaCustomerCareNavLink}
                target={config.customerCareNewTab ? "_blank" : "_self"}
                rel="noreferrer"
              >
                <img
                  src={config?.vidaCustomerCareIcon}
                  alt="vida_customer_care_icon"
                ></img>
              </a>
            </div>
          )}
          <div
            className="vida-hamburger-container"
            onClick={() => handleTogglePopup(true)}
          >
            <div className="vida-hamburger-line"></div>
            <div className="vida-hamburger-line"></div>
            <div className="vida-hamburger-line"></div>
          </div>
        </div>
      </div>
      <div
        id={"header-slide"}
        className={
          isOpened
            ? "vida-hamburger-menu-wrapper slide-left"
            : "vida-hamburger-menu-wrapper"
        }
        ref={headerRef}
      >
        <div className="vida-hamburger-menu-container">
          <img
            src={
              isDesktop
                ? config.hamburgerBgImg?.desktopImg
                : config.hamburgerBgImg?.mobImg
            }
            className="vida-hamburger-bg"
            alt="hamburger_bg"
          />
          <div className="vida-hamburger-menu-content-container">
            <img
              src={
                isDesktop
                  ? config.hamburgerBg1Img?.desktopImg
                  : config.hamburgerBg1Img?.mobImg
              }
              className="vida-hamburger-bg1"
              alt="hamburger_bg1"
            />
            <div className="vida-hamburger-content">
              <div className="vida-hamburger-topbar">
                <div className="vida-logo-container">
                  <div className="vida-logo">
                    <a
                      href={config.vidaLogoNavLink}
                      onClick={(e) => vidaLogoAnalytics(e)}
                    >
                      <img
                        src={config.headerVidaLogo}
                        alt={config?.headerLogoAlt || "vida_logo"}
                        title={config?.headerLogoTitle}
                      ></img>
                    </a>
                  </div>
                  <div className="hero-logo">
                    <a
                      href={config.heroLogoNavLink}
                      target={config.headerLogoNewTab ? "_blank" : "_self"}
                      rel="noreferrer"
                    >
                      <img
                        src={config.headerHeroLogo}
                        alt={config?.headerHeroLogoAlt || "vida_logo"}
                        title={config?.headerHeroLogoTitle}
                      ></img>
                    </a>
                  </div>
                </div>
                <div
                  className="close-icon"
                  onClick={() => handleTogglePopup(false)}
                >
                  <img
                    src={
                      appUtils.getConfig("resourcePath") +
                      "images/png/close_icon.png"
                    }
                    alt="close_icon"
                  />
                </div>
              </div>
              <div
                className="vida-hamburger-sites-container"
                onScroll={handleScroll}
              >
                <div className="vida-hamburger-sites-content ">
                  <p className="vida-hamburger-sites-title my-account-text">
                    {config.myAccountContent?.myAccountText}
                  </p>
                  <UserLogin
                    profileLink={config.myAccountContent?.profileLink}
                    preLoginNavLink={config.myAccountContent?.preLoginNavLink}
                    signUpNavLink={config.myAccountContent?.signUpNavLink}
                    preLoginText={config.myAccountContent?.preLoginText}
                    signUpText={config.myAccountContent?.signUpText}
                    dataPosition={config.dataPosition}
                  />
                </div>
                <div className="vida-hamburger-flex-container">
                  <div className="vida-sub-flex-container">
                    <div className="vida-hamburger-sites-content">
                      <p className="vida-hamburger-sites-title">
                        {config.tryOptionContent?.title}
                      </p>
                      {config.tryOptionContent?.sitesOption?.map(
                        (item, index) => (
                          <a
                            className="vida-hamburger-sites-name"
                            key={index}
                            data-link-position={config.dataPosition || "header"}
                            onClick={(e) => {
                              testRideHandler(e, item.navLink, item.newTab);
                            }}
                          >
                            {item.name}
                          </a>
                        )
                      )}
                    </div>
                    <div className="vida-hamburger-sites-content">
                      <p className="vida-hamburger-sites-title">
                        {config.buyOptionContent?.title}
                      </p>
                      {config.buyOptionContent?.sitesOption?.map(
                        (item, index) => (
                          <a
                            href={item.navLink}
                            className="vida-hamburger-sites-name"
                            key={index}
                            target={item.newTab ? "_blank" : "_self"}
                            data-link-position={config.dataPosition || "header"}
                            rel="noreferrer"
                            onClick={(e) => {
                              ctaHamburgerAnalytics(e);
                              setIsOpened(false);
                            }}
                          >
                            {item.name}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                  <div className="vida-hamburger-sites-content">
                    <p className="vida-hamburger-sites-title">
                      {config.exploreOptionContent?.title}
                    </p>
                    {config.exploreOptionContent?.sitesOption?.map(
                      (item, index) => (
                        <a
                          href={item.navLink}
                          className="vida-hamburger-sites-name"
                          key={index}
                          target={item.newTab ? "_blank" : "_self"}
                          data-link-position={config.dataPosition || "header"}
                          rel="noreferrer"
                          onClick={(e) => {
                            ctaHamburgerAnalytics(e);
                            setIsOpened(false);
                          }}
                        >
                          {item.name}
                        </a>
                      )
                    )}
                  </div>
                  <div className="vida-hamburger-sites-content">
                    <p className="vida-hamburger-sites-title">
                      {config.loveOptionContent?.title}
                    </p>
                    {config.loveOptionContent?.sitesOption?.map(
                      (item, index) => (
                        <a
                          href={item.navLink}
                          className="vida-hamburger-sites-name"
                          key={index}
                          target={item.newTab ? "_blank" : "_self"}
                          data-link-position={config.dataPosition || "header"}
                          rel="noreferrer"
                          onClick={(e) => {
                            ctaHamburgerAnalytics(e);
                            setIsOpened(false);
                          }}
                        >
                          {item.name}
                        </a>
                      )
                    )}
                  </div>
                </div>
                <div className="vida-hamburger-bottombar">
                  {config.termsAndPrivacyText?.map((item, index) => (
                    <a
                      href={item.navLink}
                      className="vida-hamburger-bottombar-site"
                      key={index}
                      target={item.newTab ? "_blank" : "_self"}
                      data-link-position={config.dataPosition || "header"}
                      rel="noreferrer"
                      onClick={(e) => {
                        ctaHamburgerAnalytics(e);
                        setIsOpened(false);
                      }}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
                <div className="vida-logout-btn">
                  <Logout label={config.logoutlabel} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ userTestRideReducer }) => {
  return {
    allUserTestRidesData: {
      items: userTestRideReducer.items
    }
  };
};

export default connect(mapStateToProps)(Header);

Header.propTypes = {
  config: PropTypes.shape({
    navbarOptions: PropTypes.arrayOf(PropTypes.any),
    termsAndPrivacyText: PropTypes.arrayOf(PropTypes.any),
    tryOptionContent: PropTypes.objectOf(PropTypes.any),
    buyOptionContent: PropTypes.objectOf(PropTypes.any),
    exploreOptionContent: PropTypes.objectOf(PropTypes.any),
    loveOptionContent: PropTypes.objectOf(PropTypes.any),
    hamburgerBgImg: PropTypes.objectOf(PropTypes.any),
    hamburgerBg1Img: PropTypes.objectOf(PropTypes.any),
    myAccountContent: PropTypes.objectOf(PropTypes.any),
    headerVidaLogo: PropTypes.string,
    vidaHeaderBackNavLink: PropTypes.string,
    headerBacknNewTab: PropTypes.bool,
    vidaHeaderBackIcon: PropTypes.string,
    vidaHeaderTitle: PropTypes.string,
    vidaCustomerCareIcon: PropTypes.string,
    vidaCustomerCareNavLink: PropTypes.string,
    customerCareNewTab: PropTypes.bool,
    headerVariation: PropTypes.string,
    vidaLogoNavLink: PropTypes.string,
    hamburgerVidaLogo: PropTypes.string,
    logoutlabel: PropTypes.string,
    dataPosition: PropTypes.string,
    headerLogoAlt: PropTypes.string,
    headerLogoTitle: PropTypes.string,
    headerHeroLogoAlt: PropTypes.string,
    headerHeroLogoTitle: PropTypes.string,
    heroLogoNavLink: PropTypes.string,
    headerHeroLogo: PropTypes.string,
    headerLogoNewTab: PropTypes.bool
  }),
  allUserTestRidesData: PropTypes.shape({
    items: PropTypes.array
  })
};
