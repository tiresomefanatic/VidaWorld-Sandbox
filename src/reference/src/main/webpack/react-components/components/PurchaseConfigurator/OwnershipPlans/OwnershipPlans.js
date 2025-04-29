import React from "react";
import PropTypes from "prop-types";
import SubscriptionPlans from "../SubscriptionPlans/SubscriptionPlans";

const OwnershipPlans = (props) => {
  const { config, subscriptionConfig } = props;
  const { title, basicPlanDetails } = config;
  return (
    <div className="vida-ownership-plans">
      <h2>{title}</h2>
      <SubscriptionPlans config={subscriptionConfig} />
      <div className="vida-ownership-plans__container">
        <div className="vida-ownership-plans__card-basic">
          <div className="vida-ownership-plans__title-container">
            <h3 className="vida-ownership-plans__title">
              {basicPlanDetails.title}
            </h3>
            <span className="vida-ownership-plans__message">
              {basicPlanDetails.message}
            </span>
          </div>
          <div className="vida-ownership-plans__icon-container">
            {basicPlanDetails.coverList.map((detail, index) => (
              <div className="vida-ownership-plans__icon" key={index}>
                <i className={detail.icon}></i>
                <label>{detail.label}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

OwnershipPlans.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    basicPlanDetails: PropTypes.shape({
      title: PropTypes.string,
      message: PropTypes.string,
      coverList: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          icon: PropTypes.string,
          label: PropTypes.string
        })
      )
    })
  }),
  subscriptionConfig: PropTypes.object
};

export default OwnershipPlans;
