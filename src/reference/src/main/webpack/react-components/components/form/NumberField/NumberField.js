import React from "react";
import PropTypes from "prop-types";

const NumberField = ({
  name,
  label,
  value,
  iconClass,
  placeholder,
  autoFocus,
  validationRules,
  register,
  setValue,
  errors,
  onChangeHandler,
  maxLength,
  isDisabled
}) => {
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
        type="number"
        placeholder={placeholder}
        className="form__field-input"
        autoFocus={autoFocus}
        defaultValue={value}
        disabled={isDisabled}
        onWheel={(e) => e.target.blur()}
        min="0"
        {...register(name, {
          required: validationRules && "required" in validationRules,
          minLength:
            validationRules &&
            validationRules.minLength &&
            validationRules.minLength.value,
          maxLength:
            validationRules &&
            validationRules.maxLength &&
            validationRules.maxLength.value,
          validate:
            validationRules &&
            validationRules.customValidation &&
            validationRules.customValidation.rules
          //setValueAs: (val) => parseInt(val)
        })}
        onChange={(e) => onChangeHandler && onChangeHandler(e.target.value)}
        onInput={(e) => {
          e.target.value = e.target.value.trim().slice(0, maxLength);
          setValue && setValue(name, e.target.value);
        }}
      />
      {errors[name] && errors[name].type === "required" && (
        <>
          <p className="form__field-message">
            {validationRules.required && validationRules.required.message}
          </p>
        </>
      )}
      {errors[name] && errors[name].type === "minLength" && (
        <>
          <p className="form__field-message">
            {validationRules.minLength && validationRules.minLength.message}
          </p>
        </>
      )}
      {errors[name] && errors[name].type === "maxLength" && (
        <>
          <p className="form__field-message">
            {validationRules.maxLength && validationRules.maxLength.message}
          </p>
        </>
      )}
      {errors[name] &&
        (errors[name].type === "customValidation" ||
          errors[name].type === "validate") && (
          <>
            <p className="form__field-message">
              {validationRules.customValidation &&
                validationRules.customValidation.message}
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
    </div>
  );
};

NumberField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
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
    minVal: PropTypes.shape({
      value: PropTypes.number,
      message: PropTypes.string
    }),
    maxVal: PropTypes.shape({
      value: PropTypes.number,
      message: PropTypes.string
    }),
    customValidation: PropTypes.shape({
      rules: PropTypes.func,
      message: PropTypes.string
    })
  }),
  maxLength: PropTypes.number
};

NumberField.defaultProps = {
  name: "",
  label: "",
  value: "",
  placeholder: "",
  autoFocus: false,
  validationRule: {}
};

export default NumberField;
