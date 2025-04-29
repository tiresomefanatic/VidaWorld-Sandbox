import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Logger from "../../../../services/logger.service";
import GoogleMaps from "../GoogleMaps/GoogleMaps";
import appUtils from "../../../../site/scripts/utils/appUtils";
import MapMyIndia from "../MapMyIndia/MapMyIndia";
import { shuffleArray } from "../../../services/commonServices/commonServices";

const DealersTab = ({
  tabList,
  defaultOpenIndex = 0,
  listOfDealers,
  getDealersDetail,
  dealersLoading,
  selectedDealerDetails,
  isReschedule,
  selectedDealersId,
  config
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultOpenIndex);
  const [isSlectedDealerIndex, setSlectedDealerIndex] = useState(0);
  const [selectedDealerID, setSelectedDealerID] = useState("");
  const [isSelectedDealer, setSelectedDealer] = useState();
  const [isDealerChanged, setDealerChanged] = useState(false);
  const [isMapUpdate, setMapUpdate] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mapData, setMapData] = useState(null);
  tabList = JSON.parse(tabList);
  const [defaultListOfDealers, setShuffleArray] = useState([]);
  const isHandleTabSwitch = (index) => {
    setActiveIndex(index);
    setMapUpdate(true);
  };
  useEffect(() => {
    if (isReschedule) {
      setActiveIndex(defaultOpenIndex);
    }
  }, [isReschedule]);

  // while clicking on dealers to store the selected one
  const handleDealerClick = (dealer, index) => {
    getDealersDetail(dealer);
    setSelectedDealer(dealer);
    setSelectedDealerID(dealer.id);
    setDealerChanged(true);
    setMapUpdate(false);
    setSlectedDealerIndex(index === isSlectedDealerIndex ? -1 : index);
  };
  // to view the next dealer
  const isRightClick = (x) => {
    defaultListOfDealers.map((item, index) => {
      if (x.id == item.id) {
        return setSelectedDealer(defaultListOfDealers[index + 1]);
      }
    });
  };

  // to view the previous dealer
  const isLeftClick = (x) => {
    defaultListOfDealers.map((item, index) => {
      if (x.id == item.id) {
        return setSelectedDealer(defaultListOfDealers[index - 1]);
      }
    });
  };

  // for randomization of dealers list
  useEffect(() => {
    if (listOfDealers) {
      setShuffleArray(shuffleArray(listOfDealers));
      setMapUpdate(false);
    }
  }, [listOfDealers]);
  // on initial to select the first dealer as selected default
  useEffect(() => {
    if (isReschedule && !isDealerChanged) {
      const selectedDealerIndex = defaultListOfDealers?.findIndex(
        (item) => item.id === selectedDealersId
      );
      const selectedDealerinfo = defaultListOfDealers?.filter((item) => {
        if (item?.id === selectedDealersId) {
          return item;
        }
      });
      getDealersDetail(selectedDealerinfo[0]);
      setSelectedDealer(selectedDealerinfo[0]);
      setSlectedDealerIndex(selectedDealerIndex);
    } else if (selectedDealerDetails?.id) {
      getDealersDetail(selectedDealerDetails);
      setSelectedDealer(selectedDealerDetails);
      const selectedDealerIndex = defaultListOfDealers?.findIndex(
        (item) => item.id === selectedDealerDetails.id
      );
      setSlectedDealerIndex(selectedDealerIndex);
    } else if (isSlectedDealerIndex == 0 || isSlectedDealerIndex < 0) {
      getDealersDetail(defaultListOfDealers[0]);
      setSelectedDealer(defaultListOfDealers[0]);
    }
  }, [isSlectedDealerIndex, defaultListOfDealers, isReschedule]);

  // to locate the dealers location
  useEffect(() => {
    try {
      if (isSelectedDealer) {
        const mapsConfig = {
          zoom: 12,
          center: {
            lat: parseFloat(isSelectedDealer.latitude),
            lng: parseFloat(isSelectedDealer.longitude)
          }
        };
        const markers = [];
        const marker = {
          lat: parseFloat(isSelectedDealer.latitude),
          lng: parseFloat(isSelectedDealer.longitude)
          // icon: icon[experienceCenter]
        };
        marker["details"] = {
          id: isSelectedDealer.id,
          title: isSelectedDealer.experienceCenterName,
          message: isSelectedDealer.address
          // image: icon.experienceCenter
        };
        markers.push(marker);
        mapsConfig["markers"] = markers;
        setMapData(mapsConfig);
      }
    } catch (error) {
      Logger.error(error);
    }
  }, [isSelectedDealer]);
  return (
    <div>
      <div className="testRide-dealers__tabs">
        {tabList?.tabTitles.map((tabHeader, index) => (
          <div
            className={`testRide-dealers__tabs-header ${
              activeIndex == index ? "testRide-dealers__tab-active" : ""
            }`}
            key={tabHeader.tabHeaderLabel + index}
            onClick={() => {
              isHandleTabSwitch(index);
            }}
          >
            <p className="testRide-dealers__header-text">
              {tabHeader.tabHeaderLabel}
            </p>
          </div>
        ))}
      </div>
      <div className="testRide-dealers__tabs-content">
        {defaultListOfDealers.length > 0 ? (
          <div
            className={`testRide-dealers__tabs-list ${
              activeIndex != 0 ? "d-none" : ""
            }`}
          >
            {defaultListOfDealers?.map((x, index) => (
              <div
                key={x.id}
                className={`testRide-dealers__details-content ${
                  index === isSlectedDealerIndex
                    ? "testRide-dealers__content-active"
                    : ""
                }`}
                onClick={(e) => handleDealerClick(x, index)}
              >
                <div className="dealers-list__name-distance">
                  <p className="dealers-list__center-name">
                    {x?.experienceCenterName}
                  </p>
                </div>
                <div className="dealers-list__ph-address">
                  <div className="dealers-list__ph">
                    <p className="dealers-list__ph-text">
                      {x?.phonenumber ? "+91" + x?.phonenumber : ""}
                    </p>
                  </div>
                  <div className="dealers-list__address">
                    <span className="dealers-list__address-text">
                      {x?.address}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="testRide-dealers__error-message">
            {dealersLoading ? dealersLoading : config.noDealerAvailableError}
          </div>
        )}
        {
          <div className={`map-container ${activeIndex == 0 ? "d-none" : ""}`}>
            {mapData && (
              // <GoogleMaps
              //   setShowInfo={setShowInfo}
              //   showInfo={showInfo}
              //   config={mapData}
              //   disableIconClick={false}
              // ></GoogleMaps>
              <MapMyIndia
                dealerDetails={defaultListOfDealers}
                isCityPage={false}
                isTestRidePage={true}
                isShowDirection={false}
                selectedDealer={isSelectedDealer}
                isRenderMap={true}
                isMapUpdate={isMapUpdate}
                userMapId={"testRideMap"}
              />
            )}
            <div className="locate-dealers">
              <>
                {mapData &&
                  defaultListOfDealers
                    .filter((item) => {
                      return item.id === mapData.markers[0].details.id;
                    })
                    .map((x, index) => (
                      <div
                        key={x.id}
                        className={`booking-dealers__details-content`}
                      >
                        <div
                          className={`booking-dealers__left-arrow`}
                          onClick={(e) => {
                            isLeftClick(x);
                          }}
                        >
                          <img
                            src={
                              appUtils.getConfig("resourcePath") +
                              "images/svg/left-arrow.svg"
                            }
                          ></img>
                        </div>
                        <div className="locate-dealers__container">
                          <div className="dealers__name-distance">
                            <p className="dealers__center-name">
                              {x?.experienceCenterName}
                            </p>
                          </div>
                          <div className="dealers__ph-address">
                            <div className="dealers__ph">
                              <p className="dealers__ph-text">
                                {x?.phonenumber ? "+91" + x?.phonenumber : ""}
                              </p>
                            </div>
                            <div className="dealers__address">
                              <li className="dealers__address-text">
                                {x?.address}
                              </li>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`booking-dealers__right-arrow`}
                          onClick={(e) => {
                            isRightClick(x);
                          }}
                        >
                          <img
                            src={
                              appUtils.getConfig("resourcePath") +
                              "images/svg/right-arrow.svg"
                            }
                          ></img>
                        </div>
                      </div>
                    ))}
              </>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default DealersTab;

DealersTab.propTypes = {
  tabList: PropTypes.string,
  defaultOpenIndex: PropTypes.number,
  isReschedule: PropTypes.bool,
  listOfDealers: PropTypes.array,
  getDealersDetail: PropTypes.func,
  config: PropTypes.object,
  dealersLoading: PropTypes.string,
  selectedDealersId: PropTypes.string,
  selectedDealerDetails: PropTypes.object
};
