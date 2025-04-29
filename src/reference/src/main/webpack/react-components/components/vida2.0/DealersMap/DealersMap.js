import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MapMyIndia from "../MapMyIndia/MapMyIndia";

const DealersMap = ({
  config,
  dealerDetails,
  isCityPage,
  selectedDealer,
  goToDealersSection,
  cityNameAvailable
}) => {
  const [isSelectedDealer, setIsSelectedDealer] = useState(false);
  const [selectedDealerData, setSelectedDealerData] = useState();

  useEffect(() => {
    if (selectedDealer?.latitude) {
      setIsSelectedDealer(true);
      setSelectedDealerData(selectedDealer);
    }
  }, [selectedDealer]);
  return (
    <div className="dealers-map-wrapper">
      <div className="dealers-map-primary-text">
        <p>
          {config?.dealersMapPrimaryText}{" "}
          <span className="bold-text">
            {
              dealerDetails?.filter(
                (item) =>
                  item?.branchTypeCategory === "Experience Center" ||
                  item?.branchTypeCategory === "Authorised Dealers" ||
                  item?.type === "ServiceBranch"
              ).length
            }
          </span>{" "}
          {config?.dealersMapSecondaryText}
        </p>
      </div>
      <div className="dealers-map-content-container">
        <div className="dealers-map-container map-container">
          {dealerDetails && (
            <MapMyIndia
              dealerDetails={dealerDetails}
              isShowDirection={isSelectedDealer}
              isCityPage={isCityPage}
              isTestRidePage={false}
              selectedDealer={selectedDealerData}
              isRenderMap={cityNameAvailable}
              isDealerMapReady={cityNameAvailable}
              userMapId={"dealersMap"}
              setSelectedDealer={setSelectedDealerData}
            />
          )}
        </div>
        <div className="dealers-map-location-info-container">
          <div className="dealers-map-location-info-list">
            {config?.dealersMapLocationInfo.map((item, index) => {
              let dealersCount;
              if (index === 0) {
                dealersCount = dealerDetails?.filter(
                  (item) => item?.branchTypeCategory === "Experience Center"
                ).length;
              } else if (index === 1) {
                dealersCount = dealerDetails?.filter(
                  (item) => item?.branchTypeCategory === "Authorised Dealers"
                ).length;
              } else if (index === 2) {
                dealersCount = dealerDetails?.filter(
                  (item) => item?.type === "ServiceBranch"
                ).length;
              }
              return (
                <div
                  className="dealers-map-location-info-item"
                  key={index}
                  onClick={() => goToDealersSection(index)}
                >
                  <div className="dealers-map-location-info-flex-container">
                    <div className="dealers-map-location-info-icon">
                      <img
                        src={item.locationInfoFirstIcon}
                        alt="location_info_icon"
                      ></img>
                    </div>
                    <div className="dealers-map-location-info-title">
                      <p>
                        {item.locationInfoTitle}{" "}
                        <span className="dealer-number">{`(${dealersCount})`}</span>
                      </p>
                    </div>
                  </div>
                  <div className="dealers-map-location-info-tick-icon">
                    <img
                      src={item.locationInfoSecondIcon}
                      alt="location_info_tick_icon"
                    ></img>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealersMap;

DealersMap.propTypes = {
  config: PropTypes.object,
  dealerDetails: PropTypes.any,
  isCityPage: PropTypes.bool,
  selectedDealer: PropTypes.any,
  goToDealersSection: PropTypes.func,
  cityNameAvailable: PropTypes.bool
};
