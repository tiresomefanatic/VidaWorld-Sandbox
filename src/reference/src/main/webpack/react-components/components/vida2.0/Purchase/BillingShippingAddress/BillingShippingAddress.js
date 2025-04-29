import React, { useEffect, useState } from "react";
import Tabs from "../Components/Tabs";
import Button from "../Components/Button";
import { BUTTON_TYPES } from "./Constants";
import { useForm } from "react-hook-form";
import InputField from "../../forms/InputField/InputField";
import Banner from "../Components/Banner";
import PropTypes from "prop-types";
import appUtils from "../../../../../site/scripts/utils/appUtils";
import NumberField from "../../forms/NumberField/NumberField";
import CONSTANT from "../../../../../site/scripts/constant";
import RichTextComponent from "../Components/RichTextComponent";
// import Link from "../Components/Link";
import { FIELDNAMES } from "./Constants";
import { connect } from "react-redux";
import { setAddressDataAction } from "../../../../store/purchaseConfig/purchaseConfigActions";
import {
  useUpdateAddressData,
  useUpdateOptimizedOrder
} from "../../../../hooks/purchaseConfig/purchaseConfigHooks";
import Logger from "js-logger";
import useScreen from "../../../../hooks/utilities/useScreen";
import { setSpinnerActionDispatcher } from "../../../../store/spinner/spinnerActions";
import { showNotificationDispatcher } from "../../../../store/notification/notificationActions";
import Location from "../../../../../site/scripts/location";
import analyticsUtils from "../../../../../site/scripts/utils/analyticsUtils";
import PaymentDetails from "../../PaymentDetails/PaymentDetails";
import { getCityListForDealers } from "../../../../../services/location.service";
import Dropdown from "../../forms/Dropdown/Dropdown";

