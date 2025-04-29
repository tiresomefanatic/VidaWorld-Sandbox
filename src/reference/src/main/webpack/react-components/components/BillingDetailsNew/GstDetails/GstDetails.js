import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useVerifyGST } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import InputField from "../../form/InputField/InputField";
import { useForm } from "react-hook-form";
import {
  setGstDataDispatcher,
  setAddressDataDispatcher
} from "../../../store/purchaseConfig/purchaseConfigActions";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import CONSTANT from "../../../../site/scripts/constant";

const GstDetails = (props) => {
  const { gstConfig, setShowGstPopup } = props;
  const gstDetails = props.gstData;
  const { gstNumberField, backLabel, confirmLabel } = gstConfig;
  const [showGSTDetail, setShowGSTDetail] = useState(true);
  const [showChangeGST, setShowChange] = useState(false);
  const getGstDetails = useVerifyGST();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    setFocus,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: "onClick",
    reValidateMode: "onChange"
  });

  const resetGSTFields = () => {
    reset({
      gstnumber: "",
      companyname: "",
      email: ""
    });
    setShowChange(false);
    // setGstDataDispatcher({
    //   gstNumber: "",
    //   companyName: "",
    //   companyEmail: ""
    // });
  };
  const handleGSTSubmit = async (formData) => {
    setSpinnerActionDispatcher(true);
    const result = await getGstDetails({
      variables: {
        gstin: formData.gstnumber,
        order_id: props.cmpProps.order.orderId
      }
    });
    if (result) {
      const gstData = {
        gstSelected: true,
        gstNumber: formData.gstnumber
      };
      if (result.data && result.data.VerifyGst) {
        if (result.data.VerifyGst.legalNameOfBusiness) {
          setValue("companyname", result.data.VerifyGst.legalNameOfBusiness);
          gstData["companyName"] = result.data.VerifyGst.legalNameOfBusiness;
        }
        if (result.data.VerifyGst.email) {
          setValue("email", result.data.VerifyGst.email);
          gstData["companyEmail"] = result.data.VerifyGst.email;
        }
        const address = {
          billingAddresses: {
            addressLine1: result.data.VerifyGst.address_line1,
            addressLine2: result.data.VerifyGst.address_line2,
            addressLandmark: result.data.VerifyGst.address_landmark,
            pincode: result.data.VerifyGst.pincode,
            city: result.data.VerifyGst.city,
            state: result.data.VerifyGst.state
          }
        };
        setGstDataDispatcher(gstData);
        setAddressDataDispatcher(address);
        setShowChange(true);
        setShowGstPopup(false);
      } else {
        reset({ gstnumber: "" });
        setShowChange(false);
      }
    }
    //setShowChange(true);
  };

  const onChangeGst = (e) => {
    e.preventDefault();
    resetGSTFields();
  };

  useEffect(() => {
    if (gstDetails.gstSelected) {
      setShowGSTDetail(gstDetails.gstSelected);
      setShowChange(gstDetails.gstSelected);
      setValue("gstnumber", gstDetails.gstNumber);
      setValue("companyname", gstDetails.companyName);
      setValue("email", gstDetails.companyEmail);
    }
  }, []);

  const handleGST = (name, value) => {
    const [gstnumber, companyname, email] = getValues([
      "gstnumber",
      "companyname",
      "email"
    ]);
    if ((value && value.length === 0) || gstnumber.length === 0) {
      setError("gstnumber", { type: "required" });
      setFocus("gstnumber");
    } else {
      clearErrors("gstnumber");
    }

    if ((value && value.length > 0) || gstnumber.length > 0) {
      if (!companyname) {
        setError("gstnumber", {
          type: "custom",
          message: gstNumberField.validationRules.custom.message
        });
        setFocus("gstnumber");
      } else {
        clearErrors("gstnumber");
      }
    }

    if (email && email.length > 0 && !CONSTANT.EMAIL_REGEX.test(email)) {
      setError("email", { type: "validate" });
      setFocus("email");
    } else {
      clearErrors("email");
    }
    props.handleGSTError(false);
  };

  useEffect(() => {
    props.showGSTError && handleGST();
  }, [props.showGSTError]);

  return (
    <div className="vida-gst-details">
      {showGSTDetail && (
        <form>
          <div className="vida-gst-details__gst-number">
            <InputField
              name="gstnumber"
              label={gstNumberField.label}
              placeholder={gstNumberField.placeholder}
              validationRules={gstNumberField.validationRules}
              register={register}
              errors={errors}
              onChangeHandler={handleGST}
              isDisabled={showChangeGST}
              setValue={setValue}
            />
            <div className="vida-gst-details__change-gst">
              {showChangeGST ? (
                <a
                  href=""
                  onClick={(e) => {
                    onChangeGst(e);
                  }}
                >
                  {gstNumberField.changeGstLabel}
                </a>
              ) : (
                ""
              )}
            </div>
          </div>
        </form>
      )}
      <div className="vida-gst-details__btn-container">
        <button
          className="btn btn--secondary"
          onClick={(event) => setShowGstPopup(false)}
        >
          {backLabel}
        </button>
        <button
          className="btn btn--primary"
          onClick={handleSubmit((formData) => handleGSTSubmit(formData))}
          disabled={showChangeGST}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
};
GstDetails.propTypes = {
  showGSTError: PropTypes.bool,
  handleGSTError: PropTypes.func,
  setShowGstPopup: PropTypes.func,
  gstData: PropTypes.object,
  //gstEmailValidtion: PropTypes.bool,
  cmpProps: PropTypes.object,
  gstConfig: PropTypes.object
};
GstDetails.defaultProps = {
  gstConfig: {}
};

const mapStateToProps = ({ purchaseConfigReducer }) => {
  return {
    cmpProps: {
      order: purchaseConfigReducer.order
    }
  };
};

export default connect(mapStateToProps)(GstDetails);
