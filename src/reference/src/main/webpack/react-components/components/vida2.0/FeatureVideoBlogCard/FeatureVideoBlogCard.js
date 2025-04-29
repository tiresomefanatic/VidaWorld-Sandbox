import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import ChargingGuideCards from "../ChargingGuideCards/ChargingGuideCards";
import breakpoints from "../../../../site/scripts/media-breakpoints";
const FeatureVideoBlogCard = ({ config }) => {
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const handlePlayToggle = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const {
    title,
    content,
    videoUrl,
    imageDesktop,
    imageMobile,
    playIconMob,
    playIconDesk,
    pauseIconMob,
    pauseIconDesk,
    altIconText,
    altImgText,
    assetType,
    ChargingGuideCardContent,
    videoTitle,
    videoWithControlTitle
  } = config;
  const playIcon = isDesktop ? playIconDesk : playIconMob;
  const pauseIcon = isDesktop ? pauseIconDesk : pauseIconMob;
  return (
    <div className="feature-video-blogcard-container vida-2-container">
      <div className="feature-video-blogcard-container__video-specifications-container">
        <div className="content-container">
          <div className="heading-container">
            <p className="heading-text">{title}</p>
          </div>
          <div className="content">
            <p className="content-text">{content}</p>
          </div>
        </div>
        <div className="video-container">
          {assetType === "image" && (
            <img
              className="image"
              src={isDesktop ? imageDesktop : imageMobile}
              autoPlay={isPlaying}
              alt={altImgText}
              muted
              loop
            ></img>
          )}
          {assetType === "video" && (
            <video
              className="video"
              title={videoTitle}
              src={videoUrl}
              autoPlay
              muted
              loop
            ></video>
          )}
          {assetType === "video-with-controls" && (
            <video
              className="video"
              ref={videoRef}
              src={videoUrl}
              autoPlay={isPlaying}
              title={videoWithControlTitle}
              muted
              loop
            ></video>
          )}
          {assetType === "video-with-controls" && (
            <div className="play-button-container">
              <img
                className="play-button"
                alt={altIconText}
                src={isPlaying ? pauseIcon : playIcon}
                onClick={handlePlayToggle}
              />
            </div>
          )}
        </div>
      </div>
      <div className="feature-video-blogcard-container__blog-cards-container">
        <HorizontalScroll>
          <ChargingGuideCards chargingCardData={ChargingGuideCardContent} />
        </HorizontalScroll>
      </div>
    </div>
  );
};
export default FeatureVideoBlogCard;
FeatureVideoBlogCard.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    videoUrl: PropTypes.string,
    playIconMob: PropTypes.string,
    playIconDesk: PropTypes.string,
    pauseIconMob: PropTypes.string,
    pauseIconDesk: PropTypes.string,
    altIconText: PropTypes.string,
    imageDesktop: PropTypes.string,
    imageMobile: PropTypes.string,
    imageDesktop: PropTypes.string,
    assetType: PropTypes.string,
    altImgText: PropTypes.string,
    ChargingGuideCardContent: PropTypes.arrayOf(),
    videoWithControlTitle: PropTypes.string,
    videoTitle: PropTypes.string
  })
};
