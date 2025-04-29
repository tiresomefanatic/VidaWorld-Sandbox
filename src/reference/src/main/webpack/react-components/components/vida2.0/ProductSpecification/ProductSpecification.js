import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const ProductSpecification = (props) => {
  const { variant_specification_details } = props.config;
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  return (
    <div className="product-specification-wrapper">
      {variant_specification_details?.map((item, index) => (
        <div className="product-item" key={index}>
          <div className="product-item-image-wrapper">
            <img
              className="product-item-image"
              src={
                isDesktop
                  ? item.specificationIcon
                  : item.specificationIconMobile
              }
              alt={item.specificationIconAlt}
            />
          </div>

          <p className="product-item-title">{item.specificationLabel}</p>
          <p className="product-item-value">
            {item.specificationValue}
            {item.specificationUnit ? (
              <span> {item.specificationUnit}</span>
            ) : (
              ""
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductSpecification;

ProductSpecification.propTypes = {
  config: PropTypes.shape({
    variant_specification_details: PropTypes.array
  })
};
