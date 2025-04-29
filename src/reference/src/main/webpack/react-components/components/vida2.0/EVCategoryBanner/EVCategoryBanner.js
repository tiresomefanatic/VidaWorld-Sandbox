import React from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../site/scripts/utils/appUtils";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const EVCategoryBanner = (props) => {
  const { bannerContent } = props.config;
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  return (
    <div className="ev-category-banner">
      <div className="ev-category-banner-background">
        <img
          src={`${appUtils.getConfig(
            "resourcePath"
          )}images/png/EVCateogry-banner.png`}
        ></img>
      </div>
      <h1 className="ev-category-banner-title">{bannerContent?.title}</h1>
      {bannerContent.assetType === "image" && (
        <div className="ev-category-banner-media">
          <img
            className="ev-category-banner-media-content"
            src={
              isDesktop
                ? bannerContent?.image?.imageDesktop
                : bannerContent?.image?.imageMobile
            }
            alt={bannerContent?.image?.altText}
            title={bannerContent?.image?.imageTitle}
          ></img>
        </div>
      )}
      {bannerContent.assetType === "video" && (
        <div className="ev-category-banner-media">
          <video
            className="ev-category-banner-media-content"
            muted
            loop
            autoPlay
            playsInline
            src={bannerContent?.video?.videoMobile}
          ></video>
        </div>
      )}
    </div>
  );
};

export default EVCategoryBanner;

EVCategoryBanner.propTypes = {
  config: PropTypes.shape({
    bannerContent: PropTypes.shape({
      title: PropTypes.string,
      assetType: PropTypes.string,
      image: PropTypes.shape({
        imageMobile: PropTypes.string,
        altText: PropTypes.string,
        imageDesktop: PropTypes.string,
        imageTitle: PropTypes.string
      }),
      video: PropTypes.shape({
        videoMobile: PropTypes.string,
        altText: PropTypes.string,
        videoDesktop: PropTypes.string
      })
    })
  })
};
// EVCategoryBanner.defaultProps = {
//   config: {
//     bannerContent: {
//       title: "Ride VIDA V1 to the Future",
//       bannerImg:
//         "https://media.zigcdn.com/media/model/2023/Jun/right-side-view-375892511_930x620.jpg"
//     }
//   }
// };
