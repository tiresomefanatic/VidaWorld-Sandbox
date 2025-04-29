import React from "react";
import PropTypes from "prop-types";

const DealerCard = (props) => {
  const { dealer, mapIcon, phoneIcon, handleDealerClick, className } = props;

  const handleCardClick = (dealer) => {
    handleDealerClick && handleDealerClick(dealer);
  };

  return (
    <div
      key={dealer.id}
      className={`vida-dealer-card vida-dealer-card__dealer  ${className}`}
      onClick={() => handleCardClick(dealer)}
    >
      <p>{dealer.experienceCenterName}</p>
      <div>{dealer.address}</div>
      <div
        className={`vida-dealer-card__bottom-sec ${
          !dealer.phonenumber ? "no-phone" : ""
        }`}
      >
        {dealer.phonenumber && (
          <p
            className="vida-dealer-card__bottom-sec-phone-number"
            style={{ backgroundImage: `url(${phoneIcon})` }}
          >{`${dealer.phonenumber} ${
            dealer.servicephonenumber ? " / " + dealer.servicephonenumber : ""
          }`}</p>
        )}

        {dealer.latitude && dealer.longitude && (
          <a
            className="vida-dealer-card__bottom-sec-link"
            href={
              "https://maps.google.com/?q=" +
              dealer.latitude +
              "," +
              dealer.longitude
            }
            target="_blank"
            rel="noreferrer"
          >
            <span
              className="vida-dealer-card__bottom-sec-map"
              style={{ backgroundImage: `url(${mapIcon})` }}
            ></span>
          </a>
        )}
      </div>
    </div>
  );
};

DealerCard.propTypes = {
  dealer: PropTypes.object,
  phoneIcon: PropTypes.string,
  mapIcon: PropTypes.string,
  className: PropTypes.string,
  handleDealerClick: PropTypes.func
};

export default DealerCard;
