import React from "react";
import PropTypes from "prop-types";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import OfferCard from "../OfferCards/OfferCards";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const ProductHorizontalOfferCards = (props) => {
  const { config } = props;
  const pagePath = window.location.pathname;

  // intersection observer
  const { ref: offerCardsContainerRef, isVisible: offerCardsContainerVisible } =
    useIntersectionObserver();

  return (
    <div
      className="product-offer-cards"
      ref={offerCardsContainerRef}
      style={{ opacity: offerCardsContainerVisible ? 1 : 0 }}
    >
      <div
        className={
          config?.offersCardPrimaryText || config?.offersCardBoldText
            ? "product-offer-cards-title-container vida-2-container"
            : "d-none"
        }
      >
        {config?.offersCardPrimaryText && (
          <p className="product-offer-cards-primary-text">
            {config?.offersCardPrimaryText}
          </p>
        )}
        {config?.offersCardBoldText &&
          (pagePath.includes("offer") || pagePath.includes("battery") ? (
            <h2 className="product-offer-cards-bold-text">
              {config?.offersCardBoldText}
            </h2>
          ) : (
            <p className="product-offer-cards-bold-text">
              {config?.offersCardBoldText}
            </p>
          ))}
        {config?.offersCardSecondaryText && (
          <p className="product-offer-cards-secondary-text">
            {config?.offersCardSecondaryText}
          </p>
        )}
      </div>

      <HorizontalScroll>
        <OfferCard
          dataPosition={config?.dataPosition}
          offerCardData={config?.offerCardContent}
        />
      </HorizontalScroll>
    </div>
  );
};

export default ProductHorizontalOfferCards;

ProductHorizontalOfferCards.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    offerCardContent: PropTypes.arrayOf(PropTypes.any),
    offersCardPrimaryText: PropTypes.string,
    offersCardBoldText: PropTypes.string,
    offersCardSecondaryText: PropTypes.string
  })
};
ProductHorizontalOfferCards.defaultProps = {
  config: {
    offerCardContent: [
      {
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyh-Uql4T1A-ymZ61UWxbx30CKSvxN2qXQqwjiHcE&s",
        title: "Offer #1",
        description: "Lorem Ipsum Dolor SIt Amet",
        subText: "* T&C Apply",
        image: "",
        link: "",
        buttonLabel: "Lorem Ipsum",
        knowMoreLabel: "",
        knowMoreLabelLink: "",
        bannerImageUrl: "",
        imagealttext: "",
        imageTitle: ""
      }
    ]
  }
};