const BillingShippingAddress = ({
  config,
  updateAddressData,
  orderData,
  orderDetails,
  bannerDetails,
  serviceablePincodesList,
  productData,
  productId,
  paymentDetailsConfig,
  optedBikeVariant,
  dealerDetails,
  handleBackAddress
}) => {
  const {
    billingSecondaryHeading,
    deliveryPreferenceTitle,
    yourLocationDeliveryDescription,
    contactCustomerLink,
    specificDateNote,
    shippingAddressFormTitle,
    shippingAddressFormDescription,
    shippingFormFields,
    billingFormFields,
    billingAddressFormTitle,
    shippingSameAsBillingCheckboxLabel,
    mobileSubmitButtonLabel,
    mobileSubmitButtonSecondaryLabel,
    deliveryPreferenceTabs,
    tabToShowDeliveryCharges,
    billingMainHeading,
    billingShippingFailErrorMsg,
    banner,
    shippingAddressMandatoryMsg,
    shippingAddressDisclaimerHeader,
    shippingAddressFormDisclaimer,
    shippingAddressPrefillText,
    shippingAddressServicableError,
    shippingAddressClickableError,
    shippingAddressDealerError,
    pincodePopupHeader,
    pincodePopupBtnText,
    backButtonLabel
  } = config;
  // state
  const [currentTab, setCurrentTab] = useState(deliveryPreferenceTabs[0].value);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
  const [showBillingDetailsPage, setShowBillngDetailsPage] = useState(true);
  const [showPaymentDetailsPage, setShowPaymentDetailsPage] = useState(false);
  const [ccPaymentUrl, setCcPaymentUrl] = useState("");
  const [isPaymentUrlReceived, setPaymentUrlReceived] = useState(false);
  const [showServicePincodeError, setShowServicePincodeError] = useState(false);
  const [showPincodePopup, setShowPincodePopup] = useState(false);
  const [cityList, setCityList] = useState();
  const defaultCountry = appUtils.getConfig("defaultCountry");
  const defaultCityList = appUtils.getConfig("cityList");
  const [stateFieldData, setStateFieldData] = useState({
    options: [],
    value: orderData?.address?.shipping_state || "",
    isDisabled: false
  });
  const [cityFieldData, setCityFieldData] = useState({
    options: [],
    value: orderData?.address?.shipping_city || "",
    isDisabled: true
  });
  const [dataList, setDataList] = useState({});
  const stateFieldInfo = {
    name: "shipping_state",
    options: appUtils.getConfig("stateList"),
    ...shippingFormFields.state
  };

  const cityFieldInfo = {
    name: "shipping_city",
    options: appUtils.getConfig("cityList"),
    ...shippingFormFields.city
  };
  // hooks
  const createSalesOrderApi = useUpdateOptimizedOrder();
  const addAddressData = useUpdateAddressData();
  // const profileUrl = appUtils.getPageUrl("profileUrl");

  const { isDesktop } = useScreen();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  // const
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  //Serviceable pincode api call
  const getServiceablePincodeData = async () => {
    const locationObj = new Location();
    const selectedLocationData = {
      country: appUtils.getConfig("defaultCountry"),
      state: dealerDetails.dealerState,
      city: dealerDetails.dealerCity
    };
    try {
      await locationObj.getServiceablePincodesList(selectedLocationData);
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const createSalesOrder = async (formData) => {
    const address = {
      billing_address_landmark: formData[FIELDNAMES.billing_address_landmark],
      billing_address_line1: formData[FIELDNAMES.billing_address_line1],
      billing_address_line2: formData[FIELDNAMES.billing_address_line2],
      billing_city: formData[FIELDNAMES.billing_city],
      billing_country: appUtils.getConfig("defaultCountry"),
      billing_pincode: formData[FIELDNAMES.billing_pincode],
      billing_state: formData[FIELDNAMES.billing_state],
      same_as_billing: billingSameAsShipping ? "1" : "0",
      shipping_address_landmark: billingSameAsShipping
        ? formData[FIELDNAMES.billing_address_landmark]
        : formData[FIELDNAMES.shipping_address_landmark],
      shipping_address_line1: billingSameAsShipping
        ? formData[FIELDNAMES.billing_address_line1]
        : formData[FIELDNAMES.shipping_address_line1],
      shipping_address_line2: billingSameAsShipping
        ? formData[FIELDNAMES.billing_address_line2]
        : formData[FIELDNAMES.shipping_address_line2],
      shipping_city: billingSameAsShipping
        ? formData[FIELDNAMES.billing_city]
        : formData[FIELDNAMES.shipping_city],
      shipping_country: appUtils.getConfig("defaultCountry"),
      shipping_pincode: billingSameAsShipping
        ? formData[FIELDNAMES.billing_pincode]
        : formData[FIELDNAMES.shipping_pincode],
      shipping_state: billingSameAsShipping
        ? formData[FIELDNAMES.billing_state]
        : formData[FIELDNAMES.shipping_state]
    };
    orderData.isPaymentUrlReceived = isPaymentUrlReceived;
    const newOrder = { ...orderData, address };
    setSpinnerActionDispatcher(true);
    createSalesOrderApi({ variables: { ...newOrder } }).then((data) => {
      if (
        data.data &&
        data.data.opUpdateSaleOrder &&
        data.data.opUpdateSaleOrder.status_code == "200"
      ) {
        const url = data?.data?.opUpdateSaleOrder?.payment_url;
        // if (isAnalyticsEnabled) {
        //   const customLink = {
        //     name: "Make Payment",
        //     position: "Bottom",
        //     type: "Button",
        //     clickType: "other"
        //   };
        //   const location = {
        //     pinCode: address.billing_pincode,
        //     city: address.billing_city,
        //     state: address.billing_state,
        //     country: address.billing_country
        //   };
        //   const productDetails = {
        //     modelVariant: productData.name,
        //     modelColor: productData.color,
        //     productID: productId
        //   };
        //   analyticsUtils.trackBookingPayment(
        //     customLink,
        //     location,
        //     productDetails
        //   );
        // }
        setSpinnerActionDispatcher(false);
        setCcPaymentUrl(url);
        setShowBillngDetailsPage(false);
        setShowPaymentDetailsPage(true);
        if (url) {
          setPaymentUrlReceived(true);
        }
        // window.location.href = url;

        //payment integration todo
        // if (url && paymentMode === CONSTANT.PAYMENT_MODE.ONLINE) {
        //   window.location.href = url;
        // } else if (
        //   paymentMode === CONSTANT.PAYMENT_MODE.CASH &&
        //   order.orderId
        // ) {
        //   window.location.href = `${bookingStatusUrl}?status=${
        //     order.payment_status
        //       ? order.payment_status
        //       : CONSTANT.PAYMENT_STATUS.PAYMENT_PENDING
        //   }&orderId=${order.orderId}`;
        // } else if (
        //   paymentMode === CONSTANT.PAYMENT_MODE.PARTIAL &&
        //   order.orderId
        // ) {
        //   window.location.href = partialPaymentUrl;
        // }
      }
      // else if (
      //   data.data &&
      //   data.data.opUpdateSaleOrder &&
      //   data.data.opUpdateSaleOrder.status_code == "LOAN_PENDING"
      // ) {
      //   setIsLoanSubmissionError(data.data.opUpdateSaleOrder.message);
      //   setIsLoanAlreadySubmittedPopup(true);
      // }
      else {
        showNotificationDispatcher({
          title: billingShippingFailErrorMsg,
          type: CONSTANT.NOTIFICATION_TYPES.ERROR,
          isVisible: true
        });
        // window.location.href = profileUrl;
        // setSpinnerActionDispatcher(false);
      }
    });
  };

  const handlePincodeChange = (value, fieldname) => {
    if (fieldname !== FIELDNAMES.billing_pincode) {
      if (
        value.length ===
        shippingFormFields.pincode.validationRules.maxLength.value
      ) {
        if (
          serviceablePincodesList &&
          serviceablePincodesList.serviceablePincodes &&
          serviceablePincodesList.serviceablePincodes.includes(
            parseInt(value.trim())
          )
        ) {
          clearErrors(fieldname);
          setShowServicePincodeError(false);
        } else {
          setError(fieldname, {
            type: "custom",
            message: ""
          });
          // clearErrors(fieldname);
          setShowServicePincodeError(true);
        }
      } else if (
        value.length <
        shippingFormFields.pincode.validationRules.maxLength.value
      ) {
        setError(fieldname, {
          type: "required",
          message: shippingFormFields?.pincode?.validationRules.required.message
        });
      } else if (value.length == 0) {
        setError(fieldname, {
          type: "required",
          message: shippingFormFields?.pincode?.validationRules.required.message
        });
      } else {
        clearErrors(fieldname);
      }
    } else {
      if (
        value.length < billingFormFields.pincode.validationRules.maxLength.value
      ) {
        setError(fieldname, {
          type: "custom",
          message: billingFormFields?.pincode?.validationRules.required.message
        });
      } else if (value.length == 0) {
        setError(fieldname, {
          type: "custom",
          message: shippingFormFields?.pincode?.validationRules.required.message
        });
      } else if (value.length === 0) {
        if (
          serviceablePincodesList &&
          serviceablePincodesList.allPincodes &&
          serviceablePincodesList.allPincodes.includes(
            parseInt(shippingAddresses.pincode.trim())
          )
        ) {
          clearErrors(fieldname);
        } else {
          setError(fieldname, {
            type: "custom",
            message:
              shippingFormFields?.pincode?.validationRules?.noCityMatchMsg
                .message
          });
        }
      }
    }
  };

  const handleInputChange = (fieldname, value) => {
    if (fieldname) {
      if (!CONSTANT.ADDRESS_REGEX.test(value)) {
        setError(fieldname, {
          type: "custom",
          message: shippingFormFields.addressLine1.specialCharacterErrorMsg
        });
      } else {
        clearErrors(fieldname);
      }
    } else {
      clearErrors(fieldname);
    }
  };

  const handleFormSubmit = async (formData, event) => {
    //will be removed later
    console.log("Log for reference", formData, errors);
    let billingAddresses = {};
    let shippingAddresses = {};
    if (billingSameAsShipping) {
      billingAddresses = {
        addressLine1: formData[FIELDNAMES.billing_address_line1],
        addressLine2: formData[FIELDNAMES.billing_address_line2],
        addressLandmark: formData[FIELDNAMES.billing_address_landmark],
        pincode: formData[FIELDNAMES.billing_pincode],
        city: formData[FIELDNAMES.billing_city],
        state: formData[FIELDNAMES.billing_state]
      };
      shippingAddresses = {
        ...billingAddresses,
        sameAsBilling: true
      };
    } else {
      billingAddresses = {
        addressLine1: formData[FIELDNAMES.billing_address_line1],
        addressLine2: formData[FIELDNAMES.billing_address_line2],
        addressLandmark: formData[FIELDNAMES.billing_address_landmark],
        pincode: formData[FIELDNAMES.billing_pincode],
        city: formData[FIELDNAMES.billing_city],
        state: formData[FIELDNAMES.billing_state]
      };
      shippingAddresses = {
        addressLine1: formData[FIELDNAMES.shipping_address_line1],
        addressLine2: formData[FIELDNAMES.shipping_address_line2],
        addressLandmark: formData[FIELDNAMES.shipping_address_landmark],
        pincode: formData[FIELDNAMES.shipping_pincode],
        city: formData[FIELDNAMES.shipping_city],
        state: formData[FIELDNAMES.shipping_state],
        sameAsBilling: false
      };
    }
    if (billingSameAsShipping) {
      setSpinnerActionDispatcher(true);
      updateAddressData({
        shippingAddresses,
        billingAddresses
      });

      if (orderData.order_id) {
        const updateAddressRes = await addAddressData({
          variables: {
            sale_order_id: orderData?.order_id,
            billing_address_line1: billingAddresses?.addressLine1 || "",
            billing_address_line2: billingAddresses?.addressLine2 || "",
            billing_address_landmark: billingAddresses?.addressLandmark || "",
            billing_pincode: billingAddresses?.pincode || "",
            billing_city: billingAddresses?.city || "",
            billing_state: billingAddresses?.state || "",
            billing_country: appUtils.getConfig("defaultCountry"),
            shipping_address_line1: shippingAddresses?.addressLine1 || "",
            shipping_address_line2: shippingAddresses?.addressLine2 || "",
            shipping_address_landmark: shippingAddresses?.addressLandmark || "",
            shipping_pincode: shippingAddresses?.pincode || "",
            shipping_city: shippingAddresses?.city || "",
            shipping_state: shippingAddresses?.state || "",
            shipping_country: appUtils.getConfig("defaultCountry"),
            same_as_billing: shippingAddresses?.sameAsBilling ? "Y" : "N"
          }
        });

        if (updateAddressRes.data.UpdateSaleOrderAddress.status === "200") {
          if (isAnalyticsEnabled) {
            // const customLink = {
            //   name: event?.nativeEvent?.submitter?.innerText,
            //   position: "Bottom",
            //   type: "Button",
            //   clickType: "other"
            // };
            // const location = {
            //   pinCode: billingAddresses.pincode,
            //   city: billingAddresses.city,
            //   state: billingAddresses.state,
            //   country: appUtils.getConfig("defaultCountry")
            // };
            // const productDetails = {
            //   modelVariant: productData.name,
            //   modelColor: productData.color,
            //   productID: productId
            // };
            // const additionalPageName = ":Billing & shipping details";
            // const additionalJourneyName = "";
            // analyticsUtils.trackCustomButtonClick(
            //   customLink,
            //   location,
            //   productDetails,
            //   additionalPageName,
            //   additionalJourneyName,
            //   function () {
            //     createSalesOrder(formData);
            //     // setSpinnerActionDispatcher(false);
            //   }
            // );
            // analyticsUtils.trackCTAClicksVida2(customLink, eventName);
            const button = event.nativeEvent.submitter;
            const customLink = {
              ctaText: button.innerText?.split("\n")[0],
              ctaLocation:
                button.dataset.linkPosition || "Billing & Shipping Details"
            };
            analyticsUtils.trackCTAClicksVida2(customLink, "confirmCTAClick");
            createSalesOrder(formData);
          } else {
            createSalesOrder(formData);
            // setSpinnerActionDispatcher(false);
          }
        }
        // setSpinnerActionDispatcher(false);
      } else {
        Logger.error("Order ID is missing");
        setSpinnerActionDispatcher(false);
      }
    } else {
      if (
        serviceablePincodesList &&
        serviceablePincodesList.serviceablePincodes &&
        serviceablePincodesList.serviceablePincodes.includes(
          parseInt(shippingAddresses.pincode.trim())
        )
      ) {
        //Update sales order API call
        setSpinnerActionDispatcher(true);
        updateAddressData({
          shippingAddresses,
          billingAddresses
        });

        if (orderData.order_id) {
          const updateAddressRes = await addAddressData({
            variables: {
              sale_order_id: orderData?.order_id,
              billing_address_line1: billingAddresses?.addressLine1 || "",
              billing_address_line2: billingAddresses?.addressLine2 || "",
              billing_address_landmark: billingAddresses?.addressLandmark || "",
              billing_pincode: billingAddresses?.pincode || "",
              billing_city: billingAddresses?.city || "",
              billing_state: billingAddresses?.state || "",
              billing_country: appUtils.getConfig("defaultCountry"),
              shipping_address_line1: shippingAddresses?.addressLine1 || "",
              shipping_address_line2: shippingAddresses?.addressLine2 || "",
              shipping_address_landmark:
                shippingAddresses?.addressLandmark || "",
              shipping_pincode: shippingAddresses?.pincode || "",
              shipping_city: shippingAddresses?.city || "",
              shipping_state: shippingAddresses?.state || "",
              shipping_country: appUtils.getConfig("defaultCountry"),
              same_as_billing: shippingAddresses?.sameAsBilling ? "Y" : "N"
            }
          });

          if (updateAddressRes.data.UpdateSaleOrderAddress.status === "200") {
            if (isAnalyticsEnabled) {
              // const customLink = {
              //   name: event?.nativeEvent?.submitter?.innerText,
              //   position: "Bottom",
              //   type: "Button",
              //   clickType: "other"
              // };
              // const location = {
              //   pinCode: billingAddresses.pincode,
              //   city: billingAddresses.city,
              //   state: billingAddresses.state,
              //   country: appUtils.getConfig("defaultCountry")
              // };
              // const productDetails = {
              //   modelVariant: productData.name,
              //   modelColor: productData.color,
              //   productID: productId
              // };
              // const additionalPageName = ":Billing & shipping details";
              // const additionalJourneyName = "";
              // analyticsUtils.trackCustomButtonClick(
              //   customLink,
              //   location,
              //   productDetails,
              //   additionalPageName,
              //   additionalJourneyName,
              //   function () {
              //     createSalesOrder(formData);
              //     // setSpinnerActionDispatcher(false);
              //   }
              // );
              const button = event.nativeEvent.submitter;
              const customLink = {
                ctaText: button.innerText?.split("\n")[0],
                ctaLocation:
                  button.dataset.linkPosition || "Billing & Shipping Details"
              };
              analyticsUtils.trackCTAClicksVida2(customLink, "confirmCTAClick");
              createSalesOrder(formData);
            } else {
              createSalesOrder(formData);
              // setSpinnerActionDispatcher(false);
            }
          }
          // setSpinnerActionDispatcher(false);
        } else {
          Logger.error("Order ID is missing");
          setSpinnerActionDispatcher(false);
        }
      } else if (
        serviceablePincodesList &&
        serviceablePincodesList.allPincodes &&
        serviceablePincodesList.allPincodes.includes(
          parseInt(shippingAddresses.pincode.trim())
        )
      ) {
        setError(FIELDNAMES.shipping_pincode, {
          type: "custom",
          message: ""
        });
        // clearErrors(fieldname);
        setShowServicePincodeError(true);
      } else {
        setError(FIELDNAMES.shipping_pincode, {
          type: "custom",
          message: ""
        });
        // clearErrors(fieldname);
        setShowServicePincodeError(true);
      }
    }
  };

  const handleBillingSameAsShippingField = (event) => {
    setBillingSameAsShipping(event.target.checked);
    if (event.target.checked) {
      clearErrors(FIELDNAMES.shipping_address_landmark);
      clearErrors(FIELDNAMES.shipping_address_line1);
      clearErrors(FIELDNAMES.shipping_address_line2);
      clearErrors(FIELDNAMES.shipping_city);
      clearErrors(FIELDNAMES.shipping_state);
      clearErrors(FIELDNAMES.shipping_pincode);
    }
  };

  const prePopulateFields = (address) => {
    if (address) {
      // billing fields prepopulation
      setValue(
        FIELDNAMES.billing_address_landmark,
        address?.billing_address_landmark || ""
      );
      setValue(
        FIELDNAMES.billing_address_line1,
        address?.billing_address_line1 || ""
      );
      setValue(
        FIELDNAMES.billing_address_line2,
        address?.billing_address_line2 || ""
      );
      setValue(FIELDNAMES.billing_city, address?.billing_city);
      setValue(FIELDNAMES.billing_state, address?.billing_state);
      setValue(FIELDNAMES.billing_pincode, address?.billing_pincode || "");

      // shipping
      setValue(
        FIELDNAMES.shipping_address_landmark,
        address?.shipping_address_landmark || ""
      );
      setValue(
        FIELDNAMES.shipping_address_line1,
        address?.shipping_address_line1 || ""
      );
      setValue(
        FIELDNAMES.shipping_address_line2,
        address?.shipping_address_line2 || ""
      );
      setValue(FIELDNAMES.shipping_city, address?.shipping_city);
      setValue(FIELDNAMES.shipping_state, address?.shipping_state);
      setValue(FIELDNAMES.shipping_pincode, address?.shipping_pincode || "");
      setValue(
        FIELDNAMES.same_as_billing,
        address?.same_as_billing ? true : false
      );

      if (address?.billing_city && address?.billing_state) {
        getServiceablePincodeData();
      }
    }
  };

  // const ctaTracking = (e, eventName, ctaLocation) => {
  //   if (isAnalyticsEnabled) {
  //     const customLink = {
  //       ctaText: e?.target?.innerText?.split("\n")[0],
  //       ctaLocation: e?.target?.dataset?.linkPosition || ctaLocation
  //     };
  //     analyticsUtils.trackCTAClicksVida2(customLink, eventName);
  //   }
  // };

  const servicePincodeHandler = () => {
    setShowPincodePopup(true);
  };

  const handlePopUpClose = () => {
    setShowPincodePopup(false);
  };

  useEffect(() => {
    if (showPincodePopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showPincodePopup]);

  useEffect(() => {
    const fetchCityList = async () => {
      setSpinnerActionDispatcher(true);
      const cityListRes = await getCityListForDealers(defaultCountry);
      if (cityListRes.length > 0) {
        setCityList([...defaultCityList, ...cityListRes]);
      }
    };

    fetchCityList();
    prePopulateFields(orderData?.address || {});
  }, []);

  useEffect(() => {
    if (cityList) {
      const dataList = {};
      cityList.map((item) => {
        if (item.state) {
          const key = item.state.toLowerCase();
          dataList[key] ? dataList[key].push(item) : (dataList[key] = [item]);
        }
      });
      setDataList(dataList);
      setStateFieldData({
        ...stateFieldData,
        value: orderData.address.shipping_state
          ? orderData.address.shipping_state
          : stateFieldData.value,
        options: [
          // ...stateFieldInfo.options,
          ...Object.keys(dataList).map((item) => {
            return {
              value: item.toUpperCase(),
              label: item.charAt(0).toUpperCase() + item.toLowerCase().slice(1)
            };
          })
        ]
      });
      const updatedCities =
        dataList && Object.keys(dataList).length > 0
          ? dataList[
              orderData.address.shipping_state
                ? orderData.address.shipping_state.toLowerCase()
                : stateFieldData.value.toLowerCase()
            ]?.map((item) => {
              return {
                label: item.city,
                value: item.city
              };
            })
          : [];
      setCityFieldData({
        ...cityFieldData,
        isDisabled: false,
        value: orderData.address.shipping_city
          ? orderData.address.shipping_city
          : cityFieldData.value,
        options: [
          // ...cityFieldInfo.options,
          ...(updatedCities ? updatedCities : [])
        ]
      });
    }
  }, [cityList]);

  const resetCityField = () => {
    setCityFieldData({
      options: cityFieldInfo.options,
      value: "",
      isDisabled: false
    });
    setValue(FIELDNAMES.shipping_city, "");
  };

  const resetPincodeField = () => {
    setValue(FIELDNAMES.shipping_pincode, "");
  };

  const handleStateDropdownChange = (name, value) => {
    resetCityField();
    resetPincodeField();
    const dataListOptions = dataList[value.toLowerCase()]
      ? dataList[value.toLowerCase()]?.map((item) => {
          return {
            label: item.city,
            value: item.city
          };
        })
      : [];
    if (value) {
      setCityFieldData({
        ...cityFieldData,
        isDisabled: false,
        options: [...cityFieldInfo.options, ...dataListOptions],
        value: ""
      });
    } else {
      setCityFieldData({
        ...cityFieldData,
        isDisabled: true,
        options: []
      });
    }
  };

  const handleCityDropdownChange = () => {
    resetPincodeField();
  };

  useEffect(() => {
    if (orderData?.address.shipping_city) {
      setValue(FIELDNAMES.shipping_city, orderData?.address.shipping_city);
    }
  }, [orderData?.address.shipping_city]);

  const handleAddressBack = () => {
    handleBackAddress();
  };

  const ctaTrackingBack = (e, eventName, screenName, pageName) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.innerText + " - " + screenName,
        ctaLocation:
          pageName || e?.target?.dataset?.linkPosition || e?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName, "", pageName);
    }
  };

  return (
    <>
      <div className="billing-shipping-payment-container">
        {showBillingDetailsPage && (
          <div className="vida-billing-main-container">
            <div className="delivery-preference">
              <div className="back-button-container">
                <button
                  type="button"
                  className="back-button"
                  onClick={(e) => {
                    handleAddressBack();
                    ctaTrackingBack(
                      e,
                      "backButtonClick",
                      "Billing Shipping Screen",
                      "Buy: Billing Shipping Screen"
                    );
                  }}
                >
                  {backButtonLabel}
                </button>
              </div>
              <div className="banner-heading-container">
                <div className="heading-container">
                  <p className="secondary-heading">{billingSecondaryHeading}</p>
                  <p className="main-heading">{billingMainHeading}</p>
                </div>
                <Banner
                  bannerBgImg={optedBikeVariant?.bgImg}
                  bikeName={bannerDetails?.productName}
                  onItsWayText={banner?.subText}
                  userName={bannerDetails?.userName}
                  bannerBikeImg={optedBikeVariant?.bikeImg}
                  optedBikeVariant={optedBikeVariant}
                />
              </div>
              <div className="delivery-preference-sub-container">
                <div className="tab-container">
                  <p className="tab-title">{deliveryPreferenceTitle}</p>
                  <Tabs
                    tabs={deliveryPreferenceTabs}
                    currentTab={currentTab || ""}
                    onChange={(value) => {
                      setCurrentTab(value);
                    }}
                  />
                </div>
                {currentTab === tabToShowDeliveryCharges && (
                  <div className="card1">
                    <img
                      src={`${appUtils.getConfig(
                        "resourcePath"
                      )}images/svg/info-dark-black.svg`}
                    />
                    <RichTextComponent
                      content={yourLocationDeliveryDescription}
                      className={"content"}
                    />
                  </div>
                )}
                {/* <div className="card2">
                <p>{specificDateNote}</p>
                <Link {...contactCustomerLink} />
              </div> */}
              </div>
            </div>
            <div className="address-form-container">
              <p className="shipping-address-title">
                {billingAddressFormTitle}
              </p>
              <RichTextComponent
                content={shippingAddressFormDescription}
                className={"shipping-address-description"}
              />
              <RichTextComponent
                content={shippingAddressMandatoryMsg}
                className={"shipping-address-mandatory-msg"}
              />
              <form
                id="shipping-address-form"
                className="shipping-address-form"
                onSubmit={handleSubmit((formData, event) =>
                  handleFormSubmit(formData, event)
                )}
              >
                <InputField
                  name={FIELDNAMES.billing_address_line1}
                  label={billingFormFields?.addressLine1?.label}
                  placeholder={billingFormFields?.addressLine1?.placeholder}
                  validationRules={
                    billingFormFields?.addressLine1?.validationRules
                  }
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                  onChangeHandler={handleInputChange}
                />
                <InputField
                  name={FIELDNAMES.billing_address_line2}
                  label={billingFormFields?.addressLine2?.label}
                  placeholder={billingFormFields?.addressLine2?.placeholder}
                  validationRules={
                    billingFormFields?.addressLine2?.validationRules
                  }
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                  onChangeHandler={handleInputChange}
                />
                <InputField
                  name={FIELDNAMES.billing_address_landmark}
                  label={billingFormFields?.landmark?.label}
                  placeholder={billingFormFields?.landmark?.placeholder}
                  validationRules={billingFormFields?.landmark?.validationRules}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                />
                <InputField
                  name={FIELDNAMES.billing_state}
                  label={billingFormFields?.state?.label}
                  placeholder={billingFormFields?.state?.placeholder}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                  validationRules={billingFormFields?.state?.validationRules}
                  isDisabled={orderData?.address?.billing_state}
                />
                <InputField
                  name={FIELDNAMES.billing_city}
                  label={billingFormFields?.city?.label}
                  placeholder={billingFormFields?.city?.placeholder}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  value=""
                  validationRules={billingFormFields?.city?.validationRules}
                  isDisabled={orderData?.address?.billing_city}
                />
                <NumberField
                  name={FIELDNAMES.billing_pincode}
                  label={billingFormFields?.pincode?.label}
                  placeholder={billingFormFields?.pincode?.placeholder}
                  validationRules={billingFormFields?.pincode?.validationRules}
                  register={register}
                  errors={errors}
                  maxLength={CONSTANT.RESTRICT_PINCODE}
                  value=""
                  setValue={setValue}
                  isDisabled={orderData?.address?.billing_pincode}
                  onChangeHandler={handlePincodeChange}
                />
                <div className="divider"></div>
                <div className="billing-address-form-container">
                  <p className="shipping-address-title">
                    {shippingAddressFormTitle}
                  </p>
                  {/* Commenting out the checkbox as per Business Feedback */}
                  {/* <div className="billingSameAsShippingContainer">
                  <label className="billingSameAsShippingContainer">
                    <input
                      type="checkbox"
                      id="billingSameAsShippingField"
                      onChange={handleBillingSameAsShippingField}
                      name="billingSameAsShippingField"
                      checked={billingSameAsShipping}
                      className="billingSameAsShippingFieldCheckbox"
                    />
                    {shippingSameAsBillingCheckboxLabel}
                  </label>
                </div> */}
                  {!billingSameAsShipping && (
                    <div className="billing-address-form-container">
                      <div className="shipping-address-disclaimer">
                        <div className="disclaimer-header-text">
                          <div className="disclaimer-image-wrapper">
                            <img
                              src={`${appUtils.getConfig(
                                "resourcePath"
                              )}images/svg/disclaimer-icon.svg`}
                              alt="edit-icon"
                            />
                          </div>
                          <p>{shippingAddressDisclaimerHeader}</p>
                        </div>
                        <p className="disclaimer-content-text">
                          {shippingAddressFormDisclaimer}
                        </p>
                      </div>
                      <InputField
                        name={FIELDNAMES.shipping_address_line1}
                        label={shippingFormFields?.addressLine1?.label}
                        placeholder={
                          shippingFormFields?.addressLine1?.placeholder
                        }
                        register={register}
                        validationRules={
                          shippingFormFields?.addressLine1?.validationRules
                        }
                        errors={errors}
                        setValue={setValue}
                        value=""
                        onChangeHandler={handleInputChange}
                      />
                      <InputField
                        name={FIELDNAMES.shipping_address_line2}
                        label={shippingFormFields?.addressLine2?.label}
                        placeholder={
                          shippingFormFields?.addressLine2?.placeholder
                        }
                        validationRules={
                          shippingFormFields?.addressLine2?.validationRules
                        }
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        value=""
                        onChangeHandler={handleInputChange}
                      />
                      <InputField
                        name={FIELDNAMES.shipping_address_landmark}
                        label={shippingFormFields?.landmark?.label}
                        placeholder={shippingFormFields?.landmark?.placeholder}
                        validationRules={
                          shippingFormFields?.landmark?.validationRules
                        }
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        value=""
                      />
                      <Dropdown
                        name={FIELDNAMES.shipping_state}
                        label={shippingFormFields?.state?.label}
                        // iconClass={`icon-location-marker`}
                        options={
                          stateFieldData?.options.length > 0
                            ? stateFieldData.options
                            : stateFieldInfo.options
                        }
                        value={orderData?.address?.shipping_state.toUpperCase()}
                        setValue={setValue}
                        onChangeHandler={handleStateDropdownChange}
                        errors={errors}
                        validationRules={
                          shippingFormFields?.state.validationRules
                        }
                        clearErrors={clearErrors}
                        register={register}
                        // setValue={setValue}
                        // isDisabled={!cmpProps.isEligibleForAddressUpdate}
                        isSortAsc={true}
                      />

                      <Dropdown
                        name={FIELDNAMES.shipping_city}
                        label={shippingFormFields?.city?.label}
                        // iconClass={`icon-location-marker`}
                        onChangeHandler={handleCityDropdownChange}
                        options={
                          cityFieldData.options.length > 0
                            ? cityFieldData.options
                            : cityFieldInfo.options
                        }
                        value={getValues(FIELDNAMES.shipping_city)}
                        setValue={setValue}
                        errors={errors}
                        validationRules={
                          shippingFormFields?.city.validationRules
                        }
                        clearErrors={clearErrors}
                        register={register}
                        isDisabled={cityFieldData?.isDisabled}
                        isSortAsc={true}
                      />

                      <NumberField
                        name={FIELDNAMES.shipping_pincode}
                        label={shippingFormFields?.pincode?.label}
                        placeholder={shippingFormFields?.pincode?.placeholder}
                        validationRules={
                          shippingFormFields?.pincode?.validationRules
                        }
                        register={register}
                        errors={errors}
                        maxLength={CONSTANT.RESTRICT_PINCODE}
                        value=""
                        setValue={setValue}
                        onChangeHandler={handlePincodeChange}
                      />
                      <div>
                        {showServicePincodeError ? (
                          <p className="service-pincode-error">
                            {shippingAddressServicableError}{" "}
                            <span onClick={servicePincodeHandler}>
                              {shippingAddressClickableError}{" "}
                            </span>
                            {shippingAddressDealerError}
                          </p>
                        ) : (
                          <p className="address-prefill-text">
                            {shippingAddressPrefillText}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {!isDesktop && (
                  <Button
                    variant={BUTTON_TYPES.PRIMARY}
                    label={mobileSubmitButtonLabel}
                    style={{ width: "100%" }}
                    secondaryLabel={mobileSubmitButtonSecondaryLabel}
                    disabled={Object.keys(errors).length > 0}
                    type="submit"
                    onClick={(e) => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      // ctaTracking(
                      //   e,
                      //   "confirmCTAClick",
                      //   "Billing & Shipping Details"
                      // );
                    }}
                  />
                )}
              </form>
            </div>
            {isDesktop && (
              <div className="billing-bottom-drawer">
                <div className="button-container">
                  <Button
                    variant={BUTTON_TYPES.PRIMARY}
                    label={mobileSubmitButtonLabel}
                    style={{ flexBasis: "30%" }}
                    secondaryLabel={mobileSubmitButtonSecondaryLabel}
                    formId={"shipping-address-form"}
                    onClick={(e) => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      // ctaTracking(
                      //   e,
                      //   "confirmCTAClick",
                      //   "Billing & Shipping Details"
                      // );
                    }}
                    type="submit"
                    disabled={Object.keys(errors).length > 0}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {showPaymentDetailsPage && (
          <PaymentDetails
            config={paymentDetailsConfig}
            billingShippingConfig={config}
            orderData={orderDetails}
            ccPaymentUrl={ccPaymentUrl}
            optedBikeVariant={optedBikeVariant}
          />
        )}
      </div>
      {showPincodePopup && (
        <div className="service-pincode-popup">
          <div className="service-pincode-popup-content">
            <p className="service-pincode-header">{pincodePopupHeader}</p>
            <div className="service-pincode-list">
              {serviceablePincodesList?.serviceablePincodes &&
                serviceablePincodesList?.serviceablePincodes?.map((pincode) => (
                  <div key={pincode} className="pincode-item">
                    {pincode}
                  </div>
                ))}
            </div>
            <button className="service-pincode-btn" onClick={handlePopUpClose}>
              {pincodePopupBtnText}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

BillingShippingAddress.propTypes = {
  config: PropTypes.shape({
    shippingFormFields: PropTypes.shape({
      addressLine1: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.shape({}),
        errorMsg: PropTypes.string,
        label: PropTypes.string,
        specialCharacterErrorMsg: PropTypes.string
      }),
      addressLine2: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.shape({}),
        errorMsg: PropTypes.string,
        label: PropTypes.string,
        specialCharacterErrorMsg: PropTypes.string
      }),
      landmark: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.shape({}),
        errorMsg: PropTypes.string,
        label: PropTypes.string
      }),
      state: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.shape({}),
        errorMsg: PropTypes.string,
        label: PropTypes.string
      }),
      city: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.shape({}),
        errorMsg: PropTypes.string,
        label: PropTypes.string
      }),
      pincode: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.object,
        errorMsg: PropTypes.string,
        label: PropTypes.string
      })
    }),
    billingFormFields: PropTypes.shape({
      addressLine1: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.shape({}),
        errorMsg: PropTypes.string,
        label: PropTypes.string,
        specialCharacterErrorMsg: PropTypes.string
      }),
      addressLine2: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.shape({}),
        errorMsg: PropTypes.string,
        label: PropTypes.string,
        specialCharacterErrorMsg: PropTypes.string
      }),
      landmark: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.shape({}),
        errorMsg: PropTypes.string,
        label: PropTypes.string
      }),
      state: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.shape({}),
        errorMsg: PropTypes.string,
        label: PropTypes.string
      }),
      city: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.shape({}),
        errorMsg: PropTypes.string,
        label: PropTypes.string
      }),
      pincode: PropTypes.shape({
        placeholder: PropTypes.string,
        validationRules: PropTypes.object,
        errorMsg: PropTypes.string,
        label: PropTypes.string
      })
    }),
    billingSecondaryHeading: PropTypes.string,
    deliveryPreferenceTitle: PropTypes.string,
    yourLocationDeliveryDescription: PropTypes.string,
    shippingAddressMandatoryMsg: PropTypes.string,
    contactCustomerLink: PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string
    }),
    specificDateNote: PropTypes.string,
    shippingAddressFormTitle: PropTypes.string,
    shippingAddressFormDescription: PropTypes.string,
    billingAddressFormTitle: PropTypes.string,
    shippingSameAsBillingCheckboxLabel: PropTypes.string,
    mobileSubmitButtonLabel: PropTypes.string,
    mobileSubmitButtonSecondaryLabel: PropTypes.string,
    tabToShowDeliveryCharges: PropTypes.string,
    deliveryPreferenceTabs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
        isSelected: PropTypes.bool
      })
    ),
    billingMainHeading: PropTypes.string,
    billingShippingFailErrorMsg: PropTypes.string,
    banner: PropTypes.shape({
      bannerImage: PropTypes.object,
      subText: PropTypes.string,
      bannerBikeImg: PropTypes.object
    }),
    shippingAddressFormDisclaimer: PropTypes.string,
    shippingAddressDisclaimerHeader: PropTypes.string,
    shippingAddressPrefillText: PropTypes.string,
    shippingAddressServicableError: PropTypes.string,
    shippingAddressClickableError: PropTypes.string,
    shippingAddressDealerError: PropTypes.string,
    pincodePopupBtnText: PropTypes.string,
    pincodePopupHeader: PropTypes.string,
    backButtonLabel: PropTypes.string
  }),
  updateAddressData: PropTypes.func,
  orderData: PropTypes.object,
  orderDetails: PropTypes.object,
  bannerDetails: PropTypes.object,
  serviceablePincodesList: PropTypes.object,
  productData: PropTypes.object,
  productId: PropTypes.object,
  paymentDetailsConfig: PropTypes.object,
  optedBikeVariant: PropTypes.object,
  dealerDetails: PropTypes.object,
  handleBackAddress: PropTypes.func
};

