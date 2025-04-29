import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  getSelectedGroupItem,
  debounce
} from "../../../../site/scripts/helper";
import appUtils from "../../../../site/scripts/utils/appUtils.js";
const { minSearchCharacter, noResultMessage, debounceTime } =
  appUtils.getConfig("dropDown");

const Dropdown = ({
  name,
  label,
  iconClass,
  value,
  options,
  setValue,
  onChangeHandler,
  errors,
  validationRules,
  clearErrors,
  register,
  isDisabled,
  hasGroupedOptions,
  searchable = true,
  isAutocomplete = false,
  minSearchChar = minSearchCharacter,
  isSortAsc = false
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const searchRef = useRef();
  const [filteredOptions, setFilteredOptions] = useState([]);
  let listRef = null;
  let focusedIndex = 0;
  let totalListElement = 0;
  let isKeyupFocusLost = false;

  const sortOptions = (options) => {
    const selectItem = options.filter((item) => !item.value && item.label);
    let results = options.filter((item) => item.value);
    if (options.length > 1) {
      results = [
        ...results.sort((a, b) => {
          if (a.type && b.type) {
            return a.type.toLowerCase().localeCompare(b.type.toLowerCase());
          } else if (a.label && b.label) {
            return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
          }
        })
      ];
    }
    return [...selectItem, ...results];
  };

  const handleOptionSelect = (option, type) => {
    if (option.value.length > 0) {
      clearErrors && clearErrors(name);
    }

    searchRef.current.value = option.label;
    searchRef.current.placeholder = option.label;
    setValue(name, option.value);
    setShowOptions(false);
    if (searchable) {
      !isSortAsc
        ? setFilteredOptions(options)
        : setFilteredOptions(sortOptions(options));
    }
    type && type.length > 0
      ? onChangeHandler && onChangeHandler(name, option)
      : onChangeHandler && onChangeHandler(name, option.value);
  };

  useEffect(() => {
    function handleClick(event) {
      {
        const inputEle = document.querySelector(
          "#search" + name + ".form__dropdown-input"
        );

        if (
          inputEle &&
          inputEle.getAttribute("id") !== event.target.getAttribute("id")
        ) {
          setShowOptions(false);
        }
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (value) {
      setValue(name, value);
    } else {
      setValue(name, "");
    }

    if (value && options.length >= 1 && !hasGroupedOptions) {
      const obj = options.find((option) => option.value === value);
      searchRef.current.value = obj ? obj.label : "";
      searchRef.current.placeholder = searchRef.current.value;
    } else if (value && options.length > 1 && hasGroupedOptions) {
      searchRef.current.value = getSelectedGroupItem(options, value).label;
      searchRef.current.placeholder = searchRef.current.value;
    } else if (value && options.length === 1) {
      searchRef.current.value = value;
    } else {
      searchRef.current.value = options[0].label;
      searchRef.current.placeholder = searchRef.current.value;
    }
  }, [value, options]);

  useEffect(() => {
    !isSortAsc
      ? setFilteredOptions(options)
      : setFilteredOptions(sortOptions(options));
  }, [options]);

  const searchRecords = ({ value = "" }) => {
    value = value.trim();
    if (value.length < minSearchChar) {
      !isSortAsc
        ? setFilteredOptions(options)
        : setFilteredOptions(sortOptions(options));
      return;
    }

    let filteredData = [];
    if (hasGroupedOptions) {
      options.forEach((record) => {
        const { items = null, value: selectValue, type = null } = record;
        if (!type && selectValue.length === 0) {
          return;
        }
        const filteredList = items.filter(({ label }) =>
          label.toLowerCase().includes(value.toLowerCase())
        );
        if (filteredList.length > 0) {
          filteredData.push({
            ...record,
            items: filteredList
          });
        }
      });
    } else {
      filteredData = options.filter(({ label, value: selectValue }) => {
        if (selectValue.length === 0) {
          return false;
        }
        return label.toLowerCase().includes(value.toLowerCase());
      });
    }
    !isSortAsc
      ? setFilteredOptions(filteredData)
      : setFilteredOptions(sortOptions(filteredData));
  };

  useEffect(() => {
    if (!showOptions) {
      searchRef.current.value = searchRef.current.placeholder;
    }
  }, [showOptions]);

  const handleFocus = ({ keyCode }, isSearchBox) => {
    if (keyCode === 27) {
      return;
    }
    !showOptions && setShowOptions(true);
    isKeyupFocusLost = true;
    if (!listRef) {
      listRef = document.querySelectorAll("#dropdownOptions li");
      totalListElement = listRef.length - 1;
    }

    totalListElement = listRef.length - 1;
    if (keyCode === 40 && isSearchBox) {
      listRef[0].firstChild.focus();
      return;
    }

    if (keyCode === 40) {
      focusedIndex = focusedIndex >= totalListElement ? 0 : ++focusedIndex;
      listRef[focusedIndex].firstChild.focus();
    } else if (keyCode === 38) {
      focusedIndex = focusedIndex <= 0 ? totalListElement : --focusedIndex;
      listRef[focusedIndex].firstChild.focus();
    }
  };

  const getPlaceHolderText = () => {
    if (value && options.length > 1 && hasGroupedOptions) {
      return getSelectedGroupItem(options, value).label;
    }
    return options.length > 0 ? value || options[0].label : "";
  };

  return (
    <div
      className={
        errors && errors[name]
          ? "form__group form__group--error"
          : "form__group"
      }
    >
      {label.length > 0 && (
        <label htmlFor={label} className="form__field-label">
          {label}
        </label>
      )}

      <div className="form__dropdown-field">
        {iconClass && (
          <i
            className={
              `form__dropdown-pre-icon ${iconClass}` +
              `${isDisabled ? " disabled" : ""}`
            }
          ></i>
        )}

        <input
          id={"search" + name}
          name={"search" + name}
          type="text"
          autoComplete="off"
          className="form__field-input form__dropdown-input"
          defaultValue={value}
          ref={searchRef}
          placeholder={getPlaceHolderText()}
          disabled={isDisabled}
          readOnly={searchable ? null : true}
          onFocus={() => {
            setShowOptions(true);
            if (searchable) {
              searchRef.current.value = "";
              searchRecords({});
            }
          }}
          onBlur={() => {
            if (searchable && !isKeyupFocusLost) {
              searchRef.current.value = searchRef.current.placeholder;
            }
            isKeyupFocusLost = false;
          }}
          onKeyUp={(e) => handleFocus(e, true)}
          onChange={debounce(
            ({ target }) => searchRecords(target),
            debounceTime
          )}
        />
        <input
          id={name}
          name={name}
          type="hidden"
          defaultValue={value}
          {...register(name, {
            required: validationRules && "required" in validationRules
          })}
        />
        {/* )} */}

        {!isAutocomplete ? (
          <i
            className={
              showOptions
                ? "icon-chevron form__dropdown-icon form__dropdown-icon--open"
                : "icon-chevron form__dropdown-icon"
            }
          ></i>
        ) : (
          <i className="icon-search form__dropdown-icon"></i>
        )}
      </div>

      {showOptions && (
        <div className="form__dropdown-options-wrapper">
          <ul
            className="form__dropdown-options"
            id="dropdownOptions"
            onKeyUp={(e) => handleFocus(e)}
          >
            {filteredOptions.length === 0 && (
              <li className="form__dropdown-option-empty-message">
                {noResultMessage}
              </li>
            )}
            {filteredOptions && hasGroupedOptions
              ? filteredOptions.map((group) =>
                  group.type ? (
                    group.items.length > 0 ? (
                      <ul key={group.type} className="form__dropdown-group">
                        <div className="form__dropdown-group-label">
                          {group.type}
                        </div>
                        {group.items
                          .sort((a, b) =>
                            a.label
                              .toLowerCase()
                              .localeCompare(b.label.toLowerCase())
                          )
                          .map((item) => (
                            <li
                              key={item.value}
                              className="form__dropdown-option"
                              onClick={() =>
                                handleOptionSelect(item, group.type)
                              }
                            >
                              <a
                                href="#"
                                onClick={(event) => event.preventDefault()}
                              >
                                {item.label}
                              </a>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      ""
                    )
                  ) : (
                    <li
                      key={group.value}
                      className="form__dropdown-option"
                      onClick={() => handleOptionSelect(group)}
                    >
                      <a href="#" onClick={(event) => event.preventDefault()}>
                        {group.label}
                      </a>
                    </li>
                  )
                )
              : filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className="form__dropdown-option"
                    onClick={() => handleOptionSelect(option)}
                  >
                    <a href="#" onClick={(event) => event.preventDefault()}>
                      {option.label}
                    </a>
                  </li>
                ))}
          </ul>
        </div>
      )}

      {errors && errors[name] && errors[name].type === "required" && (
        <>
          <p className="form__field-message">
            {validationRules &&
              validationRules.required &&
              validationRules.required.message}
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

Dropdown.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  iconClass: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ),
  value: PropTypes.string,
  setValue: PropTypes.func,
  isSortAsc: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  errors: PropTypes.shape({}),
  validationRules: PropTypes.shape({
    required: PropTypes.shape({
      message: PropTypes.string
    }),
    customValidation: PropTypes.shape({
      rules: PropTypes.func,
      message: PropTypes.string
    })
  }),
  clearErrors: PropTypes.func,
  register: PropTypes.func,
  isDisabled: PropTypes.bool,
  hasGroupedOptions: PropTypes.bool,
  searchable: PropTypes.bool,
  isAutocomplete: PropTypes.bool,
  minSearchChar: PropTypes.number
};

Dropdown.defaultProps = {
  name: "",
  label: "",
  options: []
};

export default Dropdown;
