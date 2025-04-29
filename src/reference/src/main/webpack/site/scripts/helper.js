import appUtils from "./utils/appUtils";

const formToJSON = (elements) =>
  [].reduce.call(
    elements,
    (data, element) => {
      if (element.type != "submit") {
        data[element.name] = element.value;
      }
      return data;
    },
    {}
  );

export { formToJSON };

export const camelToDashed = (str) => {
  return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
};

export const throttle = (callback, limit) => {
  let wait = false; // Initially, we're not waiting
  return function () {
    // We return a throttled function
    if (!wait) {
      // If we're not waiting
      callback.call(); // Execute users function
      wait = true; // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        wait = false; // And allow future invocations
      }, limit);
    }
  };
};

export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// The helper function to use with dangerouslySetInnerHTML inside React component
export const setInnerHtml = (htmlStr) => {
  return {
    __html: htmlStr
  };
};

// get the selected option in a grouped dropdown
export const getSelectedGroupItem = (optionList, selectedValue) => {
  return optionList.reduce((selectedGroupItem, selectedGroup) => {
    const groupItem =
      selectedGroup.type &&
      selectedGroup.items.find((item) => item.value === selectedValue);
    if (groupItem) {
      selectedGroupItem = groupItem;
    }
    return selectedGroupItem;
  }, optionList[0]);
};

export const onlyNumbers = (str) => {
  if (appUtils.checkIfFalsy(str)) {
    return "";
  }
  if (typeof str === "number") {
    return str;
  }
  const replace = /[^0-9.,]+/;
  var removeAlphabets = new RegExp(replace, "g");
  return str.replace(removeAlphabets, "");
};
