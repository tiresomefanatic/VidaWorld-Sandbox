import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import DealersInfoCard from "../DealersInfoCard/DealersInfoCard";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const DealersInfoTab = ({
  config,
  dealerDetails,
  cityName,
  directionData,
  activeTabIndex
}) => {
  const [isActiveIndex, setIsActiveIndex] = useState(0);
  const [dealerCardInfo, setDealerCardInfo] = useState();
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  // intersection observer
  const {
    ref: dealerInfoTabContainerRef,
    isVisible: dealerInfoTabContainerVisible
  } = useIntersectionObserver();

  const handlePassCardData = (index) => {
    let dealerInfoDetails;
    if (index === 0) {
      dealerInfoDetails = dealerDetails?.filter(
        (item) => item?.branchTypeCategory === "Experience Center"
      );
      setDealerCardInfo(dealerInfoDetails);
    } else if (index === 1) {
      dealerInfoDetails = dealerDetails?.filter(
        (item) => item?.branchTypeCategory === "Authorised Dealers"
      );
      setDealerCardInfo(dealerInfoDetails);
    } else if (index === 2) {
      dealerInfoDetails = dealerDetails?.filter(
        (item) => item?.type === "ServiceBranch"
      );
      setDealerCardInfo(dealerInfoDetails);
    }
  };

  const handleTabSwitch = (index) => {
    setIsActiveIndex(index);
    handlePassCardData(index);
  };

  useEffect(() => {
    handlePassCardData(isActiveIndex);
  }, [dealerDetails]);

  useEffect(() => {
    if (activeTabIndex !== undefined) {
      setIsActiveIndex(activeTabIndex);
      handlePassCardData(activeTabIndex);
      const scrollToId = `dealers-info-tab${activeTabIndex}`;
      document.getElementById(scrollToId).scrollIntoView();
    }
  }, [activeTabIndex]);

  return (
    <div
      className="dealers-info-wrapper vida-2-container"
      ref={dealerInfoTabContainerRef}
      style={{ opacity: dealerInfoTabContainerVisible ? 1 : 0 }}
    >
      <div className="dealers-info-container">
        <p className="dealers-info-text">
          {config?.dealersInfoTabText} {cityName} !
        </p>
        <p className="dealers-info-title">{config?.dealersInfoTabTitle}</p>
        <div className="dealers-info-content-container">
          <div className="dealers-info-tab-container">
            {config?.dealersInfoTabContent?.map((item, index) => (
              <div
                className={
                  isActiveIndex === index
                    ? "dealers-info-tab active-tab"
                    : "dealers-info-tab"
                }
                key={index}
                onClick={() => handleTabSwitch(index)}
                id={`dealers-info-tab${index}`}
              >
                <h2>
                  {item?.tabTitle}{" "}
                  <span className="dealers-info-count">{`(${dealerCardInfo?.length})`}</span>
                </h2>
              </div>
            ))}
          </div>
          <div className="dealers-info-tab-content-container">
            <div className="dealers-info-tab-content-title">
              <p>
                {`${config?.dealersInfoTabContent[isActiveIndex]?.tabContentTitle} (${dealerCardInfo?.length})`}
              </p>
            </div>
            <div className="dealers-info-tab-content-description">
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    config?.dealersInfoTabContent[isActiveIndex]
                      ?.tabContentDescription
                }}
              ></p>
            </div>
            <div className="dealers-info-tab-card-container">
              <DealersInfoCard
                dealersInfoCardConfig={config?.dealersInfoCardConfig}
                dealerCardInfo={dealerCardInfo}
                getDirectionHandler={directionData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealersInfoTab;

DealersInfoTab.propTypes = {
  config: PropTypes.object,
  dealerDetails: PropTypes.any,
  cityName: PropTypes.any,
  directionData: PropTypes.any,
  activeTabIndex: PropTypes.number
};
