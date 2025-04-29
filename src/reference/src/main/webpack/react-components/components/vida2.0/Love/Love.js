import React, { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReDirectionCards from "../ReDirectionCards/ReDirectionCards";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { tns } from "tiny-slider/src/tiny-slider";

const Love = (props) => {
  const { config } = props;
  const { redirectionCardLabel, redirectionCardHeader } = config;

  let { redirectionCardConfig } = config;

  redirectionCardConfig = JSON.parse(redirectionCardConfig);

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const fontSize = isDesktop ? "20px" : "14px";
  const fontWeight = isDesktop ? "400" : "600";
  redirectionCardConfig.map((item) => {
    (item.fontSize = fontSize), (item.fontWeight = fontWeight);
  });
  const tns_slider = useRef(null);

  useLayoutEffect(() => {
    const slider = setTimeout(() => {
      tns({
        container: tns_slider.current,
        loop: true,
        items: 3,
        page: 1,
        slideBy: 1,
        nav: true,
        autoplay: true,
        speed: config.cardScrollSpeed,
        autoplayButtonOutput: false,
        mouseDrag: true,
        lazyload: true,
        controls: false,
        navPosition: "bottom",
        responsive: {
          360: {
            items: 1
          },
          1024: {
            items: 1
          }
        }
      });
    }, 500);

    return () => clearTimeout(slider);
  }, [redirectionCardConfig]);

  return (
    <div className="vida-love-container vida-2-container">
      <div className="vida-redirection-container">
        <div className="vida-love-header-section">
          <p>{redirectionCardLabel}</p>
          <h3>{redirectionCardHeader}</h3>
        </div>
        <div className="vida-redirection__carousel-slider">
          <div className="vida-redirection__carousel-slides" ref={tns_slider}>
            {redirectionCardConfig.map((card, index) => (
              <ReDirectionCards config={card} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

Love.propTypes = {
  config: PropTypes.shape({
    redirectionCardLabel: PropTypes.string,
    redirectionCardHeader: PropTypes.string,
    cardScrollSpeed: PropTypes.number,
    redirectionCardConfig: PropTypes.string
  })
};

export default Love;
