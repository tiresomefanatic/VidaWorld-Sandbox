import React from "react";
import PropTypes from "prop-types";
import CONSTANT from "../../../../site/scripts/constant";

const InputField = ({
  name,
  label,
  infoLabel,
  value,
  iconClass,
  placeholder,
  autoFocus,
  validationRules,
  register,
  setValue,
  errors,
  checkEmailFormat,
  checkNameFormat,
  onChangeHandler,
  isDisabled,
  onKeyDown
}) => {
  if (checkEmailFormat && validationRules && validationRules.customValidation) {
    validationRules.customValidation.rules = (val) =>
      CONSTANT.EMAIL_REGEX.test(val);
  }
  if (checkNameFormat && validationRules && validationRules.customValidation) {
    validationRules.customValidation.rules = (val) =>
      CONSTANT.NAME_REGEX.test(val);
  }
  return (
    <div
      className={
        errors[name] ? "form__group form__group--error" : "form__group"
      }
    >
      <label htmlFor={label} className="form__field-label">
        {label}
      </label>

      {iconClass && (
        <i className={`${iconClass}` + `${isDisabled ? " disabled" : ""}`}></i>
      )}

      <input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        className="form__field-input"
        autoFocus={autoFocus}
        autoComplete="off"
        defaultValue={value}
        disabled={isDisabled}
        {...register(name, {
          required: validationRules && "required" in validationRules,
          minLength:
            validationRules &&
            validationRules.minLength &&
            validationRules.minLength.value,
          validate:
            validationRules &&
            validationRules.customValidation &&
            validationRules.customValidation.rules,
          onBlur: (e) => (e.target.value = e.target.value.trim()),
          setValueAs: (val) => val.trim(),
          onChange: (e) => {
            onChangeHandler && onChangeHandler(name, e.target.value);
            setValue && setValue(name, e.target.value);
          }
        })}
        onKeyDown={onKeyDown}
      />
      {infoLabel && name === "email" && (
        <>
          <p className="form__field-info">{infoLabel}</p>
        </>
      )}
      {errors[name] && errors[name].type === "required" && (
        <>
          <p className="form__field-message">
            {validationRules &&
              validationRules.required &&
              validationRules.required.message}
          </p>
        </>
      )}
      {errors[name] && errors[name].type === "minLength" && (
        <>
          <p className="form__field-message">
            {validationRules &&
              validationRules.minLength &&
              validationRules.minLength.message}
          </p>
        </>
      )}
      {errors[name] && errors[name].type === "custom" && (
        <>
          <p className="form__field-message">
            {errors[name] && errors[name].message}
          </p>
        </>
      )}
      {errors[name] && errors[name].type === "validate" && (
        <>
          <p className="form__field-message">
            {validationRules &&
              validationRules.customValidation &&
              validationRules.customValidation.message}
          </p>
        </>
      )}
    </div>
  );
};

InputField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  infoLabel: PropTypes.string,
  iconClass: PropTypes.string,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  register: PropTypes.func,
  setValue: PropTypes.func,
  onChangeHandler: PropTypes.func,
  isDisabled: PropTypes.bool,
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
    custom: PropTypes.shape({
      value: PropTypes.number,
      message: PropTypes.string
    }),
    customValidation: PropTypes.shape({
      rules: PropTypes.func,
      message: PropTypes.string,
      inValidAadharMessage: PropTypes.string
    })
  }),
  checkEmailFormat: PropTypes.bool,
  checkNameFormat: PropTypes.bool,
  onKeyDown: PropTypes.func
};

InputField.defaultProps = {
  name: "",
  label: "",
  value: "",
  placeholder: "",
  autoFocus: false,
  validationRule: {},
  checkEmailFormat: false,
  checkNameFormat: false
};

export default InputField;
