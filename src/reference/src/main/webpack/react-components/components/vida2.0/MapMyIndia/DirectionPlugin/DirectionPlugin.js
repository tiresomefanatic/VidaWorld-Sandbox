import React, { useEffect, useRef } from "react";
import { mappls, mappls_plugin } from "mappls-web-maps";
import appUtils from "../../../../../site/scripts/utils/appUtils";
import { setSpinnerActionDispatcher } from "../../../../store/spinner/spinnerActions";
import PropTypes from "prop-types";

const mapplsClassObject = new mappls();
const mapplsPluginObject = new mappls_plugin();

const DirectionPlugin = ({
  map,
  userLatitude,
  userLongitude,
  dealerLatitude,
  dealerLongitude,
  dealerName
}) => {
  setSpinnerActionDispatcher(true);
  const directionRef = useRef(null);

  const latLong = [userLatitude, userLongitude];

  const destination = [dealerLatitude, dealerLongitude];

  useEffect(() => {
    let directionApiData = {};
    if (map && directionRef.current) {
      directionRef.current.remove();
      mapplsClassObject.removeLayer({ map, layer: directionRef.current });
      setSpinnerActionDispatcher(false);
    }

    if (userLatitude && userLongitude) {
      directionApiData = {
        ccpIconWidth: 70,
        strokeWidth: 7,
        map: map,
        isDraggable: false,
        markerPopup: true,
        start: {
          label: "Current Location",
          geoposition: latLong.join(","),
          draggable: false
        },
        start_icon: {
          url: `${appUtils.getConfig(
            "resourcePath"
          )}images/svg/vector-orange.svg`
        },
        end_icon: {
          url: "end.icon.png" //To disable the default icon passing dummy string //`${appUtils.getConfig("resourcePath")}images/svg/vector-black.svg`
        },
        end: {
          label: dealerName,
          geoposition: destination.join(","),
          draggable: false
        },
        rtype: 1
      };
    } else {
      directionApiData = {
        ccpIconWidth: 70,
        strokeWidth: 7,
        map: map,
        markerPopup: true,
        isDraggable: false,
        // start: {
        //   label: "Current Location",
        //   geoposition: latLong.join(","),
        //   draggable: false
        // },
        start_icon: {
          url: `${appUtils.getConfig(
            "resourcePath"
          )}images/svg/vector-orange.svg`
        },
        end_icon: {
          url: "end.icon.png"
        }, //To disable the default icon passing dummy string //`${appUtils.getConfig("resourcePath")}images/svg/vector-black.svg`,
        end: {
          label: dealerName,
          geoposition: destination.join(","),
          draggable: false
        },
        rtype: 1
      };
      setSpinnerActionDispatcher(false);
    }
    directionRef.current = mapplsPluginObject.direction(
      directionApiData,
      (e) => {
        setSpinnerActionDispatcher(false);
        directionRef.current.ctrl.container.style.display = "none";
        const markerIcons = map._container.querySelectorAll(".mapboxgl-marker");
        if (markerIcons) {
          markerIcons.forEach((item) => {
            item.draggable = false;
          });
        }
      }
    );
    setSpinnerActionDispatcher(false);

    return () => {
      if (map && directionRef.current) {
        mapplsClassObject.removeLayer({ map, layer: directionRef.current });
      }
    };
  }, [userLatitude, userLongitude]);

  setSpinnerActionDispatcher(false);
};

export default DirectionPlugin;

DirectionPlugin.propTypes = {
  map: PropTypes.any,
  userLatitude: PropTypes.number,
  userLongitude: PropTypes.number,
  dealerLatitude: PropTypes.string,
  dealerLongitude: PropTypes.string,
  dealerName: PropTypes.string
};
