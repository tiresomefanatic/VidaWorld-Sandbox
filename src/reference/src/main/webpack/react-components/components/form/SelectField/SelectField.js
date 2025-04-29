import React from "react";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";

const SelectField = ({
  name,
  label,
  value,
  iconClass,
  options,
  isDisabled,
  validationRules,
  onChangeHandler,
  control,
  errors
}) => {
  const changeHandler = (name, value) => {
    onChangeHandler && onChangeHandler(name, value);
  };

  return (
    <div
      className={
        errors[name] ? "form__group form__group--error" : "form__group"
      }
    >
      <label htmlFor={label} className="form__field-label">
        {label}
      </label>
      <div
        className={`form__field-select-wrapper ${isDisabled ? "disabled" : ""}`}
      >
        {iconClass && (
          <i
            className={`${iconClass}` + `${isDisabled ? " disabled" : ""}`}
          ></i>
        )}
        <Controller
          control={control}
          name={name}
          defaultValue={value}
          rules={{
            required: validationRules && "required" in validationRules
          }}
          render={({ field }) => (
            <select
              id={name}
              className="form__field-select"
              disabled={isDisabled}
              {...field}
              onChange={(e) => {
                field.onChange(e.target.value);
                changeHandler(name, e.target.value);
              }}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>
      {errors[name] && errors[name].type === "required" && (
        <>
          <p className="form__field-message">
            {validationRules.required && validationRules.required.message}
          </p>
        </>
      )}
      {errors[name] && errors[name].type === "custom" && (
        <>
          <span className="form__field-icon">
            <i className="icon-exclamation-circle"></i>
          </span>
          <p className="form__field-message">
            {errors[name] && errors[name].message}
          </p>
        </>
      )}
    </div>
  );
};

SelectField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ),
  value: PropTypes.string,
  iconClass: PropTypes.string,
  isDisabled: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  register: PropTypes.func,
  control: PropTypes.any,
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
  })
};

SelectField.defaultProps = {
  name: "",
  label: "",
  options: []
};

export default SelectField;
