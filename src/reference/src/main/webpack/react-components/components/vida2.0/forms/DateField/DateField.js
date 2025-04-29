import React, { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import transition from "react-element-popper/animations/transition";
import opacity from "react-element-popper/animations/opacity";
import PropTypes from "prop-types";
import breakpoints from "../../../../../site/scripts/media-breakpoints";

const DateField = ({
  label,
  name,
  value,
  iconClass,
  control,
  errors,
  validationRules,
  hideYear,
  hideMonth,
  minDate,
  maxDate,
  placeholder,
  disabled,
  onChangeHandler
}) => {
  const datePickerRef = useRef();
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const changeHandler = (dateChanged) => {
    onChangeHandler && onChangeHandler(dateChanged);
  };

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const isTablet = window.matchMedia(
    breakpoints.mediaExpression.tablet
  ).matches;

  useEffect(() => {
    if (!isDesktop && datePickerRef.current) {
      const dateInput = datePickerRef.current.children[0];
      // dateInput.classList.add("vida-form-field-input");
      const drawer = document.querySelector(".drawer__body");
      dateInput.addEventListener("click", () => {
        drawer.style.maxHeight = "unset";
        if (!isTablet) {
          drawer.style.height = "430px";
        } else {
          drawer.style.height = "450px";
        }
      });
    }
  }, [datePickerRef.current]);

  return (
    <div
      className={`form__group form__group--datepicker ${
        errors[name] ? "form__group--error" : ""
      }`}
    >
      <label htmlFor={label} className="form__field-label">
        {label}
      </label>

      {iconClass && (
        <i className={`${iconClass}` + `${disabled ? " disabled" : ""}`}></i>
      )}

      <Controller
        control={control}
        name={name}
        value={value}
        rules={{ required: true }}
        render={({ field: { onChange, name } }) => {
          return (
            <DatePicker
              id={name}
              value={value ? value : ""}
              minDate={minDate}
              maxDate={maxDate}
              placeholder={placeholder}
              ref={datePickerRef}
              weekDays={weekDays}
              className="custom-date-picker"
              hideYear={hideYear}
              hideMonth={hideMonth}
              weekStartDayIndex={1}
              format="DD/MM/YYYY"
              disabled={disabled}
              editable={false}
              onChange={(date) => {
                onChange(date && date.isValid ? date.format() : "");
                date && date.isValid ? changeHandler(date.format()) : "";
              }}
              animations={[
                opacity(),
                transition({
                  from: 40,
                  transition:
                    "all 400ms cubic-bezier(0.335, 0.010, 0.030, 1.360)"
                })
              ]}
            />
          );
        }}
      />
      {errors[name] && errors[name].type === "required" && (
        <>
          <p className="form__field-message">
            {validationRules.required && validationRules.required.message}
          </p>
        </>
      )}
      {errors && errors[name] && errors[name].type === "custom" && (
        <>
          <p className="form__field-message">
            {errors && errors[name] && errors[name].message}
          </p>
        </>
      )}
    </div>
  );
};

DateField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  iconClass: PropTypes.string,
  hideYear: PropTypes.bool,
  hideMonth: PropTypes.bool,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  control: PropTypes.any,
  placeholder: PropTypes.string,
  errors: PropTypes.shape({}),
  disabled: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  validationRules: PropTypes.shape({
    required: PropTypes.shape({
      message: PropTypes.string
    })
  })
};

DateField.defaultProps = {
  label: "",
  hideYear: false,
  hideMonth: false,
  value: "",
  minDate: "",
  maxDate: "",
  disabled: false
};

export default DateField;
