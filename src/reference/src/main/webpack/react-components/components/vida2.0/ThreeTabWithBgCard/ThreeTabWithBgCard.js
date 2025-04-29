import React, { useState } from "react";
import PropTypes, { any } from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const ThreeTabWithBgCard = ({ config }) => {
  const { tab1, tab2, tab3, title, isVariantOne } = config;

  //changes based on the tab switching
  const [changeBgImgMob, setChangeBgImgMob] = useState(tab1?.bgMobileImg);
  const [changeBgImgDesktop, setChangeBgImgDesktop] = useState(
    tab1?.bgDesktopImg
  );
  const [changeText, setChangeText] = useState(tab1?.description);
  const [changeCta, setChangeCta] = useState(tab1?.ctaLabel);
  const [changeCtaLink, setChangeCtaLink] = useState(tab1?.ctaLink);
  const [activeTab, setActiveTab] = useState(1);
  const [changeBgImgAlt, setChangeBgImgAlt] = useState(tab1?.imageAlt);
  const [changeBgImgTitle, setChangeBgImgTitle] = useState(tab1?.imageTitle);
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  // intersection observer
  const {
    ref: threeTabWithBgCardContainerRef,
    isVisible: threeTabWithBgCardContainerVisible
  } = useIntersectionObserver();

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const handleBgImgChange = (image) => {
    setChangeBgImgMob(image);
  };

  const handleBgImgDesktopChange = (image) => {
    setChangeBgImgDesktop(image);
  };

  const handleChangeText = (text) => {
    setChangeText(text);
  };

  const handleChangeCta = (link) => {
    setChangeCta(link);
  };
  const handleCtaLink = (text) => {
    setChangeCtaLink(text);
  };

  const handleChangeImgAlt = (text) => {
    setChangeBgImgAlt(text);
  };

  const handleChangeImgTitle = (text) => {
    setChangeBgImgTitle(text);
  };

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  return (
    <div
      className="three-tab-with-bg-card-pt-wrapper"
      ref={threeTabWithBgCardContainerRef}
      style={{ opacity: threeTabWithBgCardContainerVisible ? 1 : 0 }}
    >
      <div
        style={{
          backgroundImage: `url(${
            isDesktop ? changeBgImgDesktop : changeBgImgMob
          })`
        }}
        className={
          isVariantOne
            ? "three-tab-with-bgcard"
            : "three-tab-with-bgcard variant-two"
        }
        role="img"
        aria-label={changeBgImgAlt}
        title={changeBgImgTitle}
      >
        <div className="info-details-container">
          <div className="info-details-header">
            <p>{title}</p>
          </div>
          <div className="info-details-nav-container">
            <div className="info-details-nav">
              <a
                className={`info-details-nav ${
                  activeTab === 1 ? "type-one-active" : ""
                }`}
                onClick={() => {
                  handleTabClick(1);
                  handleBgImgChange(tab1?.bgMobileImg);
                  handleBgImgDesktopChange(tab1?.bgDesktopImg);
                  handleChangeText(tab1?.description);
                  handleChangeCta(tab1?.ctaLabel);
                  handleCtaLink(tab1?.ctaLink);
                  handleChangeImgAlt(tab1?.imageAlt);
                  handleChangeImgTitle(tab1?.imageTitle);
                }}
              >
                <p className="tabs">{tab1?.tabName}</p>
              </a>

              <a
                className={`info-details-nav ${
                  activeTab === 2 ? "type-two-active" : ""
                }`}
                onClick={() => {
                  handleTabClick(2);
                  handleBgImgChange(tab2?.bgMobileImg);
                  handleBgImgDesktopChange(tab2?.bgDesktopImg);
                  handleChangeText(tab2?.description);
                  handleChangeCta(tab2?.ctaLabel);
                  handleCtaLink(tab2?.ctaLink);
                  handleChangeImgAlt(tab2?.imageAlt);
                  handleChangeImgTitle(tab2?.imageTitle);
                }}
              >
                <p className="tabs">{tab2?.tabName}</p>
              </a>

              <a
                className={`info-details-nav ${
                  activeTab === 3 ? "type-three-active" : ""
                }`}
                onClick={() => {
                  handleTabClick(3);
                  handleBgImgChange(tab3?.bgMobileImg);
                  handleBgImgDesktopChange(tab3?.bgDesktopImg);
                  handleChangeText(tab3?.description);
                  handleChangeCta(tab3?.ctaLabel);
                  handleCtaLink(tab3?.ctaLink);
                  handleChangeImgAlt(tab3?.imageAlt);
                  handleChangeImgTitle(tab3?.imageTitle);
                }}
              >
                <p className="tabs">{tab3?.tabName}</p>
              </a>
            </div>
            <p className="orange-bottom-line"></p>
          </div>
          <div className="info-details-extra-details">
            <div>
              <p
                dangerouslySetInnerHTML={{
                  __html: changeText
                }}
              ></p>
            </div>
            <div>
              <a
                href={changeCtaLink}
                data-link-position={config.dataPosition || "threeTabWithBgCard"}
                onClick={(e) => ctaTracking(e)}
              >
                <p
                  className="know-more-text"
                  data-link-position={
                    config.dataPosition || "threeTabWithBgCard"
                  }
                >
                  {changeCta}
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeTabWithBgCard;

ThreeTabWithBgCard.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    tab1: PropTypes.arrayOf(PropTypes.any),
    tab2: PropTypes.arrayOf(PropTypes.any),
    tab3: PropTypes.arrayOf(PropTypes.any),
    title: PropTypes.string,
    ctaLabel: PropTypes.string,
    isVariantOne: PropTypes.bool
  })
};
