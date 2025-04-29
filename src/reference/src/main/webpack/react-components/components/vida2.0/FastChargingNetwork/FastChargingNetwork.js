import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import appUtils from "../../../../site/scripts/utils/appUtils";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import { getStoreDetails } from "../../../services/locationFinder/locationFinderService";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import Logger from "../../../../services/logger.service";
import CommunityChargingCard from "../CommunityChargingCard/CommunityChargingCard";
import MapMyIndia from "../MapMyIndia/MapMyIndia";

const FastChargingNetwork = (props) => {
  const { config, userProfileData } = props;
  const [chargingLocationCityList, setChargingLocationCityList] = useState();
  const [selectedCityChargingStations, setSelectedCityChargingStations] =
    useState();
  const [isMapUpdate, setMapUpdate] = useState(false);
  const [userCityData, setUserCityData] = useState("");
  const isLoggedIn = loginUtils.isSessionActive();

  const getChargingStationList = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const url = appUtils.getAPIUrl("storeDetailsUrl");
      const chargingStationList = await getStoreDetails(url);
      if (chargingStationList) {
        setChargingLocationCityList(chargingStationList);
        setSpinnerActionDispatcher(false);
      } else {
        setSpinnerActionDispatcher(false);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleSelectedCityChargingStations = (cityName) => {
    const filterChargingStations = chargingLocationCityList?.filter(
      (item) =>
        item?.cityName?.toLowerCase().trim() ===
        `${cityName?.toLowerCase().trim()}`
    );
    if (filterChargingStations[0]?.atherChargingStations.length > 0) {
      const tempArray = [
        ...filterChargingStations[0]?.chargingStations,
        ...filterChargingStations[0]?.atherChargingStations
      ];
      setSelectedCityChargingStations(tempArray);
      setMapUpdate(true);
    } else {
      setSelectedCityChargingStations(
        filterChargingStations[0]?.chargingStations
      );
      setMapUpdate(true);
    }
  };

  const handleSelectedCityHandler = (value) => {
    handleSelectedCityChargingStations(value);
  };

  useEffect(() => {
    getChargingStationList();
  }, []);

  useEffect(() => {
    if (isLoggedIn && userProfileData?.city) {
      // getting user-city and format it as according to api response value
      const userCityValue = userProfileData?.city
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setUserCityData(userCityValue);
    } else {
      if (chargingLocationCityList) {
        if (chargingLocationCityList[0]?.atherChargingStations.length > 0) {
          const tempArray = [
            ...chargingLocationCityList[0]?.chargingStations,
            ...chargingLocationCityList[0]?.atherChargingStations
          ];

          setSelectedCityChargingStations(tempArray);
          setMapUpdate(true);
        } else {
          setSelectedCityChargingStations(
            chargingLocationCityList[0]?.chargingStations
          );
          setMapUpdate(true);
        }
      }
    }
  }, [chargingLocationCityList, userProfileData?.city]);

  return (
    <div className="fast-charging-network-wrapper">
      <div className="community-charging-cl-container">
        <CommunityChargingCard
          config={config?.communityChargingCardConfig}
          chargingLocationCityList={chargingLocationCityList}
          selectedCityHandler={handleSelectedCityHandler}
          userCityData={userCityData}
        />
      </div>
      <div className="charging-map-my-india-cl-container map-container">
        <MapMyIndia
          dealerDetails={selectedCityChargingStations}
          isShowDirection={false}
          isCityPage={false}
          isTestRidePage={false}
          isRenderMap={true}
          isFastChargingPage={true}
          userMapId={"fastChargingMap"}
          isMapUpdate={isMapUpdate}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    userProfileData: {
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    }
  };
};

FastChargingNetwork.propTypes = {
  config: PropTypes.shape({
    communityChargingCardConfig: PropTypes.object
  }),
  userProfileData: PropTypes.object
};

export default connect(mapStateToProps)(FastChargingNetwork);
