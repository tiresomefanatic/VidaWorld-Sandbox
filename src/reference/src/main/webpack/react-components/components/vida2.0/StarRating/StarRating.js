import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../site/scripts/utils/appUtils";

const StarRating = ({ rating }) => {
  const totalStars = 5;
  const [ratingArray, setRatingArray] = useState([
    true,
    true,
    true,
    true,
    true
  ]);

  useEffect(() => {
    const updateRating = ratingArray.map((ele, index) => {
      if (index < rating) {
        return true;
      } else {
        return false;
      }
    });
    setRatingArray(updateRating);
  }, [rating]);

  return (
    <>
      {ratingArray.map((ele, index) => (
        <span key={index}>
          {ele ? (
            <img
              src={`${appUtils.getConfig(
                "resourcePath"
              )}images/svg/Star-filled.svg`}
            />
          ) : (
            <img
              src={`${appUtils.getConfig("resourcePath")}images/svg/Star.svg`}
            />
          )}
        </span>
      ))}
    </>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number
};
export default StarRating;
