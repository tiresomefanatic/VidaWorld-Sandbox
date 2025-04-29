import { useEffect } from "react";

import Logger from "../../../services/logger.service";

export const useTermsAndConditions = () => {
  let popupEvent = null;
  const agreeBtnAttr = "[data-terms-agree-btn]";
  const closeBtnAttr = "[data-terms-close-btn]";
  const mainPopupCls = ".vida-terms-conditions";
  const termsAnchorAttr = "[data-show-terms-agree-btn]";

  function termsCallback(event) {
    event.preventDefault();
    document.querySelector("html").classList.add("overflow-hidden");
    popupEvent.style.display = "block";
  }

  function closeCallback() {
    popupEvent.style.display = "none";
    document.querySelector("html").classList.remove("overflow-hidden");
  }

  function agreeCallback(event, checkboxRef, checkboxCallback) {
    event.preventDefault();
    closeCallback();
    checkboxRef.current.checked = true;
    checkboxCallback({ target: checkboxRef.current }, true);
  }

  useEffect(() => {
    // unbind event
    return () => {
      if (popupEvent) {
        document.removeEventListener("click", agreeCallback);
        popupEvent
          .querySelector(agreeBtnAttr)
          .removeEventListener("click", agreeCallback);
      }
    };
  }, []);

  const showTermsPopup = (checkboxRef, checkboxCallback) => {
    try {
      popupEvent = document.querySelector(mainPopupCls);

      // bind event
      popupEvent
        .querySelector(agreeBtnAttr)
        .addEventListener("click", (event) =>
          agreeCallback(event, checkboxRef, checkboxCallback)
        );
      popupEvent
        .querySelector(closeBtnAttr)
        .addEventListener("click", closeCallback);
      // React element
      document
        .querySelector(termsAnchorAttr)
        .addEventListener("click", termsCallback);
    } catch (err) {
      Logger.error(err);
    }
  };

  return [showTermsPopup];
};
