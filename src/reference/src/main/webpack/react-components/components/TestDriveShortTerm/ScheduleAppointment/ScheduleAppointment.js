import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import InputField from "../../form/InputField/InputField";
import { useForm } from "react-hook-form";
import {
  useBookingDates,
  useBookingTimeSlot,
  useModelVariantList,
  useGetTestDrive,
  useBookTestDrive,
  useRescheduleTestDrive,
  useNearbyBranches
} from "../../../hooks/testDrive/testDriveHooks";
import appUtils from "../../../../site/scripts/utils/appUtils";
import Logger from "../../../../services/logger.service";
import DateField from "../../form/DateField/DateField";
import {
  setNearbyBranchesByPincodeDispatcher,
  resetBookingDatesDispatcher,
  resetBookingTimeSlotsDispatcher
} from "../../../store/testDrive/testDriveActions";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import GoogleMaps from "../../GoogleMaps/GoogleMaps";
import CONSTANT from "../../../../site/scripts/constant";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import NumberField from "../../form/NumberField/NumberField";
import Dropdown from "../../form/Dropdown/Dropdown";
import { getSelectedGroupItem } from "../../../../site/scripts/helper";
import Cookies from "js-cookie";
import AddressLookup from "../../AddressLookup/AddressLookup";
import { Wrapper } from "@googlemaps/react-wrapper";
import googleMapsUtils from "../../../../site/scripts/utils/googleMapsUtils";
import { setTestDrivePlaceAction } from "../../../store/testDrive/testDriveActions";
import { getUtmParams } from "../../../../react-components/services/utmParams/utmParams";
import DealerCard from "../../DealerCard/DealerCard";

