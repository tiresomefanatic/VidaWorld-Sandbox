import Logger from "../../../services/logger.service";

const googleMapsUtils = {
  geocoder: null,
  location: {
    address: "",
    pincode: ""
  },

  getAddress(latLng) {
    const { lat, lng } = latLng;

    try {
      if (!this.geocoder) {
        this.geocoder = new google.maps.Geocoder();
      }

      return new Promise((resolve, reject) => {
        this.geocoder
          .geocode({
            location: {
              lat: lat,
              lng: lng
            }
          })
          .then((response) => {
            if (response.results.length > 2) {
              this.location = {
                address: response.results[1].formatted_address,
                pincode: this.getPincode(response.results)
              };
              resolve(this.location);
            } else {
              resolve(null);
            }
          })
          .catch(() => {
            reject(null);
          });
      });
    } catch (err) {
      Logger.error(err);
    }
  },

  getPincode(addressList) {
    if (addressList && addressList.length) {
      addressList.forEach((item) => {
        item.address_components.forEach((entry) => {
          if (entry.types[0] === "postal_code") {
            this.pincode = entry.long_name;
          }
        });
      });
      return this.pincode;
    }
  },

  getCurrentLocation() {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    try {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          function (pos) {
            const crd = pos.coords;
            resolve({
              lat: parseFloat(crd.latitude),
              lng: parseFloat(crd.longitude)
            });
          },
          function () {
            reject(null);
          },
          options
        );
      });
    } catch (error) {
      Logger.error(error);
    }
  }
};

export default googleMapsUtils;
