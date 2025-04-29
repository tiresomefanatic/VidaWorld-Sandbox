import React, { useEffect, useState, useRef } from "react";
import PropTypes, { any } from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import appUtils from "../../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const ChargingLocatorChoosePlan = ({ config }) => {
  const {
    titleOne,
    titleTwo,
    headerContent,
    pluginImgMobile,
    pluginImgDesktop,
    chargeLabel,
    chargeContent,
    plansContent,
    navLink,
    btnLabel,
    popUpObj,
    newTab,
    scrollImgMobile,
    scrollImgDesktop,
    dropDownTitle,
    dropDownArrowIcon,
    dropDownContent,
    dataPosition,
    customTitleTwoTag
  } = config;

  // intersection observer
  const {
    ref: chargingChoosePlanContainerRef,
    isVisible: chargingChoosePlanContainerVisible
  } = useIntersectionObserver();
  const pagePath = window.location.pathname;
  const location = window.location;

  const [dropDownClicked, setDropDownClicked] = useState(false);

  const [activeTab, setActiveTab] = useState(1);
  const [openPopup, setOpenPopup] = useState(false);
  const getPlanPopupRef = useRef(null);

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const CustomTitleTag = customTitleTwoTag || "p";

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e, eventName) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.innerText,
        ctaLocation: e?.target?.dataset?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };
  useEffect(() => {
    return setOpenPopup(false);
  }, []);

  const handleContainerClick = () => {
    setDropDownClicked(!dropDownClicked);
  };
  const getMyPlan = (e) => {
    ctaTracking(e, "ctaButtonClick");
    if (navLink && !newTab) {
      window.location.href = navLink;
    } else if (navLink && newTab) {
      const a = document.createElement("a");
      a.target = "_blank";
      a.href = navLink;
      a.click();
    } else {
      setOpenPopup(true);
    }
  };

  // to restict scroll when popup is opened
  useEffect(() => {
    if (openPopup) {
      document.querySelector("html").classList.add("overflow-hidden");
    } else {
      document.querySelector("html").classList.remove("overflow-hidden");
    }
  }, [openPopup]);

  // if the clickevent is outside of popup, close the popup
  const handleOutsideClick = (e) => {
    if (
      getPlanPopupRef.current &&
      !getPlanPopupRef.current.contains(e.target)
    ) {
      setOpenPopup(false);
    }
  };

  // to detect the click event outside of popup
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      className="charging-choose-plan-container vida-2-container"
      ref={chargingChoosePlanContainerRef}
      style={{ opacity: chargingChoosePlanContainerVisible ? 1 : 0 }}
    >
      <div className="charging-choose-plan-wrapper">
        <div className="charging-choose-plan-wrapper__header-container">
          <div className="title-container">
            <p className="title-one">{titleOne}</p>
            {/* need to change this to authorable for SEO changes */}
            <CustomTitleTag className="title-two">{titleTwo}</CustomTitleTag>
          </div>
          {headerContent && (
            <p className="header-content-txt">{headerContent}</p>
          )}
        </div>

        <div className="charging-choose-plan-wrapper__charging-container">
          <div className="plugin-container">
            <img
              src={isDesktop ? pluginImgDesktop : pluginImgMobile}
              alt="charger-plugin-img"
            />
          </div>
          <div className="charge-content-container">
            {chargeLabel &&
              (pagePath.includes("offer") ? (
                <h2 className="charge-txt">{chargeLabel}</h2>
              ) : (
                <p className="charge-txt">{chargeLabel}</p>
              ))}
            {chargeContent &&
              (pagePath.includes("offer") ? (
                <h3 className="charge-content-txt">{chargeContent}</h3>
              ) : (
                <p className="charge-content-txt">{chargeContent}</p>
              ))}
          </div>
        </div>
        {plansContent &&
        (plansContent.header || plansContent?.tabs.length > 0) ? (
          <div className="charging-choose-plan-wrapper__plans-container">
            <p className="available-plans-txt">{plansContent?.header}</p>
            <div className="plans-tab-container">
              {plansContent?.tabs?.map((tab, index) => (
                <div
                  key={index}
                  className={`tab-container ${
                    activeTab === index + 1 ? "active" : ""
                  }`}
                  onClick={() => handleTabClick(index + 1)}
                >
                  <div className="tabs-txt">
                    <div className="plan-type-container">
                      <p>{tab.planType}</p>
                    </div>
                    <div className="tabs-txt__price-container">
                      <p className="price">{tab.price}</p>
                      <p className="free">{tab.freeLabel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          " "
        )}
        {btnLabel && (
          <div className="get-plan-wrapper">
            <div
              className="get-plan-btn-container"
              data-link-position={dataPosition || "chargingLocatorChoosePlan"}
              onClick={(e) => getMyPlan(e)}
            >
              <div
                className="confirm-button"
                data-link-position={dataPosition || "chargingLocatorChoosePlan"}
              >
                {btnLabel}
              </div>
            </div>
          </div>
        )}
        {openPopup && (
          <div className="confirm__pop-up" ref={getPlanPopupRef}>
            <div className="confirm__content">
              <div
                className="confirm__header"
                dangerouslySetInnerHTML={{
                  __html: popUpObj?.popupMsg
                }}
              ></div>
              <div className="confirm__button-container">
                <a href="javascript:void(0)">
                  <button
                    className="confirm__cancel-button confirm__confirm-cancel-button"
                    data-link-position={
                      dataPosition || "chargingLocatorChoosePlan"
                    }
                    onClick={(e) => {
                      setOpenPopup(false);
                      ctaTracking(e, "ctaButtonClick");
                    }}
                  >
                    {popUpObj?.cancelButton}
                  </button>
                </a>
                <a href={popUpObj?.confirmLink}>
                  <button
                    className="confirm__confirm-button confirm__confirm-cancel-button"
                    data-link-position={
                      dataPosition || "chargingLocatorChoosePlan"
                    }
                    onClick={(e) => {
                      setOpenPopup(false);
                      ctaTracking(e, "confirmCTAClick");
                    }}
                  >
                    {popUpObj?.confirmButton}
                  </button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {(scrollImgDesktop || scrollImgMobile) && (
        <div className="limited-time-only-container">
          <div className="limited-time-only-container__img-scroll">
            <img
              src={isDesktop ? scrollImgDesktop : scrollImgMobile}
              alt="scroll-ticker-img"
            />
            <img
              src={isDesktop ? scrollImgDesktop : scrollImgMobile}
              alt="scroll-ticker-img"
            />
            <img
              src={isDesktop ? scrollImgDesktop : scrollImgMobile}
              alt="scroll-ticker-img"
            />
            <img
              src={isDesktop ? scrollImgDesktop : scrollImgMobile}
              alt="scroll-ticker-img"
            />
          </div>
        </div>
      )}

      <div className="drop-down-parent-container">
        <div className="drop-down-parent-container__container">
          <div
            className={`drop-down-parent-container__header-container ${
              dropDownClicked ? "open" : ""
            }`}
            onClick={() => {
              handleContainerClick();
            }}
          >
            <div className="dropdown-header">
              {dropDownTitle &&
                (pagePath.includes("offer") ? (
                  <h2>{dropDownTitle}</h2>
                ) : (
                  <p>{dropDownTitle}</p>
                ))}
            </div>
            <div className="dropdown-arrow">
              <a>
                <img
                  src={dropDownArrowIcon}
                  alt="drop-down-arrow"
                  aria-label="drop-down-arrow"
                  className="drop-down-arrow"
                />
              </a>
            </div>
          </div>
          {dropDownClicked && (
            <div className="drop-down-parent-container__content-container">
              <div className="content-container">
                <div
                  className="content-container__content"
                  dangerouslySetInnerHTML={{
                    __html: dropDownContent
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {location.href.indexOf("offers") > -1 &&
        chargeLabel.toLowerCase() === "charge" && (
          <hr className="offers-horizontal-divider"></hr>
        )}
    </div>
  );
};

export default ChargingLocatorChoosePlan;

ChargingLocatorChoosePlan.propTypes = {
  config: PropTypes.shape({
    titleOne: PropTypes.string,
    titleTwo: PropTypes.string,
    headerContent: PropTypes.string,
    pluginImgMobile: PropTypes.string,
    pluginImgDesktop: PropTypes.string,
    chargeLabel: PropTypes.string,
    chargeContent: PropTypes.string,
    navLink: PropTypes.string,
    btnLabel: PropTypes.string,
    plansContent: PropTypes.shape({
      header: PropTypes.string,
      tabs: PropTypes.arrayOf(
        PropTypes.shape({
          planType: PropTypes.string,
          price: PropTypes.string,
          freeLabel: PropTypes.string
        })
      )
    }),
    popUpObj: PropTypes.object,
    newTab: PropTypes.bool,
    scrollImgMobile: PropTypes.string,
    scrollImgDesktop: PropTypes.string,
    dropDownTitle: PropTypes.string,
    dropDownArrowIcon: PropTypes.string,
    dropDownContent: PropTypes.string,
    dataPosition: PropTypes.string,
    customTitleTwoTag: PropTypes.string
  })
};
