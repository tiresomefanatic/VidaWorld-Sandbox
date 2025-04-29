import React from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../../site/scripts/media-breakpoints";
import getFontSizes from "../../../../../site/scripts/utils/fontUtils";

const Banner = ({
  bannerBgImg,
  bannerBikeImg,
  onItsWayText,
  userName,
  bikeName,
  optedBikeVariant
}) => {
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const inputValue = userName;
  const { fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop);

  return (
    <div className="vida2-common-banner-container">
      <img
        className="vida2-common-banner-bg"
        src={bannerBgImg?.imgSrc || bannerBgImg || ""}
        alt={bannerBgImg?.altText || "banner"}
        title={bannerBgImg?.title || "banner title"}
      ></img>
      <div className="vida2-common-banner-content-container">
        <div className="user-info-container">
          <div className="user-info-name">
            <p
              className="user-info-name-text"
              style={{
                fontSize: fontSize,
                color: optedBikeVariant?.textColor || ""
              }}
            >{`${userName.charAt(0).toUpperCase() + userName.slice(1)}'s`}</p>
          </div>
          <div className="user-info-bike">
            <p
              className="user-info-bike-text"
              style={{
                fontSize: fontSizeSubHeader,
                color: optedBikeVariant?.textColor || ""
              }}
            >
              {bikeName + " "}
              <span
                className="bike-sub-text"
                style={{
                  color: optedBikeVariant?.textColor || ""
                }}
              >
                {onItsWayText || ""}
              </span>
            </p>
          </div>
        </div>
        <div className="user-bike-img-container">
          <img
            className="user-bike-img"
            src={bannerBikeImg?.imgSrc || bannerBikeImg || ""}
            alt={bannerBikeImg?.altText || "ride"}
            title={bannerBikeImg?.title || "ride title"}
          ></img>
        </div>
      </div>
    </div>
  );
};

Banner.propTypes = {
  bannerBgImg: PropTypes.string,
  bannerBikeImg: PropTypes.string,
  onItsWayText: PropTypes.string,
  userName: PropTypes.string,
  bikeName: PropTypes.string,
  optedBikeVariant: PropTypes.object
};

export default Banner;
