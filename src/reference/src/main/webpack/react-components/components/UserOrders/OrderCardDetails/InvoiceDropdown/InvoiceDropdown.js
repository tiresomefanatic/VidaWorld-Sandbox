import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const InvoiceDropdown = (props) => {
  const { invoiceDocumentList, downloadInvoiceBtnLabel, downloadInvoice } =
    props;

  const [showOptions, setShowOptions] = useState(false);

  const showInvoiceList = () => {
    setShowOptions(true);
  };

  useEffect(() => {
    function handleClick(event) {
      {
        const dropdownEle = document.querySelector(
          ".vida-invoice-dropdown__label"
        );

        if (
          dropdownEle &&
          dropdownEle.getAttribute("class") !==
            event.target.getAttribute("class")
        ) {
          setShowOptions(false);
        }
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <div className="vida-invoice-dropdown" onClick={() => showInvoiceList()}>
        <span className="vida-invoice-dropdown__label">
          {downloadInvoiceBtnLabel}
          <i
            className={
              showOptions
                ? "icon-chevron form__dropdown-icon--open"
                : "icon-chevron"
            }
          ></i>
        </span>
        {showOptions && (
          <ul>
            {invoiceDocumentList.map((ids) => {
              return (
                <li
                  className=""
                  onClick={(e) => downloadInvoice(e, ids.id, ids.printName)}
                  key={ids.id}
                >
                  <span>{ids.printName}</span>
                  <i className="icon-download"></i>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

InvoiceDropdown.propTypes = {
  invoiceDocumentList: PropTypes.array,
  downloadInvoiceBtnLabel: PropTypes.string,
  downloadInvoice: PropTypes.func
};

InvoiceDropdown.defaultProps = {
  invoiceDocumentList: []
};

export default InvoiceDropdown;
