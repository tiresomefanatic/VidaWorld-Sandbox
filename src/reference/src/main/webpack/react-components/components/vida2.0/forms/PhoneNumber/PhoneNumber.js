import React from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../../site/scripts/utils/appUtils";

const PhoneNumber = ({
  label,
  fieldNames,
  values,
  placeholder,
  validationRules,
  inputFocusHandler,
  register,
  errors,
  maxLength,
  isDisabled,
  showOtpFieldHandler
}) => {
  // const { inputFieldName, selectFieldName } = fieldNames;
  const { inputFieldName } = fieldNames;
  const phNumberStartsWith = appUtils.getConfig("phNumberStartsWith");
  const phNumberLength = appUtils.getConfig("phNumberLength");

  return (
    <div
      className={
        errors[inputFieldName]
          ? "vida-form-group form__group--error"
          : "vida-form-group"
      }
    >
      <label className="form__field-label" htmlFor={label}>
        {label}
      </label>
      <div className="form__field-mobile">
        {/* <div
          className={`form__field-select-wrapper ${
            isDisabled ? "disabled" : ""
          }`}
        >
          <select
            id={selectFieldName}
            name={selectFieldName}
            defaultValue={values.code}
            className="form__field-select"
            {...register(selectFieldName, { disabled: true })}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div> */}
        <input
          id={inputFieldName}
          name={inputFieldName}
          defaultValue={values.number}
          type="number"
          placeholder={placeholder}
          className="vida-form-field-input"
          disabled={isDisabled}
          onWheel={(e) => e.target.blur()}
          min="0"
          {...register(inputFieldName, {
            required: validationRules && "required" in validationRules,
            minLength: validationRules?.minLength?.value,
            maxLength: validationRules?.maxLength?.value,
            validate: (value) =>
              value && phNumberStartsWith.includes(value.charAt(0))
          })}
          onFocus={(e) => {
            return inputFocusHandler && inputFocusHandler(e.target.value);
          }}
          onInput={(e) => {
            e.target.value = e.target.value.trim().slice(0, maxLength);
            if (e.target.value.length === phNumberLength) {
              showOtpFieldHandler && showOtpFieldHandler(true);
            } else {
              showOtpFieldHandler && showOtpFieldHandler(false);
            }
          }}
        />
      </div>
      {errors[inputFieldName] && errors[inputFieldName].type === "required" && (
        <>
          <p className="form__field-message">
            {validationRules?.required?.message}
          </p>
        </>
      )}
      {errors[inputFieldName] && errors[inputFieldName].type === "minLength" && (
        <>
          <p className="form__field-message">
            {validationRules?.minLength?.message}
          </p>
        </>
      )}
      {errors[inputFieldName] && errors[inputFieldName].type === "maxLength" && (
        <>
          <p className="form__field-message">
            {validationRules?.maxLength?.message}
          </p>
        </>
      )}
      {errors[inputFieldName] && errors[inputFieldName].type === "validate" && (
        <>
          <p className="form__field-message">
            {validationRules?.customValidation?.message}
          </p>
        </>
      )}
      {errors[inputFieldName] && errors[inputFieldName].type === "custom" && (
        <>
          <p className="form__field-message">
            {errors[inputFieldName] && errors[inputFieldName].message}
          </p>
        </>
      )}
    </div>
  );
};

PhoneNumber.propTypes = {
  label: PropTypes.string,
  fieldNames: PropTypes.shape({
    inputFieldName: PropTypes.string,
    selectFieldName: PropTypes.string
  }),
  values: PropTypes.shape({
    code: PropTypes.string,
    number: PropTypes.string
  }),
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ),
  register: PropTypes.func,
  errors: PropTypes.shape({}),
  validationRules: PropTypes.shape({
    required: PropTypes.shape({
      message: PropTypes.string
    }),
    minLength: PropTypes.shape({
      value: PropTypes.number,
      message: PropTypes.string
    }),
    maxLength: PropTypes.shape({
      value: PropTypes.number,
      message: PropTypes.string
    }),
    customValidation: PropTypes.shape({
      rules: PropTypes.func,
      message: PropTypes.string
    })
  }),
  inputFocusHandler: PropTypes.func,
  isDisabled: PropTypes.bool,
  maxLength: PropTypes.number,
  showOtpFieldHandler: PropTypes.func
};

PhoneNumber.defaultProps = {
  label: "",
  placeholder: "",
  values: {},
  options: [],
  validationRule: {}
};

export default PhoneNumber;
