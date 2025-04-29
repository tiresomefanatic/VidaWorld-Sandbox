import React, { useState } from "react";
import PropTypes from "prop-types";

const Drawer = ({ children }, isDefaultOpen = true) => {
  const [isOpenDrawer, setOpenDrawer] = useState(isDefaultOpen);
  const isHandleDrawerClose = () => {
    setOpenDrawer(!isOpenDrawer);
  };

  return (
    <div className={`drawer ${!isOpenDrawer ? "slide-down" : ""}`}>
      <div className="drawer__content">
        <div className="drawer__header" onClick={isHandleDrawerClose}>
          <div className="header__line"></div>
        </div>
        <div className="drawer__body">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
Drawer.propTypes = {
  children: PropTypes.node
};
