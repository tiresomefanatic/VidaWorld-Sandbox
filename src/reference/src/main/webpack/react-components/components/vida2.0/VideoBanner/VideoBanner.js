import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
const VideoBanner = ({ config }) => {
  const {
    content,
    videoUrl,
    playIconMob,
    playIconDesk,
    pauseIconMob,
    pauseIconDesk,
    altIconText
  } = config;
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
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
  const playIcon = isDesktop ? playIconDesk : playIconMob;
  const pauseIcon = isDesktop ? pauseIconDesk : pauseIconMob;
  return (
    <div className="video-banner-container vida-2-container">
      <div className="content-container">
        <p className="content">{content}</p>
      </div>
      <div className="video-container">
        <video
          className="video"
          ref={videoRef}
          src={videoUrl}
          autoPlay={isPlaying}
          muted
          loop
        ></video>
        <div className="play-button-container">
          <img
            className="play-button"
            alt={altIconText}
            src={isPlaying ? pauseIcon : playIcon}
            onClick={handlePlayToggle}
          />
        </div>
      </div>
    </div>
  );
};
export default VideoBanner;
VideoBanner.propTypes = {
  config: PropTypes.shape({
    content: PropTypes.string,
    videoUrl: PropTypes.string,
    playIconMob: PropTypes.string,
    playIconDesk: PropTypes.string,
    pauseIconMob: PropTypes.string,
    pauseIconDesk: PropTypes.string,
    altIconText: PropTypes.string
  })
};
