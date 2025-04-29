import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { tns } from "tiny-slider/src/tiny-slider";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import appUtils from "../../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useAllUserTestRides } from "../../../hooks/userProfile/userProfileHooks";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import { connect } from "react-redux";
import CONSTANT from "../../../../site/scripts/constant";

const BannerCarousel = (props) => {
  const {
    bannerContents,
    exploreContent,
    swipeContent,
    timeOutSeconds,
    isVariantTwo,
    dataPosition,
    variationClass
  } = props.config;
  const { allUserTestRidesData } = props;
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [sliderInstanceData, setSliderInstance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const sliderRef = useRef(null);
  let sliderInstance = null;
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const isLoggedIn = loginUtils.isSessionActive();
  const ordersUrl = appUtils.getPageUrl("ordersUrl");
  const pagePath = window.location.pathname;

  const getAllTestRides = useAllUserTestRides();
  const handlePlayToggle = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  // To handle  the index change
  const onIndexChange = (info) => {
    setCurrentIndex(info.displayIndex);
    // To add animation in tns-slide-cloned which is created
    // on gallery mode by tiny slider
    if (info.displayIndex === 1) {
      document
        .querySelector(".tns-slide-cloned .vida-home-banner-carousel-content")
        ?.classList.add("fadein-left-animation");
    } else {
      document
        .querySelector(".tns-slide-cloned .vida-home-banner-carousel-content")
        ?.classList.remove("fadein-left-animation");
    }
  };

  // To go to next slider on click
  const handleNextSlide = (sliderInstance, e) => {
    e.stopPropagation();
    if (sliderInstance) {
      sliderInstance.goTo("next");
    }
  };

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaAnalytics = (e) => {
    e.preventDefault();
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition || "bannercarousel"
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  const checkforTRApplicable = (url, isNewTab) => {
    if (allUserTestRidesData.items && allUserTestRidesData.items.length > 0) {
      const shortTestRideData = allUserTestRidesData?.items.filter(
        (item) => !item.IsLTTR
      );

      const confirmedData = shortTestRideData.filter(
        (item) => item.dmpl__Status__c === CONSTANT.TEST_RIDE_STATUS.CONFIRMED
      );

      if (confirmedData.length > 0) {
        isNewTab
          ? window.open(ordersUrl + "?" + "testride")
          : (window.location.href = ordersUrl + "?" + "testride");
      } else {
        isNewTab ? window.open(url) : (window.location.href = url);
      }
    } else {
      isNewTab ? window.open(url) : (window.location.href = url);
    }
  };

  const bannerClickHandler = (event, content) => {
    event.stopPropagation();
    ctaAnalytics(event);
    if (content.isTestRideUrl) {
      checkforTRApplicable(content.subheadinglink, content.newTab);
    } else {
      content.newTab
        ? window.open(content?.subheadinglink)
        : (window.location.href = content.subheadinglink);
    }
  };

  useEffect(async () => {
    if (bannerContents.length > 1 && sliderRef.current) {
      sliderInstance = tns({
        container: sliderRef.current,
        items: 1,
        autoplay: true,
        controls: true,
        controlsPosition: "bottom",
        controlsText: ["<", ">"],
        arrowKeys: false,
        swipeAngle: false,
        mouseDrag: true,
        autoplayTimeout: timeOutSeconds ? timeOutSeconds : 3000,
        autoplayButtonOutput: false,
        speed: 700,
        mode: "gallery",
        animateIn: "fadein-up-animation"
      });

      sliderInstance.events.on("transitionStart", onIndexChange);
      setSliderInstance(sliderInstance);

      // To add click listener in tns-slide-cloned which is created
      // on gallery mode by tiny slider
      const bannerElement = document?.querySelectorAll(".tns-slide-cloned");
      const bannerAnchorElement = document.querySelectorAll(
        ".tns-slide-cloned .vida-home-banner-carousel-link span"
      );
      const bannerButtonElement = document.querySelectorAll(
        ".tns-slide-cloned .vida-home-banner-carousel-button"
      );
      if (bannerElement) {
        bannerElement.forEach((ele) => {
          ele.addEventListener("click", (e) =>
            bannerClickHandler(e, bannerContents[0])
          );
        });
      }
      if (bannerAnchorElement) {
        bannerAnchorElement.forEach((ele) => {
          ele.addEventListener("click", (e) =>
            bannerClickHandler(e, bannerContents[0])
          );
        });
      }
      if (bannerButtonElement) {
        bannerButtonElement.forEach((ele) => {
          ele.addEventListener("click", (e) =>
            bannerClickHandler(e, bannerContents[0])
          );
        });
      }
    }
    if (isLoggedIn) {
      await getAllTestRides();
    }
  }, []);

  return (
    <div className={`vida-home-banner-carousel-container ${variationClass}`}>
      <div className="vida-home-banner-carousel" ref={sliderRef}>
        {bannerContents.map((content, index) => (
          <div
            className="vida-home-banner-carousel-content-wrapper"
            key={index}
            aria-hidden="false"
            onClick={(e) => bannerClickHandler(e, content)}
          >
            {content.assetType === "image" && (
              <div className="vida-home-banner-carousel-media">
                <img
                  src={isDesktop ? content?.imageDesktop : content?.imageMobile}
                  className={`vida-home-banner-carousel-media-content ${content.variationClass} tns-item`}
                  alt={content?.imagealttext}
                  title={content?.imageTitle}
                  loading={index === 0 ? null : "lazy"}
                />
              </div>
            )}
            {content.assetType === "video" && (
              <div className="vida-home-banner-carousel-media">
                <video
                  src={isDesktop ? content?.videoDesktop : content?.videoMobile}
                  title={content?.videoTitle}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="vida-home-banner-carousel-media-content tns-item"
                />
              </div>
            )}
            {content.assetType === "video-with-controls" && (
              <div className="vida-home-banner-carousel-media">
                <video
                  src={
                    isDesktop
                      ? content?.videoControlDesktop
                      : content?.videoControlMobile
                  }
                  title={content?.videoWithControlTitle}
                  ref={videoRef}
                  loop
                  autoPlay={isPlaying}
                  className="vida-home-banner-carousel-media-content tns-item"
                />
                <div className="play-button-container">
                  <img
                    className="play-button"
                    alt="play-icon"
                    src={
                      isPlaying
                        ? isDesktop
                          ? content?.pauseIconMob
                          : content?.pauseIconDesk
                        : isDesktop
                        ? content?.playIconMob
                        : content?.playIconDesk
                    }
                    onClick={handlePlayToggle}
                  />
                </div>
              </div>
            )}
            <div
              className={`vida-home-banner-carousel-content ${
                currentIndex === index + 1 ? "fadein-left-animation" : ""
              } ${isVariantTwo ? "variant-two-content" : ""}`}
            >
              {exploreContent?.isShowHeader && !isVariantTwo ? (
                <span
                  style={{ color: exploreContent?.labelColor }}
                  className="vida-home-banner-carousel-cta"
                >
                  <img
                    className="explore-icon"
                    src={exploreContent?.icon}
                    alt="compass-icon"
                  />
                  {exploreContent?.label}
                </span>
              ) : exploreContent?.isShowHeader &&
                !isDesktop &&
                !isVariantTwo ? (
                <span
                  style={{ color: exploreContent?.labelColor }}
                  className="vida-home-banner-carousel-cta"
                >
                  <img
                    className="explore-icon"
                    src={exploreContent?.icon}
                    alt="Love-logo"
                  />
                  {exploreContent?.label}
                </span>
              ) : (
                <></>
              )}

              {content?.heading &&
                (pagePath.includes("love") ||
                pagePath.includes("offer") ||
                pagePath.includes("faq") ? (
                  <h1
                    style={{ color: content?.headingTextColor }}
                    className={
                      isVariantTwo
                        ? `vida-home-banner-carousel-title variant-two ${content?.variationClass}`
                        : `vida-home-banner-carousel-title ${content?.variationClass}`
                    }
                    dangerouslySetInnerHTML={{
                      __html: content?.heading
                    }}
                  ></h1>
                ) : (
                  <h2
                    style={{ color: content?.headingTextColor }}
                    className={`vida-home-banner-carousel-title full-width ${content?.variationClass}`}
                    dangerouslySetInnerHTML={{
                      __html: content?.heading
                    }}
                  ></h2>
                ))}
              {content.isRedirectionButton ? (
                <button
                  onClick={(e) => {
                    bannerClickHandler(e, content);
                  }}
                  className="vida-home-banner-carousel-button"
                >
                  {content?.subheading}
                </button>
              ) : (
                <a
                  className="vida-home-banner-carousel-link"
                  href="javascript:void(0)"
                  data-link-position={dataPosition || "bannercarousel"}
                  aria-hidden="false"
                >
                  <span
                    onClick={(e) => {
                      bannerClickHandler(e, content);
                    }}
                  >
                    {content?.subheading}
                  </span>
                </a>
              )}
            </div>
            {/* Removing Swipe as per the business feedback */}
            {/* {bannerContents.length > 1 && (
              <button
                className="btn btn--icon btn--transparent"
                aria-hidden="false"
                role="button"
              >
                {swipeContent.label}
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/svg/forward-icon.svg`}
                  alt="forward-icon"
                />
              </button>
            )} */}
          </div>
        ))}
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

export default connect(mapStateToProps)(BannerCarousel);

BannerCarousel.propTypes = {
  config: PropTypes.shape({
    bannerContents: PropTypes.arrayOf(
      PropTypes.shape({
        heading: PropTypes.string,
        headingTextColor: PropTypes.string,
        subheading: PropTypes.string,
        subheadinglink: PropTypes.string,
        imageMobile: PropTypes.string,
        imagealttext: PropTypes.string,
        imageDesktop: PropTypes.string,
        videoMobile: PropTypes.string,
        videoDesktop: PropTypes.string,
        assetType: PropTypes.string,
        imageTitle: PropTypes.string,
        videoControlMobile: PropTypes.string,
        videoControlDesktop: PropTypes.string,
        playIconMob: PropTypes.string,
        playIconDesk: PropTypes.string,
        pauseIconMob: PropTypes.string,
        pauseIconDesk: PropTypes.string,
        videoTitle: PropTypes.string,
        videoWithControlTitle: PropTypes.string
      })
    ),
    exploreContent: PropTypes.shape({
      label: PropTypes.string,
      labelColor: PropTypes.string,
      icon: PropTypes.string,
      url: PropTypes.string,
      isShowHeader: PropTypes.bool
    }),
    swipeContent: PropTypes.shape({
      label: PropTypes.string
    }),
    timeOutSeconds: PropTypes.number,
    isVariantTwo: PropTypes.bool,
    dataPosition: PropTypes.string,
    variationClass: PropTypes.string
  }),
  allUserTestRidesData: PropTypes.shape({
    items: PropTypes.array
  })
};
