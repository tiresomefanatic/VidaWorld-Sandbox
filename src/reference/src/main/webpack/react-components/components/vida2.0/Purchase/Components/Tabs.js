import React from "react";
import Button from "./Button";
import { BUTTON_TYPES } from "../BillingShippingAddress/Constants";
import PropTypes from "prop-types";

const Tabs = ({ onChange, tabs, currentTab }) => {
  const getContent = (tabs) => {
    if (tabs?.length > 0) {
      return (
        <>
          {tabs.map((tab) => {
            if (currentTab === tab.value) {
              return (
                <Button
                  key={tab.value}
                  {...tab}
                  onClick={() => onChange(tab.value)}
                  variant={BUTTON_TYPES.PRIMARY}
                  style={{ flex: 1 }}
                />
              );
            } else {
              return (
                <Button
                  key={tab.value}
                  {...tab}
                  onClick={() => onChange(tab.value)}
                  variant={BUTTON_TYPES.SECONDARY}
                  style={{ flex: 1 }}
                />
              );
            }
          })}
        </>
      );
    } else {
      return null;
    }
  };
  return <div className="vida2-tabs">{getContent(tabs)}</div>;
};

Tabs.propTypes = {
  onChange: PropTypes.func,
  currentTab: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  )
};

export default Tabs;
