import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../site/scripts/utils/appUtils";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const DealersInfoCard = ({
  dealersInfoCardConfig,
  dealerCardInfo,
  getDirectionHandler
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [dealersCount, setDealersCount] = useState(dealerCardInfo?.length);
  const [defaultItems, setDefaultItems] = useState(2);
  const [isShowMoreItems, setIsShowMoreItems] = useState(false);

  const handleToggleCard = (index, value) => {
    if (initialLoad) {
      setIsOpened(true);
      setInitialLoad(false);
    }
    setActiveIndex(index);
  };

  const loadMoreItems = () => {
    setIsShowMoreItems(!isShowMoreItems);
  };

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const handleGetDirection = (item) => {
    const scrollElement = document.querySelector(".dealers-map-wrapper");
    if (scrollElement instanceof HTMLElement) {
      scrollElement.scrollIntoView({ behavior: "smooth" });
    }
    getDirectionHandler && getDirectionHandler(item);
  };

  useEffect(() => {
    setInitialLoad(true);
    setActiveIndex();
    setIsShowMoreItems(false);
  }, [dealerCardInfo]);

  return (
    <div className="dealers-info-card-wrapper">
      {dealerCardInfo
        ?.slice(0, isShowMoreItems ? dealersCount : defaultItems)
        ?.map((item, index) => (
          <>
            {activeIndex !== index && (
              <div className="dealers-info-card-container">
                <div className="dealers-info-card-header-container preview-card">
                  <div className="dealers-info-card-header-flex-container">
                    <div className="dealers-info-card-title">
                      <p>{item?.experienceCenterName}</p>
                    </div>
                    {(dealersInfoCardConfig?.cardClosedDesktopImg ||
                      dealersInfoCardConfig?.cardClosedMobileImg) && (
                      <div className="dealers-info-card-preview-img">
                        <img
                          src={
                            isDesktop
                              ? dealersInfoCardConfig?.cardClosedDesktopImg
                              : dealersInfoCardConfig?.cardClosedMobileImg
                          }
                          alt={dealersInfoCardConfig?.cardClosedImgAlt}
                          title={dealersInfoCardConfig?.cardClosedImgTitle}
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className={
                      isDesktop
                        ? "chevron-down-icon d-block"
                        : "chevron-down-icon d-block"
                    }
                    onClick={() => handleToggleCard(index, true)}
                  >
                    <img
                      src={`${appUtils.getConfig(
                        "resourcePath"
                      )}images/png/chevron_down.png`}
                      alt="chevron_down_icon"
                    ></img>
                  </div>
                </div>
              </div>
            )}
            {isOpened && activeIndex === index && (
              <div
                className={"dealers-info-card-container card-opened"}
                key={index}
              >
                <div className="dealers-info-card-header-container">
                  <div className="dealers-info-card-header-flex-container">
                    <div className="dealers-info-card-desktop-flex-container">
                      <div className="dealers-info-card-title">
                        <p>{item?.experienceCenterName}</p>
                      </div>
                      <div
                        className={
                          isDesktop
                            ? activeIndex === index
                              ? "dealers-info-card-content-container d-block"
                              : "dealers-info-card-content-container d-none"
                            : "dealers-info-card-content-container d-none"
                        }
                      >
                        <div className="dealers-info-card-details-container">
                          {item?.address && (
                            <div className="dealers-info-card-address-container">
                              <div className="dealers-info-card-address-text">
                                <p>{dealersInfoCardConfig?.addressText}</p>
                              </div>
                              <div className="dealers-info-card-address-info">
                                <p>{item?.address}</p>
                              </div>
                            </div>
                          )}
                          <div className="dealers-info-card-flex-container-1">
                            <div className="dealer-info-card-number-container">
                              <img
                                className="mobile-icon"
                                src={dealersInfoCardConfig?.mobileIcon}
                                alt={dealersInfoCardConfig?.mobileIconAltText}
                                title={dealersInfoCardConfig?.mobileIconTitle}
                              ></img>
                              <a
                                href={`tel:${
                                  item?.phonenumber ||
                                  dealersInfoCardConfig.defaultPhoneNumber
                                }`}
                                className="mobile-number"
                              >
                                {item?.phonenumber ||
                                  dealersInfoCardConfig.defaultPhoneNumber}
                              </a>
                            </div>
                            {dealersInfoCardConfig?.websiteUrl && (
                              <div className="dealer-info-card-website-container">
                                <img
                                  className="msg-icon"
                                  src={dealersInfoCardConfig?.messageIcon}
                                  alt={
                                    dealersInfoCardConfig?.messageIconAltText
                                  }
                                  title={
                                    dealersInfoCardConfig?.messageIconTitle
                                  }
                                ></img>
                                <a
                                  href={
                                    dealersInfoCardConfig?.websiteUrl
                                      ? `mailto:${
                                          item?.email ||
                                          dealersInfoCardConfig?.websiteUrl
                                        }`
                                      : "javascript:void(0)"
                                  }
                                  className="website-url"
                                >
                                  {item?.email ||
                                    dealersInfoCardConfig?.websiteUrl}
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="dealers-info-card-flex-container-2">
                            {dealersInfoCardConfig?.timeSlot && (
                              <div className="dealer-info-card-time-slot-container">
                                <img
                                  className="clock-icon"
                                  src={dealersInfoCardConfig?.clockIcon}
                                  alt={dealersInfoCardConfig?.clockIconAltText}
                                  title={dealersInfoCardConfig?.clockIconTitle}
                                ></img>
                                <p className="time-slot">
                                  {dealersInfoCardConfig?.timeSlot}
                                </p>
                              </div>
                            )}
                            {dealersInfoCardConfig?.daySlot && (
                              <div className="dealer-info-card-day-slot-container">
                                <img
                                  className="calendar-icon"
                                  src={dealersInfoCardConfig?.calendarIcon}
                                  alt={
                                    dealersInfoCardConfig?.calendarIconAltText
                                  }
                                  title={
                                    dealersInfoCardConfig?.calendarIconTitle
                                  }
                                ></img>
                                <p className="day-slot">
                                  {dealersInfoCardConfig?.daySlot}
                                </p>
                              </div>
                            )}
                          </div>
                          {dealersInfoCardConfig?.getDirectionsText && (
                            <div
                              className="dealers-info-card-get-direction"
                              onClick={() => handleGetDirection(item)}
                            >
                              <a className="get-direction-link">
                                {dealersInfoCardConfig?.getDirectionsText}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {(dealersInfoCardConfig.cardOpenedDesktopImg ||
                      dealersInfoCardConfig?.cardOpenedMobileImg) && (
                      <div className="dealers-info-card-header-img">
                        <img
                          src={
                            isDesktop
                              ? dealersInfoCardConfig?.cardOpenedDesktopImg
                              : dealersInfoCardConfig?.cardOpenedMobileImg
                          }
                          alt={dealersInfoCardConfig?.cardOpenedImgAlt} // dealers_info_card_img"
                          title={dealersInfoCardConfig?.cardOpenedImgTitle}
                        ></img>
                      </div>
                    )}
                  </div>
                  {/* <div
                    className={
                      isDesktop
                        ? activeIndex === index
                          ? "chevron-down-icon rotate-180-degree d-block"
                          : "chevron-down-icon d-block"
                        : "chevron-down-icon d-none"
                    }
                    onClick={() => handleToggleCard(index, true)}
                  >
                    <img
                      src={`${appUtils.getConfig(
                        "resourcePath"
                      )}images/png/chevron_down.png`}
                      alt="chevron_down_icon"
                    ></img>
                  </div> */}
                </div>
                <div
                  className={
                    isDesktop
                      ? activeIndex === index
                        ? "dealers-info-card-content-container d-none"
                        : "dealers-info-card-content-container d-block"
                      : "dealers-info-card-content-container d-block"
                  }
                >
                  <div className="dealers-info-card-details-container">
                    {item?.address && (
                      <div className="dealers-info-card-address-container">
                        <div className="dealers-info-card-address-text">
                          <p>{dealersInfoCardConfig?.addressText}</p>
                        </div>
                        <div className="dealers-info-card-address-info">
                          <p>{item?.address}</p>
                        </div>
                      </div>
                    )}
                    <div className="dealers-info-card-flex-container-1">
                      <div className="dealer-info-card-number-container">
                        <img
                          className="mobile-icon"
                          src={dealersInfoCardConfig?.mobileIcon}
                          alt="mobile_icon"
                        ></img>
                        <a
                          href={`tel:${
                            item?.phonenumber ||
                            dealersInfoCardConfig.defaultPhoneNumber
                          }`}
                          className="mobile-number"
                        >
                          {item?.phonenumber ||
                            dealersInfoCardConfig.defaultPhoneNumber}
                        </a>
                      </div>
                      {dealersInfoCardConfig?.websiteUrl && (
                        <div className="dealer-info-card-website-container">
                          <img
                            className="msg-icon"
                            src={dealersInfoCardConfig?.messageIcon}
                            alt="msg_icon"
                          ></img>
                          <a
                            href={
                              dealersInfoCardConfig?.websiteUrl
                                ? `mailto:${
                                    item?.email ||
                                    dealersInfoCardConfig?.websiteUrl
                                  }`
                                : "javascript:void(0)"
                            }
                            className="website-url"
                          >
                            {item?.email || dealersInfoCardConfig?.websiteUrl}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="dealers-info-card-flex-container-2">
                      {dealersInfoCardConfig?.timeSlot && (
                        <div className="dealer-info-card-time-slot-container">
                          <img
                            className="clock-icon"
                            src={dealersInfoCardConfig?.clockIcon}
                            alt="clock_icon"
                          ></img>
                          <p className="time-slot">
                            {dealersInfoCardConfig?.timeSlot}
                          </p>
                        </div>
                      )}
                      {dealersInfoCardConfig?.daySlot && (
                        <div className="dealer-info-card-day-slot-container">
                          <img
                            className="calendar-icon"
                            src={dealersInfoCardConfig?.calendarIcon}
                            alt="calendar_icon"
                          ></img>
                          <p className="day-slot">
                            {dealersInfoCardConfig?.daySlot}
                          </p>
                        </div>
                      )}
                    </div>
                    {dealersInfoCardConfig?.getDirectionsText && (
                      <div
                        className="dealers-info-card-get-direction"
                        onClick={() => handleGetDirection(item)}
                      >
                        <a className="get-direction-link">
                          {dealersInfoCardConfig?.getDirectionsText}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                {/* <div className="chevron-down-icon-container">
                  <div
                    className={
                      isDesktop
                        ? "chevron-down-icon d-none"
                        : activeIndex === index
                        ? "chevron-down-icon rotate-180-degree d-block"
                        : "chevron-down-icon d-none"
                    }
                    onClick={() => handleToggleCard(index, false)}
                  >
                    <img
                      src={`${appUtils.getConfig(
                        "resourcePath"
                      )}images/png/chevron_down.png`}
                      alt="chevron_down_icon"
                    ></img>
                  </div>
                </div> */}
              </div>
            )}
          </>
        ))}
      {dealerCardInfo?.length > 2 && (
        <div className="load-more-btn-wrapper">
          <p className="load-more-btn" onClick={loadMoreItems}>
            {isShowMoreItems
              ? dealersInfoCardConfig?.loadLessText
              : dealersInfoCardConfig?.loadMoreText}
          </p>
        </div>
      )}
    </div>
  );
};

export default DealersInfoCard;

DealersInfoCard.propTypes = {
  dealersInfoCardConfig: PropTypes.object,
  dealerCardInfo: PropTypes.any,
  getDirectionHandler: PropTypes.func
};
