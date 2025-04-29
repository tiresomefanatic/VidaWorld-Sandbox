import React, { useState } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const ChargeAtHome = (props) => {
  const { config } = props;
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  // intersection observer
  const {
    ref: chargeAtHomeContainerRef,
    isVisible: chargeAtHomeContainerVisible
  } = useIntersectionObserver();

  const CustomTitleTag = config?.titleTag || "p";

  return (
    <div
      className="charge-home-wrapper vida-2-container"
      ref={chargeAtHomeContainerRef}
      style={{ opacity: chargeAtHomeContainerVisible ? 1 : 0 }}
    >
      <div className="charge-home-container">
        <div className="charge-home-title-container">
          <p className="charge-home-pre-title">{config?.preTitle}</p>
          <CustomTitleTag className="charge-home-title">
            {config?.title}
          </CustomTitleTag>
          <p className="charge-home-title-description">{config?.description}</p>
        </div>
        <div className="charge-home-content-container">
          <div className="charge-home-card-list">
            {config?.cardsInfo
              ?.sort((a, b) => a?.order - b?.order)
              ?.map((item, index) => {
                const CustomLabelTag = item?.labelTag || "p";
                return (
                  <a
                    href={item?.link}
                    id={item?.sectionId}
                    className={
                      item?.link
                        ? "charge-home-card-item"
                        : "charge-home-card-item p-event-none"
                    }
                    key={index}
                  >
                    <div className="charge-home-card-title">
                      <CustomLabelTag className="charge-home-card-title-text">
                        {item?.label}
                      </CustomLabelTag>
                    </div>
                    <div className="charge-home-card-flex-container">
                      <div className="charge-home-card-img">
                        <img
                          src={
                            isDesktop ? item?.desktopImage : item?.mobileImage
                          }
                          title={item?.imageTitle}
                          alt={item?.imageAlt}
                        ></img>
                      </div>
                      <div className="charge-home-card-description">
                        <p>{item?.description}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargeAtHome;

ChargeAtHome.propTypes = {
  config: PropTypes.shape({
    preTitle: PropTypes.string,
    title: PropTypes.string,
    titleTag: PropTypes.string,
    description: PropTypes.string,
    cardsInfo: PropTypes.arrayOf(PropTypes.any)
  })
};
