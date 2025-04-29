import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { getVidaCentreBranchList } from "../../../../services/location.service";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import CityBanner from "../CityBanner/CityBanner";
import DealersMap from "../DealersMap/DealersMap";
import DealersInfoTab from "../DealersInfoTab/DealersInfoTab";

const CityTemplate = (props) => {
  const { config } = props;
  const [cityName, setCityName] = useState();
  const [dealerList, setDealerList] = useState();
  const [cityNameAvailable, setCityNameAvailable] = useState(false);
  const [isCityPage, setIsCityPage] = useState(true);
  const [directionData, setDirectionData] = useState();
  const [activeTab, setActiveTab] = useState();

  const getDealerList = async (cityName) => {
    setSpinnerActionDispatcher(true);
    const centreList = await getVidaCentreBranchList(cityName);
    if (centreList.length > 0) {
      setCityName(cityName);
      setDealerList(centreList);
      setCityNameAvailable(true);
    }
  };

  const handleGetDirection = (item) => {
    if (item) {
      // setSpinnerActionDispatcher(true);
      setDirectionData(item);
    }
  };

  useEffect(() => {
    const url = window.location.pathname;
    const selectedCity = url
      .split("/")
      .pop()
      .replace(".html", "")
      .split("-")
      .join(" ");
    if (config?.cityName) {
      getDealerList(config?.cityName);
    } else {
      if (selectedCity) {
        getDealerList(selectedCity);
      } else {
        const getCity = JSON.parse(
          window.sessionStorage.getItem("selectedCity")
        );
        if (getCity && getCity?.city) {
          getDealerList(getCity?.city);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (cityName) {
      setSpinnerActionDispatcher(false);
    }
  }, [cityName]);

  useEffect(() => {
    if (directionData) {
      setSpinnerActionDispatcher(false);
    }
  }, [directionData]);

  const scrollToDealersSection = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="city-template-wrapper">
      {config?.isShowCityBanner && (
        <div className="city-banner-cl-container">
          <CityBanner config={config?.cityBannerConfig} cityName={cityName} />
        </div>
      )}
      {config?.isShowDealersMap && (
        <div className="dealers-map-cl-container">
          <DealersMap
            config={config?.dealersMapConfig}
            dealerDetails={dealerList}
            isCityPage={isCityPage}
            selectedDealer={directionData}
            goToDealersSection={scrollToDealersSection}
            cityNameAvailable={cityNameAvailable}
          />
        </div>
      )}
      {config?.isShowDealersInfoTab && (
        <div className="dealers-info-tab-cl-container">
          <DealersInfoTab
            config={config?.dealersInfoTabConfig}
            cityName={cityName}
            dealerDetails={dealerList}
            directionData={handleGetDirection}
            activeTabIndex={activeTab}
          />
        </div>
      )}
    </div>
  );
};

export default CityTemplate;

CityTemplate.propTypes = {
  config: PropTypes.shape({
    cityBannerConfig: PropTypes.object,
    dealersMapConfig: PropTypes.object,
    dealersInfoTabConfig: PropTypes.object,
    isShowCityBanner: PropTypes.bool,
    isShowDealersMap: PropTypes.bool,
    isShowDealersInfoTab: PropTypes.bool,
    cityName: PropTypes.string
  })
};
