import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useVerifyGST } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import InputField from "../../form/InputField/InputField";
import { useForm } from "react-hook-form";
import { setGstDataDispatcher } from "../../../store/purchaseConfig/purchaseConfigActions";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import CONSTANT from "../../../../site/scripts/constant";

const GstDetails = (props) => {
  const { gstConfig } = props;
  const gstDetails = props.gstData;
  const { message, title, yesBtn, noBtn, cardDetails } = gstConfig;
  const [showGSTDetail, setShowGSTDetail] = useState(false);
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

  const handleRadioBtn = (val) => {
    if (val === "yes") {
      setGstDataDispatcher({ gstSelected: true });
      setShowGSTDetail(true);
    } else {
      setGstDataDispatcher({ gstSelected: false });
      setShowGSTDetail(false);
    }
  };

  const resetGSTFields = () => {
    reset({
      gstnumber: "",
      companyname: "",
      email: ""
    });
    setShowChange(false);
    setGstDataDispatcher({
      gstNumber: "",
      companyName: "",
      companyEmail: ""
    });
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
        setGstDataDispatcher(gstData);
        setShowChange(true);
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

  const handleGSTEmailChange = (name, value) => {
    clearErrors("email");
    setGstDataDispatcher({ companyEmail: value });
  };

  const handleUncheckGSTSelect = () => {
    resetGSTFields();
    setGstDataDispatcher({
      gstSelected: false
    });
  };

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
          message: cardDetails.gstNumberField.validationRules.custom.message
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
      <div>
        <h1 className="vida-gst-details__title">{title}</h1>
      </div>
      <div className="vida-gst-details__message">
        <p>{message}</p>
      </div>
      <div
        className="form__group form__field-radio-btn-group vida-gst-details__radio-btn"
        onClick={(e) => handleRadioBtn(e.target.value)}
      >
        <div className="form__field-radio-btn">
          <label className="form__field-label">
            {noBtn.label}
            <input
              type="radio"
              name="gst"
              value="no"
              defaultChecked={gstDetails.gstNumber === "" || true}
              onClick={() => {
                handleUncheckGSTSelect();
              }}
            ></input>
            <span className="form__field-radio-btn-mark"></span>
          </label>
        </div>
        <div className="form__field-radio-btn">
          <label className="form__field-label">
            {yesBtn.label}
            <input
              type="radio"
              name="gst"
              value="yes"
              defaultChecked={gstDetails.gstNumber !== "" || false}
            ></input>
            <span className="form__field-radio-btn-mark"></span>
          </label>
        </div>
      </div>
      {showGSTDetail && (
        <div className="vida-gst-details__business-card">
          <div>
            <h4 className="vida-gst-details__details-label">
              {cardDetails.label}
            </h4>
          </div>
          <form>
            <div className="vida-gst-details__gst-number">
              <InputField
                name="gstnumber"
                label={cardDetails.gstNumberField.label}
                placeholder={cardDetails.gstNumberField.placeholder}
                validationRules={cardDetails.gstNumberField.validationRules}
                register={register}
                errors={errors}
                onChangeHandler={handleGST}
                isDisabled={showChangeGST}
                setValue={setValue}
              />
            </div>
            <div className="vida-gst-details__change-gst">
              {showChangeGST ? (
                <a
                  href=""
                  onClick={(e) => {
                    onChangeGst(e);
                  }}
                >
                  {cardDetails.gstNumberField.changeGstLabel}
                </a>
              ) : (
                <a
                  href="#"
                  type="submit"
                  onClick={handleSubmit((formData) =>
                    handleGSTSubmit(formData)
                  )}
                >
                  {cardDetails.gstNumberField.verifyGstLabel}
                </a>
              )}
            </div>
            {showChangeGST && (
              <>
                <InputField
                  name="companyname"
                  label={cardDetails.companyField.label}
                  placeholder={cardDetails.companyField.placeholder}
                  // validationRules={pinCodeField.validationRules}
                  register={register}
                  errors={errors}
                  isDisabled={true}
                  setValue={setValue}
                />
                <InputField
                  name="email"
                  value={gstDetails.companyEmail}
                  label={cardDetails.companyEmailField.label}
                  placeholder={cardDetails.companyEmailField.placeholder}
                  validationRules={
                    cardDetails.companyEmailField.validationRules
                  }
                  onChangeHandler={handleGSTEmailChange}
                  checkEmailFormat
                  // isDisabled={true}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                />
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
GstDetails.propTypes = {
  showGSTError: PropTypes.bool,
  handleGSTError: PropTypes.func,
  gstData: PropTypes.object,
  //gstEmailValidtion: PropTypes.bool,
  cmpProps: PropTypes.object,
  gstConfig: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    yesBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    noBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    cardDetails: PropTypes.shape({
      label: PropTypes.string,
      gstNumberField: PropTypes.shape({
        label: PropTypes.string,
        placeholder: PropTypes.string,
        changeGstLabel: PropTypes.string,
        verifyGstLabel: PropTypes.string,
        validationRules: PropTypes.object
      }),
      companyField: PropTypes.shape({
        label: PropTypes.string,
        placeholder: PropTypes.string
      }),
      companyEmailField: PropTypes.shape({
        label: PropTypes.string,
        placeholder: PropTypes.string,
        validationRules: PropTypes.object
      })
    })
  })
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