const mapMyStateToProps = (state) => {
  const {
    purchaseConfigReducer,
    userProfileDataReducer,
    testDriveReducer,
    preBookingReducer
  } = state;
  return {
    orderData: {
      order_id: purchaseConfigReducer?.order?.orderId,
      subscription_plan_id: purchaseConfigReducer?.subscriptionPlan?.package_id,
      aadhar_selected: purchaseConfigReducer?.aadhar?.aadharSelected,
      aadhar_number: purchaseConfigReducer?.aadhar?.aadharNumber,
      aadhar_used_for_register:
        purchaseConfigReducer?.aadhar?.aadharUsedForRegister,
      gst_selected: purchaseConfigReducer?.gst?.gstSelected,
      gst_number: purchaseConfigReducer?.gst?.gstNumber,
      company_name: purchaseConfigReducer?.gst?.companyName,
      company_email: purchaseConfigReducer?.gst?.companyEmail,
      selected_payment: purchaseConfigReducer?.payment?.paymentMethod,
      payment_method: "online",
      insurer_id: purchaseConfigReducer?.insurance?.insurerId,
      insurance_addons: purchaseConfigReducer?.insurance?.insuranceAddons,
      cpa_opted: purchaseConfigReducer?.insurance?.cpaOpted,
      cpa_reason: purchaseConfigReducer?.insurance?.cpaNotOptedReason,
      paymentType: "ONLINE",
      buyBack: purchaseConfigReducer?.payment?.buybackOpted,
      exchange_selected: purchaseConfigReducer?.tradeIn?.tradeInSelected,
      customer_remarks: purchaseConfigReducer?.tradeIn?.remark,
      home_delivery_opt_in:
        purchaseConfigReducer?.homeDelivery?.homeDeliverySelected,
      isFirstEV: true,
      address: {
        billing_address_landmark:
          purchaseConfigReducer?.billingAddresses?.addressLandmark,
        billing_address_line1:
          purchaseConfigReducer?.billingAddresses?.addressLine1,
        billing_address_line2:
          purchaseConfigReducer?.billingAddresses?.addressLine2,
        billing_city: purchaseConfigReducer?.billingAddresses?.city,
        billing_pincode: purchaseConfigReducer?.billingAddresses?.pincode,
        billing_state: purchaseConfigReducer?.billingAddresses?.state,
        same_as_billing:
          purchaseConfigReducer?.shippingAddresses?.sameAsBilling,
        shipping_address_landmark:
          purchaseConfigReducer?.shippingAddresses?.addressLandmark,
        shipping_address_line1:
          purchaseConfigReducer?.shippingAddresses?.addressLine1,
        shipping_address_line2:
          purchaseConfigReducer?.shippingAddresses?.addressLine2,
        shipping_city: purchaseConfigReducer?.shippingAddresses?.city,
        shipping_pincode: purchaseConfigReducer?.shippingAddresses?.pincode,
        shipping_state: purchaseConfigReducer?.shippingAddresses?.state
      }
    },
    bannerDetails: {
      userName: userProfileDataReducer?.fname,
      productName: purchaseConfigReducer?.productData?.name
    },
    productData: purchaseConfigReducer?.productData,
    serviceablePincodesList: testDriveReducer?.serviceablePincodesList,
    productId: purchaseConfigReducer.productId,
    dealerDetails: {
      dealerCity: preBookingReducer.city,
      dealerState: preBookingReducer.state,
      dealerName: preBookingReducer.name,
      dealerBranchId: preBookingReducer.branchId
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAddressData: (data) => {
      dispatch(setAddressDataAction(data));
    }
  };
};

export default connect(
  mapMyStateToProps,
  mapDispatchToProps
)(BillingShippingAddress);
