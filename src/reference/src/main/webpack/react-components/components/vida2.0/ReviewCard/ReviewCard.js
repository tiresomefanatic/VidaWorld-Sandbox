import React, { useState } from "react";
import PropTypes from "prop-types";
import StarRating from "../StarRating/StarRating";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const ReviewCard = (props) => {
  const { ratingsLabel, ratingsHeader, loadMoreContent, reviewCount } =
    props.config;

  let { reviewCardContent } = props.config;
  reviewCardContent = JSON.parse(reviewCardContent);

  const [noOfReview, setnoOfReview] = useState(reviewCount);
  const [showMore, setShowMore] = useState(
    reviewCount === reviewCardContent.length ? false : true
  );

  // intersection observer
  const {
    ref: loveReviewCardContainerRef,
    isVisible: loveReviewCardContainerVisible
  } = useIntersectionObserver();

  const loadMoreHandler = (e) => {
    e.preventDefault();
    if (noOfReview < reviewCardContent.length) {
      if (noOfReview + reviewCount >= reviewCardContent.length) {
        const balanceCards = reviewCardContent.length - noOfReview;
        balanceCards ? setShowMore(false) : setShowMore(true);
        setnoOfReview(noOfReview + balanceCards);
      } else {
        setnoOfReview(noOfReview + reviewCount);
      }
    }
  };

  return (
    <div
      className="vida-love-container vida-2-container"
      ref={loveReviewCardContainerRef}
      style={{ opacity: loveReviewCardContainerVisible ? 1 : 0 }}
    >
      <div className="vida-review-container">
        <div className="vida-love-header-section">
          <p>{ratingsLabel}</p>
          <h3>{ratingsHeader} </h3>
        </div>
        <div className="vida-review-cards-section">
          <div className="vida-review-cards-container">
            {reviewCardContent.map((item, index) => (
              <React.Fragment key={index}>
                {index < noOfReview && (
                  <div className="vida-review-card" key={index}>
                    <div className="vida-review-card-header">
                      <p>{item.title}</p>
                    </div>
                    <hr className="break-line" />
                    <div className="vida-ratings-section">
                      <StarRating rating={parseInt(item.rating)} />
                    </div>
                    {item.imagePath && (
                      <div className="vida-review-assets">
                        <img src={item.imagePath} alt="review-image" />
                      </div>
                    )}
                    <div className="vida-review-card-content">
                      <p>{item.reviewMessage}</p>
                    </div>
                    <div className="vida-review-user-section">
                      <div className="user-image">
                        <img src={item.userImage} alt="user-image" />
                      </div>

                      <p className="user-details">
                        {item.userName}
                        {item.userCity ? (
                          <span> , {item.userCity} </span>
                        ) : (
                          <></>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {showMore && (
            <div className="load-more-section">
              <a href="#" onClick={loadMoreHandler}>
                {loadMoreContent}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ReviewCard.propTypes = {
  config: PropTypes.shape({
    ratingsLabel: PropTypes.string,
    ratingsHeader: PropTypes.string,
    reviewCardContent: PropTypes.string,
    loadMoreContent: PropTypes.string,
    reviewCount: PropTypes.number
  })
};
export default ReviewCard;
