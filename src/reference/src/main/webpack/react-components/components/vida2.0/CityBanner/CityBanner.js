import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const CityBanner = ({ config, cityName }) => {
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  return (
    <div className="city-banner-wrapper">
      <div className="city-banner-top-container">
        {(config?.bannerBgDesktop || config?.bannerBgMobile) && (
          <img
            className="city-banner-bg-img"
            src={isDesktop ? config?.bannerBgDesktop : config?.bannerBgMobile}
            alt={config?.bannerImgAlt}
            title={config?.bannerImgTitle}
          ></img>
        )}
        <div className="city-banner-title">
          <h1>
            {config?.bannerTitle}{" "}
            <span>
              {cityName
                ? cityName?.charAt(0).toUpperCase() + cityName?.slice(1)
                : ""}
            </span>
          </h1>
        </div>
      </div>
      <div className="city-banner-bottom-container">
        <img
          className="city-banner-img"
          src={isDesktop ? config?.bannerImgDesktop : config?.bannerImgMobile}
          alt={config?.bannerImgAlt}
          title={config?.bannerImgTitle}
        ></img>
      </div>
    </div>
  );
};

export default CityBanner;

CityBanner.propTypes = {
  config: PropTypes.object,
  cityName: PropTypes.any
};
