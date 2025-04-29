import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import ReDirectionCards from "../ReDirectionCards/ReDirectionCards";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const CommunityChargingCard = ({
  config,
  chargingLocationCityList,
  selectedCityHandler,
  userCityData
}) => {
  const [showOption, setShowOption] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sortedOptions, setSortedOptions] = useState();
  const [searchValue, setSearchValue] = useState("");
  const isLoggedIn = loginUtils.isSessionActive();
  const cityInputField = document.getElementsByClassName(
    "fast-charging-city-search-input"
  )[0];
  const [availableCityCount, setAvailableCityCount] = useState(0);
  const {
    dataPosition,
    isVideo,
    videoContent,
    redirectionCard,
    includeRedirectionCard,
    preTitle,
    mobileImage,
    titleTag2,
    chargingInformation,
    ctaText,
    description,
    title2,
    titleTag,
    title,
    titleTag3,
    description2,
    imageAlt,
    URL,
    newTab,
    desktopImage,
    cityConfig,
    imageTitle,
    descPositionDesktop,
    includeChargingStationBanner,
    includeCitySearch,
    chargingStationBanner,
    ctaLabel,
    showCta,
    ctaUrl
  } = config;

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  // intersection observer
  const {
    ref: communityChargingCardContainerRef,
    isVisible: communityChargingCardContainerVisible
  } = useIntersectionObserver();

  const CustomTitleTag = titleTag || "p";
  const CustomTitle2Tag = titleTag2 || titleTag3 || "p";

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.alt || e?.target?.innerText,
        ctaLocation:
          e?.target?.dataset?.linkPosition ||
          e?.target?.closest("a")?.dataset?.linkPosition,
        ctaLink:
          e?.target?.href || e?.target?.closest("a")?.getAttribute("href")
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  // Sort chargingInformation based on the 'order' property
  const sortedChargingInformation = chargingInformation?.sort(
    (a, b) => parseInt(a.order) - parseInt(b.order)
  );

  const communityChargingVariation =
    (includeRedirectionCard &&
      "charging-locator-page-redirection-card-variation") ||
    (isVideo && "dealership-page-variation") ||
    (includeCitySearch && "charging-locator-page-header-variation") ||
    "";

  const handleSortOptions = () => {
    const filterBySearch = chargingLocationCityList
      ?.filter((item) => {
        if (item?.cityName.toUpperCase().includes(searchValue.toUpperCase())) {
          return item;
        }
      })
      .sort((a, b) => (a?.cityName > b?.cityName ? 1 : -1));
    setSortedOptions(filterBySearch);
  };

  const handleOnFocus = () => {
    setShowOption(true);
    handleSortOptions();
  };

  const handleOnBlur = () => {
    setTimeout(() => {
      setShowOption(false);
    }, 250);
  };

  const handleOnKeyUp = () => {
    handleSortOptions();
  };

  const handleDropDownClick = () => {
    setShowOption(!showOption);
    handleSortOptions();
  };

  const handleOptionSelect = (value) => {
    cityInputField.value = value;
    const availableCities = chargingLocationCityList?.filter(
      (item) =>
        item?.cityName?.toLowerCase().trim() ===
        `${value?.toLowerCase().trim()}`
    );
    if (availableCities?.length > 0) {
      const availableCityStation = availableCities[0]?.chargingStations;
      const availableAtherStaion = availableCities[0]?.atherChargingStations;
      if (availableCityStation.length > 0 || availableAtherStaion.length > 0) {
        setErrorMsg("");
        selectedCityHandler && selectedCityHandler(value);
      } else {
        setErrorMsg(cityConfig?.chargingStationNotAvailable);
      }
      setAvailableCityCount(
        availableAtherStaion.length > 0
          ? availableCityStation.length + availableAtherStaion.length
          : availableCityStation.length
      );
    } else {
      setErrorMsg(cityConfig?.chargingStationNotAvailable);
    }
    handleOnBlur();
  };

  useEffect(() => {
    if (isLoggedIn && userCityData) {
      handleOptionSelect(userCityData);
    } else {
      if (chargingLocationCityList) {
        setAvailableCityCount(
          chargingLocationCityList[0]?.atherChargingStations.length > 0
            ? chargingLocationCityList[0]?.atherChargingStations.length +
                chargingLocationCityList[0]?.chargingStations.length
            : chargingLocationCityList[0]?.chargingStations.length
        );
        cityInputField.value = chargingLocationCityList[0]?.cityName;
      }
    }
  }, [chargingLocationCityList, userCityData]);

  const charingLocatorCta = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: "Home Page"
      };

      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  return (
    <div
      className={`community-charging-card-parent-container ${communityChargingVariation}`}
      ref={communityChargingCardContainerRef}
      style={{ opacity: communityChargingCardContainerVisible ? 1 : 0 }}
    >
      {isVideo && (
        <div className="video-content-wrapper">
          {videoContent?.videoMobileImg && videoContent?.videoDesktopImg && (
            <div className="video-content-wrapper__image">
              <img
                src={
                  isDesktop
                    ? videoContent?.videoDesktopImg
                    : videoContent?.videoMobileImg
                }
                alt=""
                title=""
                loading="lazy"
              ></img>
            </div>
          )}

          {videoContent?.video && (
            <div className="video-content-wrapper__video">
              <video
                muted
                loop
                autoPlay
                playsInline
                src={videoContent?.video}
              ></video>
              <img src={videoContent?.playButton} alt="" title=""></img>
            </div>
          )}

          {videoContent?.ytLink && (
            <div className="video-content-wrapper__ytvideo">
              <iframe
                src={videoContent?.ytLink}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}

      <div className="community-charging-card-parent-container__header-container">
        {preTitle !== " " && (
          <CustomTitle2Tag className="pre-title">{preTitle}</CustomTitle2Tag>
        )}
        <CustomTitleTag className="title">{title}</CustomTitleTag>
      </div>
      {desktopImage && (
        <div className="img-container">
          <img
            title={imageTitle}
            src={isDesktop ? desktopImage : mobileImage}
            alt={imageAlt}
            loading="lazy"
          />
        </div>
      )}
      <div className="charging-stations-statistics-container">
        {sortedChargingInformation?.map((content, index) => (
          <div
            key={index}
            className="charging-stations-statistics-container__details-container"
          >
            {content?.icon && (
              <div className="icon-container">
                <img src={content?.icon} alt="icon-img" />
              </div>
            )}
            <div className="content-container">
              <p className="label-text">{content?.labeltext}</p>
              <p className="label-value">{content?.labelvalue}</p>
            </div>
          </div>
        ))}
      </div>
      {description && (
        <div className={`description-container-${descPositionDesktop}`}>
          <div
            dangerouslySetInnerHTML={{
              __html: description
            }}
          ></div>
        </div>
      )}

      {showCta && (
        <div className="charging-locator-cta-container">
          <a
            className="charging-locator-cta"
            href={ctaUrl}
            onClick={charingLocatorCta}
          >
            {ctaLabel}
          </a>
        </div>
      )}

      {(title2 || description2 || ctaText) && (
        <div className="description-two-container">
          {title2 && (
            <div className="description-two-title-container">
              <CustomTitle2Tag className="description-two-title">
                {title2}
              </CustomTitle2Tag>
            </div>
          )}
          {description2 && (
            <div>
              <div
                className="description-two-wrapper"
                dangerouslySetInnerHTML={{
                  __html: description2
                }}
              ></div>
            </div>
          )}
          {ctaText && (
            <a
              className="cta-link"
              target={newTab ? "_blank" : "_self"}
              href={URL}
              rel="noreferrer"
              data-link-position={dataPosition || "communityChargingCard"}
              onClick={(e) => ctaTracking(e)}
            >
              <p className="cta-text">{ctaText}</p>
            </a>
          )}
        </div>
      )}

      {includeChargingStationBanner && (
        <div
          className={`charging-stations-banner-container-${chargingStationBanner?.chargingStationBannerDesktopPosition}`}
        >
          <div
            className={`charging-stations-banner-container-${chargingStationBanner?.chargingStationBannerDesktopPosition}__wrapper`}
          >
            <div className="emoji-container">
              <img
                src={chargingStationBanner?.emojiImg}
                alt={chargingStationBanner?.emojiImgAlt}
                loading="lazy"
              />
            </div>
            <div className="stations-accordian-container">
              <div className="stations-accordian-container__header-container">
                <CustomTitleTag className="stations-container-text">
                  {chargingStationBanner?.bannerTitle}
                </CustomTitleTag>
              </div>

              <div className="stations-accordian-container__icon-container">
                <img
                  src={chargingStationBanner?.plusIcon}
                  alt={chargingStationBanner?.plusIconAlt}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {includeCitySearch && (
        <div className="fast-charging-search-container">
          <div className="fast-charging-search-find-icon">
            <img
              src={cityConfig?.searchIcon}
              alt={cityConfig?.searchIconAlt}
            ></img>
          </div>
          <div
            className={
              showOption
                ? "fast-charging-chevron-down-icon rotate-180"
                : "fast-charging-chevron-down-icon"
            }
            onClick={handleDropDownClick}
          >
            <img
              src={cityConfig?.dropDownIcon}
              alt={cityConfig?.dropDownIconAlt}
            />
          </div>
          <input
            className="fast-charging-city-search-input"
            placeholder={cityConfig?.searchCityText}
            type="text"
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onKeyUp={handleOnKeyUp}
            onChange={(e) => setSearchValue(e.target.value)}
          ></input>
          <div
            className={
              showOption
                ? "city-option-container d-block"
                : "city-option-container d-none"
            }
          >
            {sortedOptions?.map((item, index) => (
              <div
                className="city-option"
                key={index}
                onClick={() => handleOptionSelect(item?.cityName)}
              >
                <p>{item?.cityName}</p>
              </div>
            ))}
          </div>
          <p className="fast-charging-error-msg">{errorMsg}</p>
          {!errorMsg && (
            <p className="label-count">
              {cityConfig?.chargingCountLabel} <b>{availableCityCount}</b>
            </p>
          )}
        </div>
      )}
      {includeRedirectionCard && (
        <div className="redirection-card-container">
          <ReDirectionCards config={redirectionCard} />
        </div>
      )}
    </div>
  );
};

export default CommunityChargingCard;

CommunityChargingCard.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    redirectionCard: PropTypes.shape(),
    isVideo: PropTypes.bool,
    videoContent: PropTypes.shape({
      videoMobileImg: PropTypes.string,
      videoDesktopImg: PropTypes.string,
      ytLink: PropTypes.string,
      video: PropTypes.string,
      playButton: PropTypes.string
    }),
    preTitle: PropTypes.string,
    mobileImage: PropTypes.string,
    titleTag2: PropTypes.string,
    titleTag3: PropTypes.string,
    includeCitySearch: PropTypes.bool,
    chargingInformation: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        order: PropTypes.string,
        labeltext: PropTypes.string,
        labelvalue: PropTypes.string
      })
    ),
    cityConfig: PropTypes.shape({
      searchCityText: PropTypes.string,
      searchIcon: PropTypes.string,
      dropDownIcon: PropTypes.string,
      searchIconAlt: PropTypes.string,
      dropDownIconAlt: PropTypes.string,
      chargingStationNotAvailable: PropTypes.string,
      chargingCountLabel: PropTypes.string
    }),
    ctaText: PropTypes.string,
    description: PropTypes.string,
    title2: PropTypes.string,
    titleTag: PropTypes.string,
    title: PropTypes.string,
    description2: PropTypes.string,
    imageAlt: PropTypes.string,
    URL: PropTypes.string,
    newTab: PropTypes.bool,
    desktopImage: PropTypes.string,
    imageTitle: PropTypes.string,
    descPositionDesktop: PropTypes.string,
    includeChargingStationBanner: PropTypes.bool,
    includeRedirectionCard: PropTypes.bool,
    chargingStationBanner: PropTypes.shape({
      plusIcon: PropTypes.string,
      plusIconAlt: PropTypes.string,
      emojiImg: PropTypes.string,
      emojiImgAlt: PropTypes.string,
      bannerTitle: PropTypes.string,
      chargingStationBannerDesktopPosition: PropTypes.string
    }),
    ctaLabel: PropTypes.string,
    showCta: PropTypes.string,
    ctaUrl: PropTypes.string
  }),
  chargingLocationCityList: PropTypes.arrayOf(PropTypes.any),
  selectedCityHandler: PropTypes.func,
  userCityData: PropTypes.string
};
