import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Wrapper } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import appUtils from "../../../../site/scripts/utils/appUtils";

const markerConfigs = [];
let listenerHandle;
const defaultIcon =
  appUtils.getConfig("resourcePath") + "images/svg/building.svg";
const selectIcon =
  appUtils.getConfig("resourcePath") + "images/svg/building-active.svg";
const render = (status) => {
  return <h1>{status}</h1>;
};

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) => {
  if (
    isLatLngLiteral(a) ||
    a instanceof google.maps.LatLng ||
    isLatLngLiteral(b) ||
    b instanceof google.maps.LatLng
  ) {
    return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
  }
  return deepEqual(a, b);
});

function useDeepCompareMemoize(value) {
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(callback, dependencies) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

const GoogleMaps = (props) => {
  const apiKey = appUtils.getConfig("googleAPIKey");
  const {
    zoom,
    center,
    styles,
    mapTypeControl,
    fullscreenControl,
    streetViewControl,
    markers,
    fixedMarker,
    googleNavigateLabel
  } = {
    ...props.defaultConfig,
    ...props.config
  };
  //const [showInfo, setShowInfo] = useState(false);
  const [details, setDetails] = useState({
    title: "",
    message: ""
  });
  const [latLang, setlatLang] = useState({
    lat: "",
    lng: ""
  });

  const handleMarkerPosition = (latLng) => {
    props.markerPositionHandler && props.markerPositionHandler(latLng);
  };

  const handleInfoBox = (details, lat, lng) => {
    props.setShowInfo(true);
    setDetails(details);
    setlatLang({ lat: lat, lng: lng });
    props.onClickHandler && props.onClickHandler(details);
  };

  const handleCloseInfoBox = () => {
    props.setShowInfo(false);
    if (markerConfigs.length) {
      markerConfigs.forEach((obj) => {
        obj.mark.setOptions({
          icon: obj.icon
        });
      });
    }
  };

  return (
    <div className="vida-map">
      <Wrapper apiKey={apiKey} render={render} libraries={["places"]}>
        <Map
          center={center}
          zoom={zoom}
          mapTypeControl={mapTypeControl}
          styles={styles}
          fullscreenControl={fullscreenControl}
          streetViewControl={streetViewControl}
          style={{
            flexGrow: "1",
            height: "100%"
          }}
        >
          {fixedMarker && (
            <FixedMarker
              config={fixedMarker}
              markerPositionHandler={handleMarkerPosition}
            />
          )}
          {!fixedMarker &&
            markers.length &&
            markers.map((obj, i) => (
              <Marker
                key={i}
                config={obj}
                index={i}
                infoBoxHandler={handleInfoBox}
                disableIconClick={props.disableIconClick}
              />
            ))}
        </Map>
        {details && props.showInfo && !fixedMarker && (
          <InfoBox
            details={details}
            latLang={latLang}
            googleNavigateLabel={googleNavigateLabel}
            handleClose={handleCloseInfoBox}
          />
        )}
      </Wrapper>
    </div>
  );
};

const Map = ({ children, style, ...options }) => {
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current));
    }
  }, [ref, map]);

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

const Marker = (props) => {
  const { map, config, index, infoBoxHandler, disableIconClick } = props;
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (!marker) {
      markerConfigs.push({
        icon: config.icon || defaultIcon,
        mark: new google.maps.Marker({
          icon: config.icon || defaultIcon
        })
      });

      setMarker(markerConfigs[index].mark);
    }
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    google.maps.event.removeListener(listenerHandle);

    if (marker) {
      marker.setOptions({
        map,
        position: {
          lat: config.lat,
          lng: config.lng
        },
        icon: config.icon || defaultIcon
      });
      if (map && !disableIconClick) {
        marker.addListener("click", () => {
          markerConfigs.forEach((obj) => {
            obj.mark.setOptions({
              icon: obj.icon
            });
          });
          marker.setOptions({
            icon: config.selectIcon || selectIcon
          });

          infoBoxHandler &&
            infoBoxHandler(config.details, config.lat, config.lng);
        });
      }

      if (map && config.selected) {
        marker.setOptions({
          icon: config.selectIcon || selectIcon
        });
        infoBoxHandler &&
          infoBoxHandler(config.details, config.lat, config.lng);
      }
    }
  }, [config, marker, map, disableIconClick]);

  return null;
};

const FixedMarker = (props) => {
  const { map, config, markerPositionHandler } = props;
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (!marker) {
      setMarker(
        new google.maps.Marker({
          icon: defaultIcon
        })
      );
    }
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions({
        map,
        position: {
          lat: config.lat,
          lng: config.lng
        }
      });
      if (map) {
        var timeout;
        listenerHandle = map.addListener("center_changed", function () {
          window.clearTimeout(timeout);
          const center = map.getCenter();
          marker.setPosition(center);
          timeout = window.setTimeout(function () {
            markerPositionHandler &&
              markerPositionHandler({
                lat: parseFloat(center.lat()),
                lng: parseFloat(center.lng())
              });
          }, 1000);
        });
      }
    }
  }, [config, marker, map]);

  return null;
};

const InfoBox = (props) => {
  const { details, latLang, googleNavigateLabel, handleClose } = props;
  return (
    <div className="vida-map__info vida-info-box">
      <div className="vida-info-box__close" onClick={() => handleClose()}>
        <i className="icon-x"></i>
      </div>
      {details.image && (
        <div className="vida-info-box__img">
          <img src={details.image} alt={details.title} title={details.title} />
        </div>
      )}
      <div className="vida-info-box__content">
        <div className="h3 vida-info-box__title">{details.title}</div>
        <div className="h4 vida-info-box__message">{details.message}</div>
        {googleNavigateLabel && (
          <div>
            <a
              className="vida-info-box__link"
              href={
                "https://maps.google.com/?q=" + latLang.lat + "," + latLang.lng
              }
              target="_blank"
              rel="noreferrer"
            >
              {googleNavigateLabel} <i className="icon-arrow"></i>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

GoogleMaps.propTypes = {
  defaultConfig: PropTypes.object,
  config: PropTypes.object,
  disableIconClick: PropTypes.bool,
  onClickHandler: PropTypes.func,
  markerPositionHandler: PropTypes.func,
  setShowInfo: PropTypes.func,
  showInfo: PropTypes.bool
};

GoogleMaps.defaultProps = {
  defaultConfig: {
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    styles: [
      {
        elementType: "geometry",
        stylers: [{ color: "#ece8e0" }]
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }]
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#d0e3d5" }]
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#ece8e0" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#fcefc8" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#ecbd53" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#9cc0f9" }]
      }
    ]
  },
  disableIconClick: false
};

Map.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object
};

Marker.propTypes = {
  map: PropTypes.any,
  config: PropTypes.object,
  index: PropTypes.number,
  infoBoxHandler: PropTypes.func,
  disableIconClick: PropTypes.bool
};

FixedMarker.propTypes = {
  map: PropTypes.any,
  config: PropTypes.object,
  markerPositionHandler: PropTypes.func
};

InfoBox.propTypes = {
  details: PropTypes.object,
  latLang: PropTypes.object,
  googleNavigateLabel: PropTypes.string,
  handleClose: PropTypes.func
};

export default GoogleMaps;
