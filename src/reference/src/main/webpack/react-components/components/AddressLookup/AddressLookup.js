import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

// TODO: Cleanup country code, hardcoded labels.
const AddressLookup = (props) => {
  const { reloadMap, defaultLocation } = props;
  const autoCompleteRef = useRef();
  const inputRef = useRef(null);
  const options = {
    componentRestrictions: {
      country: "in"
    },
    fields: ["address_components", "geometry", "icon", "name"],
    types: ["establishment"]
  };
  const [location, setLocation] = useState(defaultLocation);
  const [showInput, setInput] = useState(!defaultLocation.address);

  useEffect(() => {
    setLocation(defaultLocation);
    setInput(!defaultLocation.address);
  }, [defaultLocation]);

  useEffect(() => {
    if (inputRef.current !== null) {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );
      autoCompleteRef.current.addListener("place_changed", async () => {
        const place = await autoCompleteRef.current.getPlace();
        if (place) {
          const placeVal = [];
          if (place.address_components.length) {
            place.address_components.forEach((element) => {
              placeVal.push(element.long_name);
            });
          }
          setLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: placeVal.join(", ")
          });
          setInput(false);
          reloadMap(
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
        }
      });
    }
  }, [showInput]);

  const changeLocation = () => {
    setInput(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  };

  return (
    <div className="form__group vida-address-lookup">
      <label htmlFor="Model Variant" className="form__field-label">
        Current Location
      </label>
      {showInput ? (
        <div className="vida-address-lookup__input">
          <input type="text" name="input" ref={inputRef} disabled={false} />
        </div>
      ) : (
        <div
          className="vida-address-lookup__address-details"
          onClick={changeLocation}
        >
          <span
            className="vida-address-lookup__address-value"
            title={location.address}
          >
            {location.address}
          </span>
          <span className="vida-address-lookup__address-change">Change</span>
        </div>
      )}
    </div>
  );
};

AddressLookup.propTypes = {
  defaultLocation: PropTypes.object,
  reloadMap: PropTypes.func
};

export default AddressLookup;