const ScheduleAppointment = (props) => {
  const apiKey = appUtils.getConfig("googleAPIKey");
  const branchDefaultOption = appUtils.getConfig("branchDefaultOption");
  const modelDefaultOption = appUtils.getConfig("modelDefaultOption");
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const {
    cmpProps,
    config,
    goToSuccessPage,
    mapData,
    testDriveId,
    selectedLocationData,
    reloadMap,
    setTestDrivePlace,
    markerPositionHandler,
    isOTPVerified,
    selectedMapVidaCentre,
    handleMapToVidaCentreSelection,
    setIsNonPageLoadAction,
    isNonPageLoadAction
  } = props;

  if (mapData) {
    mapData["zoom"] = isDesktop ? 16 : 9;
  }

  const {
    scheduleTitle,
    rescheduleTitle,
    dropdownDefaultLabel,
    locationOptionField,
    modelVarientField,
    vidaCentreField,
    dateField,
    timeField,
    addressField,
    buildingField,
    pinCodeField,
    submitBtn,
    rescheduleSubmitBtn,
    mapIcon,
    phoneIcon,
    isAtHomeDisabled
  } = config;

  const {
    // selectedLocation,
    selectedMapLocation,
    modelVariantList,
    nearByVidaCentreList,
    nearbyBranchesByPincode,
    serviceablePincodesList,
    bookingDateList,
    bookingTimeSlotList
  } = cmpProps;

  const {
    register,
    control,
    reset,
    handleSubmit,
    getValues,
    clearErrors,
    setValue,
    setError,
    unregister,
    formState: { errors }
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange"
  });
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const getTestDrive = useGetTestDrive();
  const bookTestDrive = useBookTestDrive();
  const rescheduleTestDrive = useRescheduleTestDrive();
  const getModelVariantList = useModelVariantList();
  const getBookingDates = useBookingDates();
  const getBookingTimeSlots = useBookingTimeSlot();
  const getNearbyBranches = useNearbyBranches();

  const [locationType, setLocationType] = useState(null);

  const [defaultLocation, setDefaultLocation] = useState({
    lat: 0,
    lng: 0,
    address: null,
    pincode: null
  });
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [disableVidaCentre, setDisableVidaCentre] = useState(true);
  const [disablePincode, setDisablePincode] = useState(true);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(true);
  const [disableAtHomeSelection, setDisableAtHomeSelection] = useState(false);
  const [disableAtCentreSelection, setDisableAtCentreSelection] =
    useState(false);

  const [centreValue, setCentreValue] = useState(false);

  const [dateState, setDateState] = useState("");
  const [selectedTestDriveData, setSelectedTestDriveData] = useState(null);

  const [selectedVidaCentre, setSelectedVidaCentre] = useState({});
  const [listOfDealers, setListOfDealers] = useState([]);

  const resetDateAndTimeFields = () => {
    setValue("date", "");
    clearErrors("date");
    setValue("time", "Select Time");
    clearErrors("time");
    setDateState("");
    resetBookingDatesDispatcher();
    resetBookingTimeSlotsDispatcher();
  };

  const resetTimeField = () => {
    setValue("time", "Select Time");
    clearErrors("time");
    // resetBookingTimeSlotsDispatcher();
  };

  const handleInputFieldChange = (name, value) => {
    if (value.trim() !== "") {
      clearErrors(name);
    }
  };

  const formatDate = (date) => {
    date = date.split("/"); // 21/05/2022
    return date[2] + "-" + date[1] + "-" + date[0];
  };
  const [showInfo, setShowInfo] = useState(false);

  const handleDateDropdownChange = async (
    name,
    id,
    setFirstValue,
    branchIdForAtHome
  ) => {
    const atCentre = locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE;

    setSpinnerActionDispatcher(true);
    const timeSlotRes = await getBookingTimeSlots({
      variables: {
        transactionType: atCentre
          ? CONSTANT.TRANSACTION_TYPE.PRODUCT_DEMO
          : CONSTANT.TRANSACTION_TYPE.PRODUCT_DEMO_AT_SITE,
        branchId: atCentre
          ? getValues("vidaCentre")
          : branchIdForAtHome || nearbyBranchesByPincode.id,
        itemId:
          testDriveId && selectedTestDriveData
            ? selectedTestDriveData.dmpl__ItemId__c
            : modelVariantList.find(
                (model) => model.value === getValues("modelVarient")
              ).value,
        bookingDate: id
      }
    });

    if (setFirstValue && timeSlotRes.data.getBranchTimeSlots.items.length > 0) {
      setTimeout(() => {
        resetTimeField();
      }, 100);
      setTimeout(() => {
        setValue("time", timeSlotRes.data.getBranchTimeSlots.items[0].id);
        setDisableSubmitBtn(false);
      }, 100);
    }

    if (timeSlotRes.data.getBranchTimeSlots.items.length < 1) {
      setValue("time", "Select Time");
      setError("time", {
        type: "custom",
        message: timeField.validationRules.custom.message
      });
      setDisableSubmitBtn(true);
    }
  };

  const handleDateChange = (dateValue) => {
    setDateState(dateValue);
    // setError("time");
    // resetTimeField();
    handleDateDropdownChange("date", formatDate(dateValue), true);
  };

  const handleTimeChange = () => {
    setDisableSubmitBtn(false);
  };

  // TODO: Requires cleanup
  const handleOnSiteChange = (val) => {
    setTimeout(async () => {
      setLocationType(val);
      setSelectedVariant(null);
      // Push the Radio selection value to Reducer Action
      setTestDrivePlace(val);
      if (val === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE) {
        unregister(["modelVarient", "vidaCentre", "date", "time"]);
      } else {
        unregister([
          "modelVarient",
          "address",
          "building",
          "pinCode",
          "date",
          "time"
        ]);
      }

      if (testDriveId && selectedTestDriveData) {
        if (val === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE) {
          setDisableVidaCentre(false);
          setDisablePincode(true);
        } else {
          setDisableVidaCentre(true);
          setDisablePincode(false);
        }
      } else {
        reset();
        setDisableVidaCentre(true);
        setDisablePincode(true);
      }
      setDisableSubmitBtn(true);
      resetDateAndTimeFields();
      if (val === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE) {
        if (
          centreValue ||
          (selectedTestDriveData && selectedTestDriveData?.dmpl__ItemId__c)
        ) {
          reloadMap();
        } else {
          reloadMap(null, null, null);
        }
      } else {
        setDisablePincode(false);
        const currentPosition = await googleMapsUtils.getCurrentLocation();
        if (currentPosition && currentPosition.lat && currentPosition.lng) {
          const mapLocation = await googleMapsUtils.getAddress({
            lat: currentPosition.lat,
            lng: currentPosition.lng
          });

          if (mapLocation) {
            setDefaultLocation({
              lat: currentPosition.lat,
              lng: currentPosition.lng,
              address: mapLocation.address,
              pincode: mapLocation.pincode
            });
          }
          reloadMap(currentPosition.lat, currentPosition.lng);
        }
      }
    }, 100);
  };

  const getFirstVidaCentre = () => {
    let vidaCentre = null;
    if (nearByVidaCentreList.length > 0) {
      for (let i = 0; i < nearByVidaCentreList.length; i++) {
        if (nearByVidaCentreList[i].items.length > 0) {
          vidaCentre = nearByVidaCentreList[i].items[0];
          break;
        }
      }
    }
    return vidaCentre;
  };

  const getBookingDatesList = async (
    atCentre,
    centre,
    setFirstValue,
    centreChanged = false
  ) => {
    if (centreChanged) {
      clearErrors("date");
      setSpinnerActionDispatcher(true);
      const response = await getBookingDates({
        variables: {
          transactionType: atCentre
            ? CONSTANT.TRANSACTION_TYPE.PRODUCT_DEMO
            : CONSTANT.TRANSACTION_TYPE.PRODUCT_DEMO_AT_SITE,
          branchId: centre.value || centre,
          itemId:
            testDriveId && selectedTestDriveData
              ? selectedTestDriveData.dmpl__ItemId__c
              : modelVariantList.find(
                  (model) => model.value === getValues("modelVarient")
                ).value,
          daysCount: "5"
        }
      });

      if (setFirstValue && response.data.getBranchDateSlots.items.length > 0) {
        const date = response.data.getBranchDateSlots.items[0].bookingDate;
        const dateItems = date.split("-");
        setDateState(dateItems[2] + "/" + dateItems[1] + "/" + dateItems[0]);
        setValue("date", date);
        handleDateDropdownChange("date", date, true);
      }
      if (response.data.getBranchDateSlots.items.length < 1) {
        resetDateAndTimeFields();
        setError("date", {
          type: "custom",
          message: dateField.validationRules.custom.message
        });
        setDisableSubmitBtn(true);
      }
    }
  };

  const handleVidaCentreDropdownChange = (name, centre, unload) => {
    const atCentre = locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE;
    // resetDateAndTimeFields();

    const centreId = centre?.id || centre;
    !unload && reloadMap(null, null, centreId);
    setSelectedVidaCentre(centre);
    if (
      centre &&
      ((centre.value && centre.value.trim() !== "") || centre.trim() !== "")
    ) {
      setIsNonPageLoadAction(true);
      setCentreValue(centre.value);
      getBookingDatesList(atCentre, centre, true, true);
    } else {
      setError("vidaCentre", {
        type: "required"
      });
    }
  };

  const handleModelVarientDropdownChange = async (name) => {
    const atCentre = locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE;
    // resetDateAndTimeFields();

    const selectedVariantValue = getValues(name);
    setSelectedVariant(selectedVariantValue);
    // setCentreValue

    if (atCentre) {
      selectedVariantValue !== ""
        ? setDisableVidaCentre(false)
        : setDisableVidaCentre(true);
      const vidaCentre = getFirstVidaCentre();
      //  setValue("vidaCentre", vidaCentre.value);
      // handleVidaCentreDropdownChange("vidaCentre", vidaCentre);
    } else {
      if (selectedVariantValue !== "") {
        setDisablePincode(false);
      } else {
        setDisablePincode(true);
      }
      setValue("address", "");
      setValue("building", "");
      setValue("pinCode", defaultLocation.pincode);

      clearErrors("address");
      clearErrors("building");
      clearErrors("pinCode");
    }
  };

  const checkPincodeServiceAbility = (name, value) => {
    const atCentre = locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE;

    if (!value || value.trim().length < 6) {
      clearErrors("pinCode");
      resetDateAndTimeFields();
      setDisableSubmitBtn(true);
      return;
    }

    if (
      serviceablePincodesList &&
      serviceablePincodesList.serviceablePincodes &&
      serviceablePincodesList.serviceablePincodes.includes(
        parseInt(value.trim())
      )
    ) {
      resetDateAndTimeFields();
      setSpinnerActionDispatcher(true);
      getNearbyBranches({
        variables: {
          postcode: value.trim()
        }
      }).then((res) => {
        if (
          res.data.getNearByBranches &&
          res.data.getNearByBranches.items &&
          res.data.getNearByBranches.items.length > 0
        ) {
          setSpinnerActionDispatcher(true);
          setNearbyBranchesByPincodeDispatcher(
            res.data.getNearByBranches.items[0].branches[0]
          );
          getBookingDates({
            variables: {
              transactionType: atCentre
                ? CONSTANT.TRANSACTION_TYPE.PRODUCT_DEMO
                : CONSTANT.TRANSACTION_TYPE.PRODUCT_DEMO_AT_SITE,
              branchId: res.data.getNearByBranches.items[0].branches[0].id,
              itemId:
                testDriveId && selectedTestDriveData
                  ? selectedTestDriveData.dmpl__ItemId__c
                  : modelVariantList.find(
                      (model) => model.value === getValues("modelVarient")
                    ).value,
              daysCount: "5"
            }
          }).then((response) => {
            if (response.data.getBranchDateSlots.items.length > 0) {
              const date =
                response.data.getBranchDateSlots.items[0].bookingDate;
              const dateItems = date.split("-");
              setDateState(
                dateItems[2] + "/" + dateItems[1] + "/" + dateItems[0]
              );
              setValue("date", date);
              handleDateDropdownChange(
                "date",
                date,
                true,
                res.data.getNearByBranches.items[0].branches[0].id
              );
            } else {
              setError("date", {
                type: "custom",
                message: dateField.validationRules.custom.message
              });
              setDisableSubmitBtn(true);
            }
          });
        } else {
          setError("pinCode", {
            type: "custom",
            message: pinCodeField.validationRules.custom.noBranchMsg
          });
        }
      });
      clearErrors("pinCode");
    } else if (
      serviceablePincodesList &&
      serviceablePincodesList.allPincodes &&
      serviceablePincodesList.allPincodes.includes(parseInt(value.trim()))
    ) {
      resetDateAndTimeFields();
      setError("pinCode", {
        type: "custom",
        message: pinCodeField.validationRules.custom.noServiceMsg
      });
    } else {
      resetDateAndTimeFields();
      setError("pinCode", {
        type: "custom",
        message: pinCodeField.validationRules.custom.noCityMatchMsg
      });
    }
  };

  const handleFormSubmit = async (formData) => {
    const atCentre = locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE;
    const selectedVidaCenterReschedule =
      atCentre &&
      testDriveId &&
      getSelectedGroupItem(nearByVidaCentreList, formData.vidaCentre);
    const appointmentData = {
      modelVarient:
        testDriveId && selectedTestDriveData
          ? selectedTestDriveData.dmpl__ItemId__c
          : modelVariantList.find(
              (centre) => centre.value == formData.modelVarient
            ),
      centre: atCentre
        ? testDriveId
          ? selectedVidaCenterReschedule
          : selectedVidaCentre
        : nearbyBranchesByPincode,
      address: atCentre
        ? testDriveId
          ? selectedVidaCenterReschedule.experienceCenterName
          : selectedVidaCentre.experienceCenterName
        : `${formData.building}, ${formData.address}, ${formData.pinCode}`,
      date: formData.date.includes("/")
        ? formatDate(formData.date)
        : formData.date,
      time: bookingTimeSlotList.find((slot) => slot.value === formData.time)
        .label
    };

    try {
      const analyticsModalVariant = {};
      modelVariantList.filter((item) => {
        if (item.value == formData.modelVarient) {
          analyticsModalVariant.name = item.name;
          analyticsModalVariant.sf_id = item.sf_id;
        }
      });
      if (testDriveId) {
        setSpinnerActionDispatcher(true);
        const rescheduleTestDriveResponse = await rescheduleTestDrive({
          variables: {
            SF_Booking_Id: testDriveId,
            dmpl__PartnerAccountId__c: atCentre
              ? selectedTestDriveData.dmpl__PartnerAccountId__c
              : nearbyBranchesByPincode.partnerAccountId,
            dmpl__BranchId__c: atCentre
              ? formData.vidaCentre
              : nearbyBranchesByPincode.id,
            dmpl__ItemId__c: formData.modelVarient,
            dmpl__DemoSlotId__c: formData.time,
            dmpl__DemoDate__c: formData.date.includes("/")
              ? formatDate(formData.date)
              : formData.date,
            dmpl__IsDemoOnsite__c: !atCentre,
            dmpl__DemoAddress__c: atCentre
              ? selectedTestDriveData.dmpl__DemoAddress__c
              : `${formData.building}~ ${formData.address}`,
            dmpl__PostalCode__c: atCentre
              ? selectedTestDriveData.PostalCode__c
              : formData.pinCode
          }
        });

        if (
          rescheduleTestDriveResponse &&
          rescheduleTestDriveResponse.data &&
          rescheduleTestDriveResponse.data.rescheduleTestDrive
        ) {
          if (isAnalyticsEnabled) {
            const location = {
              state: selectedLocationData.state || "",
              city: selectedLocationData.city || "",
              pinCode: formData.pinCode || "",
              country: selectedLocationData.country || ""
            };
            const productDetails = {
              modelVariant: analyticsModalVariant.name,
              modalColor: "",
              productID: analyticsModalVariant.sf_id
            };
            const bookingDetails = {
              testDriveLocation: atCentre ? "Nearby Vida Center" : "At Home",
              vidaCenter: atCentre ? appointmentData.address : "",
              testDriveDate: appointmentData.date,
              testDriveTime: appointmentData.time,
              bookingID: testDriveId,
              bookingStatus: "Test Drive Booking Rescheduled"
            };
            const customLink = {
              name: "Reschedule",
              position: "Bottom",
              type: "Button",
              clickType: "other"
            };
            const additionalPageName = ":Reschedule Appointment";
            const additionalJourneyName = "Reschedule";
            analyticsUtils.trackCtaClick(
              customLink,
              additionalPageName,
              additionalJourneyName
            );
            analyticsUtils.trackTestRideReschedule(
              location,
              productDetails,
              bookingDetails
            );
          }

          goToSuccessPage && goToSuccessPage(appointmentData);
        }
      } else {
        setSpinnerActionDispatcher(true);
        const params = getUtmParams();
        const bookTestDriveResponse = await bookTestDrive({
          variables: {
            dmpl__PartnerAccountId__c: atCentre
              ? selectedVidaCentre.accountpartnerId
              : nearbyBranchesByPincode.partnerAccountId,
            dmpl__BranchId__c: atCentre
              ? formData.vidaCentre
              : nearbyBranchesByPincode.id,
            dmpl__ItemId__c: formData.modelVarient,
            dmpl__DemoSlotId__c: formData.time,
            dmpl__DemoDate__c: formData.date.includes("/")
              ? formatDate(formData.date)
              : formData.date,
            Test_Drive_Geolocation__Longitude__s:
              defaultLocation.lng.toString(),
            Test_Drive_Geolocation__Latitude__s: defaultLocation.lat.toString(),
            Google_Address__c: defaultLocation.address
              ? defaultLocation.address
              : "",
            dmpl__IsDemoOnsite__c: !atCentre,
            dmpl__DemoAddress__c: atCentre
              ? selectedVidaCentre.experienceCenterName
              : `${formData.building}~ ${formData.address}`,
            dmpl__City__c: selectedLocationData.city,
            dmpl__State__c: selectedLocationData.state,
            dmpl__PostalCode__c: atCentre
              ? selectedVidaCentre.postalCode
              : formData.pinCode,
            utm_params: params
          }
        });

        if (
          bookTestDriveResponse &&
          bookTestDriveResponse.data &&
          bookTestDriveResponse.data.bookTestDrive &&
          bookTestDriveResponse.data.bookTestDrive.success
        ) {
          Cookies.set(
            CONSTANT.COOKIE_ACCOUNT_ID,
            bookTestDriveResponse.data.bookTestDrive.account_id,
            {
              expires: appUtils.getConfig("tokenExpirtyInDays"),
              secure: true,
              sameSite: "strict"
            }
          );
          Cookies.set(
            CONSTANT.COOKIE_OPPORTUNITY_ID,
            bookTestDriveResponse.data.bookTestDrive.opportunity_id,
            {
              expires: appUtils.getConfig("tokenExpirtyInDays"),
              secure: true,
              sameSite: "strict"
            }
          );

          if (isAnalyticsEnabled) {
            const location = {
              state: selectedLocationData.state || "",
              city: selectedLocationData.city || "",
              pinCode: formData.pinCode || "",
              country: selectedLocationData.country || ""
            };
            const productDetails = {
              modelVariant: analyticsModalVariant.name,
              modalColor: "",
              productID: analyticsModalVariant.sf_id
            };
            const bookingDetails = {
              testDriveType: "Short Term Test Drive",
              testDriveLocation: atCentre ? "Nearby Vida Center" : "At Home",
              rentDuration: "",
              vidaCenter: atCentre ? appointmentData.address : "",
              testDriveDate: appointmentData.date,
              testDriveTime: appointmentData.time,
              bookingID: bookTestDriveResponse.data.bookTestDrive.id,
              bookingStatus: "Test Drive Booking Completed"
            };
            const customLink = {
              name: "Book Test Drive",
              position: "Bottom",
              type: "Button",
              clickType: "other"
            };
            const additionalPageName = ":Booking Confirmation";
            const additionalJourneyName = "Booking";
            analyticsUtils.trackCtaClick(
              customLink,
              additionalPageName,
              additionalJourneyName
            );
            const order = {
              paymentType: "",
              paymentMethod: "",
              orderStatus: "",
              orderValue: ""
            };
            analyticsUtils.trackTestDriveComplete(
              location,
              productDetails,
              bookingDetails,
              order
            );
          }

          goToSuccessPage && goToSuccessPage(appointmentData);
        }
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const getTestDriveData = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const testDriveData = await getTestDrive({
        variables: {
          SF_id: testDriveId
        }
      });
      if (testDriveData) {
        setSelectedTestDriveData(testDriveData.data.getTestRide);
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const reloadGoogleMap = (lat, lng) => {
    reloadMap(lat, lng);
  };

  useEffect(() => {
    setSpinnerActionDispatcher(true);
    getModelVariantList({
      variables: {
        type_id: "configurable"
      }
    });
    if (testDriveId) {
      getTestDriveData();
    }
    if (
      selectedLocationData &&
      selectedLocationData.state.length > 0 &&
      selectedLocationData.city.length > 0
    ) {
      handleOnSiteChange(CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE);
      if (
        centreValue ||
        (selectedTestDriveData && selectedTestDriveData?.dmpl__ItemId__c)
      ) {
        reloadMap();
      }
    }
  }, [selectedLocationData]);

  useEffect(() => {
    if (isAnalyticsEnabled) {
      const additionalPageName = ":Schedule Appointment";
      const testDriveType = "Short Term Test Drive";
      analyticsUtils.trackTestdrivePageLoad(additionalPageName, testDriveType);
    }
  }, []);

  useEffect(() => {
    if (selectedMapLocation.address) {
      setDefaultLocation(selectedMapLocation);
    }
  }, [selectedMapLocation]);

  useEffect(() => {
    if (selectedVariant) {
      handleModelVarientDropdownChange("modelVarient");
      if (
        locationType &&
        locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.HOME
      ) {
        setValue("pinCode", defaultLocation.pincode);
        checkPincodeServiceAbility("pinCode", defaultLocation.pincode);
      }
    }
  }, [defaultLocation, selectedVariant, locationType]);

  useEffect(() => {
    if (modelVariantList.length > 0 && !testDriveId) {
      setValue("modelVarient", modelVariantList[0].value);
      handleModelVarientDropdownChange("modelVarient");
      const vidaCentre = getFirstVidaCentre();
      if (
        vidaCentre &&
        locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE
      ) {
        //  setSelectedVidaCentre(vidaCentre);
        //  setValue("vidaCentre", vidaCentre.value);
        setDisableVidaCentre(false);
        getBookingDatesList(
          locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE,
          vidaCentre.value,
          true
        );
      }
    }
  }, [modelVariantList, nearByVidaCentreList, locationType]);

  useEffect(() => {
    if (testDriveId && selectedTestDriveData) {
      setValue(
        "site",
        selectedTestDriveData.dmpl__IsDemoOnsite__c
          ? CONSTANT.TEST_DRIVE.LOCATION_TYPE.HOME
          : CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE
      );

      if (selectedTestDriveData.dmpl__IsDemoOnsite__c) {
        setLocationType(CONSTANT.TEST_DRIVE.LOCATION_TYPE.HOME);
        setDisableAtCentreSelection(true);
        setDisablePincode(true);
      } else {
        setLocationType(CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE);
        setDisableAtHomeSelection(true);
        setDisableVidaCentre(true);
      }

      setValue("modelVarient", selectedTestDriveData.dmpl__ItemId__c);

      if (selectedTestDriveData.dmpl__ItemId__c) {
        reloadMap(null, null, selectedTestDriveData.dmpl__ItemId__c);
      }

      if (!selectedTestDriveData.dmpl__IsDemoOnsite__c) {
        setValue("vidaCentre", selectedTestDriveData.dmpl__BranchId__c);
        handleVidaCentreDropdownChange(
          "vidaCentre",
          selectedTestDriveData.dmpl__BranchId__c
        );
      } else {
        const addressData =
          selectedTestDriveData.dmpl__DemoAddress__c.split("~");
        setValue("building", addressData[0] ? addressData[0].trim() : "");
        setValue("address", addressData[1] ? addressData[1].trim() : "");

        if (selectedTestDriveData.PostalCode__c.trim().length > 0) {
          setValue("pinCode", selectedTestDriveData.PostalCode__c.trim());
          checkPincodeServiceAbility(
            "pinCode",
            selectedTestDriveData.PostalCode__c
          );
        } else {
          setValue("pinCode", "");
        }
      }
    }
  }, [selectedTestDriveData]);

  useEffect(() => {
    if (isAnalyticsEnabled && !isOTPVerified && window.location.search === "") {
      const additionalPageName = ":Schedule Appointment";
      const additionalJourneyName = "Booking";
      analyticsUtils.trackPageLoad(additionalPageName, additionalJourneyName);
    }
  }, [isOTPVerified]);

  /* Handler for Mobile */
  const handleMobileMarkerPosition = (latLng) => {
    markerPositionHandler && markerPositionHandler(latLng);
  };

  useEffect(() => {
    // if (selectedMapVidaCentre && selectedMapVidaCentre.id) {
    //   setValue("vidaCentre", selectedMapVidaCentre.value);
    //   modelVariantList.length > 0 &&
    //     handleVidaCentreDropdownChange(
    //       "vidaCentre",
    //       selectedMapVidaCentre,
    //       true
    //     );
    // }
  }, [selectedMapVidaCentre, modelVariantList]);

  const [centreNames, setCentreNames] = useState([]);
  useEffect(() => {
    const centreNameAndPincodes = nearByVidaCentreList
      .map((centre) => {
        const modifiedCentre =
          centre &&
          centre.items &&
          centre.items.filter((item) => {
            if (item["testRideAvailable"]) {
              return true;
            }

            return false;
          });
        return { items: modifiedCentre, type: centre.type };
      })
      .map((centre) => {
        const modifiedCentre =
          centre &&
          centre.items &&
          centre.items.map((item) => {
            if (item["label"] && item["postalCode"]) {
              item["label"] += " - " + item["postalCode"];
            }

            return item;
          });
        return { items: modifiedCentre, type: centre.type };
      });

    setCentreNames(centreNameAndPincodes);
  }, []);

  const handleDealerClick = (id) => {
    if (!testDriveId) {
      setValue("vidaCentre", id.value);
      handleVidaCentreDropdownChange("vidaCentre", id, undefined);
    }
  };
  // dealerList, cityDropdownValue, setNoDealersAvailable, setListOfDealers
  useEffect(() => {
    let dataHandler = false;
    if (testDriveId) {
      if (selectedTestDriveData) {
        dataHandler = true;
      }
    } else {
      dataHandler = true;
    }
    if (dataHandler) {
      const dealerList = centreNames;
      const dealersListItems = [];
      if (dealerList && dealerList.length > 0 && modelVariantList.length > 0) {
        dealerList.map((item) => {
          if (item.type === "Experience Center") {
            item.items.map((x) => {
              if (testDriveId) {
                if (x.id === selectedTestDriveData.dmpl__BranchId__c) {
                  dealersListItems.push(
                    <DealerCard
                      key={x.id}
                      dealer={x}
                      mapIcon={mapIcon}
                      phoneIcon={phoneIcon}
                      className=" vida-dealer-card__dealer--active"
                    />
                  );
                }
              } else {
                dealersListItems.push(
                  <DealerCard
                    key={x.id}
                    dealer={x}
                    mapIcon={mapIcon}
                    phoneIcon={phoneIcon}
                    handleDealerClick={handleDealerClick}
                    className={
                      x.id === selectedVidaCentre.id
                        ? " vida-dealer-card__dealer--active"
                        : ""
                    }
                  />
                );
              }
            });
          }
        });
      }
      if (!dealerList.length) {
        //setNoDealersAvailable(true);
      } else {
        //setNoDealersAvailable(false);
      }

      setListOfDealers(dealersListItems);
    }
  }, [
    centreNames,
    modelVariantList.length,
    selectedTestDriveData,
    selectedVidaCentre
  ]);

  return (
    <>
      <div className="vida-schedule-appointment__title">
        {testDriveId ? rescheduleTitle : scheduleTitle}
      </div>
      <form
        className="form vida-schedule-appointment"
        onSubmit={handleSubmit((formData) => handleFormSubmit(formData))}
      >
        <label className="form__field-label">{locationOptionField.label}</label>
        <div className="form__group form__field-radio-group">
          <div
            className="form__field-radio"
            disabled={disableAtCentreSelection}
          >
            <label className="form__field-label">
              {locationOptionField.optionOne}
              <input
                type="radio"
                name="site"
                value={CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE}
                checked={
                  isAtHomeDisabled
                    ? true
                    : locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE
                }
                disabled={disableAtCentreSelection}
                onChange={(e) => handleOnSiteChange(e.target.value)}
              />
              <span className="form__field-radio-mark"></span>
            </label>
          </div>
          {!isAtHomeDisabled && (
            <div
              className="form__field-radio"
              disabled={disableAtHomeSelection}
            >
              <label className="form__field-label">
                {locationOptionField.optionTwo}
                <input
                  type="radio"
                  name="site"
                  value={CONSTANT.TEST_DRIVE.LOCATION_TYPE.HOME}
                  checked={
                    locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.HOME
                  }
                  disabled={disableAtHomeSelection}
                  onChange={(e) => handleOnSiteChange(e.target.value)}
                />
                <span className="form__field-radio-mark"></span>
              </label>
            </div>
          )}
        </div>

        {!isDesktop && mapData && (
          <div className="vida-schedule-appointment__map">
            <GoogleMaps
              config={mapData}
              onClickHandler={handleMapToVidaCentreSelection}
              markerPositionHandler={handleMobileMarkerPosition}
              setShowInfo={setShowInfo}
              showInfo={isNonPageLoadAction && showInfo}
            />
          </div>
        )}

        {modelVariantList.length > 1 && (
          <Dropdown
            name="modelVarient"
            label={modelVarientField.label}
            iconClass={`icon-scooter`}
            value={
              // (selectedTestDriveData && selectedTestDriveData.dmpl__ItemId__c) ||
              getValues("modelVarient") || ""
            }
            options={
              modelVariantList.length > 0
                ? [...modelVariantList]
                : modelDefaultOption
            }
            setValue={setValue}
            onChangeHandler={handleModelVarientDropdownChange}
            errors={errors}
            validationRules={modelVarientField.validationRules}
            clearErrors={clearErrors}
            register={register}
            isDisabled={testDriveId ? true : false}
          />
        )}
        {locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.CENTRE && (
          <>
            {/* <Dropdown
              name="vidaCentre"
              label={vidaCentreField.label}
              iconClass={`icon-building`}
              options={
                centreNames.length > 0
                  ? [{ label: dropdownDefaultLabel, value: "" }, ...centreNames]
                  : branchDefaultOption
              }
              value={
                (selectedTestDriveData &&
                  selectedTestDriveData.dmpl__BranchId__c) ||
                //getValues("vidaCentre") ||
                centreValue ||
                ""
              }
              setValue={setValue}
              onChangeHandler={handleVidaCentreDropdownChange}
              errors={errors}
              validationRules={vidaCentreField.validationRules}
              clearErrors={clearErrors}
              register={register}
              isDisabled={disableVidaCentre}
              hasGroupedOptions
            /> */}
            <div
              className={
                modelVariantList.length <= 1
                  ? "form vida-booking-details-dealers__listofdealers vida-top-padding"
                  : "form vida-booking-details-dealers__listofdealers"
              }
            >
              {listOfDealers &&
                listOfDealers.length > 0 &&
                listOfDealers.map((dealer) => {
                  return dealer;
                })}
            </div>
          </>
        )}
        {locationType === CONSTANT.TEST_DRIVE.LOCATION_TYPE.HOME && (
          <>
            {selectedVariant && defaultLocation.address && (
              <Wrapper apiKey={apiKey} libraries={["places"]}>
                <AddressLookup
                  defaultLocation={defaultLocation}
                  reloadMap={reloadGoogleMap}
                />
              </Wrapper>
            )}
            <InputField
              name="address"
              label={addressField.label}
              placeholder={addressField.placeholder}
              value=""
              validationRules={addressField.validationRules}
              register={register}
              isDisabled={disablePincode}
              onChangeHandler={handleInputFieldChange}
              errors={errors}
              setValue={setValue}
            />

            <InputField
              name="building"
              label={buildingField.label}
              placeholder={buildingField.placeholder}
              value=""
              validationRules={buildingField.validationRules}
              register={register}
              isDisabled={disablePincode}
              onChangeHandler={handleInputFieldChange}
              errors={errors}
              setValue={setValue}
            />

            <NumberField
              name="pinCode"
              label={pinCodeField.label}
              placeholder={pinCodeField.placeholder}
              value=""
              validationRules={pinCodeField.validationRules}
              register={register}
              errors={errors}
              onChangeHandler={(value) =>
                checkPincodeServiceAbility("pinCode", value)
              }
              isDisabled={disablePincode}
              maxLength={CONSTANT.RESTRICT_PINCODE}
            />
          </>
        )}
        <DateField
          label={dateField.label}
          iconClass={`icon-calendar`}
          value={dateState !== "" ? dateState : ""}
          minDate={bookingDateList.length !== 0 ? bookingDateList[0].label : ""}
          maxDate={
            bookingDateList.length !== 0
              ? bookingDateList[bookingDateList.length - 1].label
              : ""
          }
          name="date"
          placeholder="DD/MM/YYYY"
          control={control}
          errors={errors}
          onChangeHandler={handleDateChange}
          validationRules={dateField.validationRules}
          disabled={bookingDateList.length === 0 ? true : false}
        />

        <Dropdown
          name="time"
          label={timeField.label}
          iconClass={`icon-clock`}
          options={
            bookingTimeSlotList.length > 0
              ? bookingTimeSlotList
              : [
                  {
                    label: "Select Time",
                    value: ""
                  }
                ]
          }
          value={getValues("time") || ""}
          setValue={setValue}
          onChangeHandler={handleTimeChange}
          errors={errors}
          validationRules={timeField.validationRules}
          clearErrors={clearErrors}
          register={register}
          isDisabled={bookingTimeSlotList.length === 0 ? true : false}
        />

        <button
          className="btn btn--primary btn--lg"
          disabled={disableSubmitBtn}
        >
          {testDriveId ? rescheduleSubmitBtn.label : submitBtn.label}
        </button>
      </form>
    </>
  );
};

ScheduleAppointment.propTypes = {
  cmpProps: PropTypes.object,
  config: PropTypes.shape({
    scheduleTitle: PropTypes.string,
    rescheduleTitle: PropTypes.string,
    dropdownDefaultLabel: PropTypes.string,
    locationOptionField: PropTypes.shape({
      label: PropTypes.string,
      optionOne: PropTypes.string,
      optionTwo: PropTypes.string
    }),
    modelVarientField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    vidaCentreField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    dateField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    timeField: PropTypes.shape({
      label: PropTypes.string,
      validationRules: PropTypes.object
    }),
    addressField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    buildingField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    pinCodeField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    submitBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    rescheduleSubmitBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    mapIcon: PropTypes.string,
    phoneIcon: PropTypes.string,
    isAtHomeDisabled: PropTypes.bool
  }),
  goToSuccessPage: PropTypes.func,
  mapData: PropTypes.any,
  testDriveId: PropTypes.string,
  selectedLocationData: PropTypes.object,
  reloadMap: PropTypes.func,
  setTestDrivePlace: PropTypes.func,
  markerPositionHandler: PropTypes.func,
  isOTPVerified: PropTypes.bool,
  selectedMapVidaCentre: PropTypes.object,
  handleMapToVidaCentreSelection: PropTypes.func,
  setIsNonPageLoadAction: PropTypes.func,
  isNonPageLoadAction: PropTypes.bool
};

ScheduleAppointment.defaultProps = {
  cmpProps: {},
  config: {}
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTestDrivePlace: (data) => {
      dispatch(setTestDrivePlaceAction(data));
    }
  };
};

const mapStateToProps = ({ testDriveReducer }) => {
  return {
    cmpProps: {
      selectedMapLocation: testDriveReducer.mapLocation,
      modelVariantList: testDriveReducer.modelVariantList,
      nearByVidaCentreList: testDriveReducer.nearByVidaCentreList,
      nearbyBranchesByPincode: testDriveReducer.nearbyBranchesByPincode,
      bookingDateList: testDriveReducer.bookingDateList,
      bookingTimeSlotList: testDriveReducer.bookingTimeSlotList,
      serviceablePincodesList: testDriveReducer.serviceablePincodesList
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleAppointment);
