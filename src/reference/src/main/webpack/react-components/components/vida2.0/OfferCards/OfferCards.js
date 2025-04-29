import React from "react";
import PropTypes from "prop-types";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const OfferCard = ({ dataPosition, offerCardData }) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const pagePath = window.location.pathname;

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };
  return (
    <div className="offer-cards vida-2-container">
      {offerCardData?.map((item) => (
        <div
          className={`offer-cards__container ${
            item.cardType === "primary"
              ? "bg-primary-card-color"
              : item.cardType === "secondary"
              ? "bg-secondary-card-color"
              : "bg-tertiary-card-color"
          }`}
          key={item.title}
        >
          <div className="offer-cards__top-wrapper">
            <div className="offer-cards__icon-container">
              <img src={item.icon} alt="calculate Icon"></img>
            </div>
            {item.title &&
              (pagePath.includes("offer") ? (
                <h3 className="offer-cards__title">{item.title}</h3>
              ) : (
                <p className="offer-cards__title">{item.title}</p>
              ))}
            {item.description && (
              <p className="offer-cards__description">{item.description}</p>
            )}
            {item.subText && (
              <p className="offer-cards__sub-text">{item.subText}</p>
            )}
            {item.image && (
              <div className="offer-cards__banner-image">
                <img
                  src={item.image}
                  alt={item.imagealttext || "banner image"}
                  title={item.imageTitle}
                  loading="lazy"
                ></img>
              </div>
            )}
          </div>
          <div className="offer-cards__bottom-wrapper">
            {item.isButton && (
              <a
                className="offer-cards__offer-button"
                href={item.link}
                data-link-position={dataPosition || "horizontalOfferCard"}
                onClick={(e) => ctaTracking(e)}
                target={item.newTab ? "_blank" : "_self"}
                rel="noreferrer"
              >
                {item.buttonLabel}
              </a>
            )}
            {!item.isButton && (
              <a
                className="offer-cards__know-more-text"
                href={item.link}
                data-link-position={dataPosition || "horizontalOfferCard"}
                onClick={(e) => ctaTracking(e)}
                target={item.newTab ? "_blank" : "_self"}
                rel="noreferrer"
              >
                {item.buttonLabel}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OfferCard;

OfferCard.propTypes = {
  dataPosition: PropTypes.string,
  offerCardData: PropTypes.arrayOf(PropTypes.any)
};

// OfferCard.defaultProps = {
//   offerCardData: [
//     {
//       icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyh-Uql4T1A-ymZ61UWxbx30CKSvxN2qXQqwjiHcE&s",
//       title: "Offer #1",
//       description: "Lorem Ipsum Dolor SIt Amet",
//       subText: "* T&C Apply",
//       image: "",
//       buttonLabel: "Lorem Ipsum",
//       knowMoreLabel: "",
//       bannerImageUrl: "",
//       isButton:true,
//       cardType:"primary"
//     }
//   ]
// };
