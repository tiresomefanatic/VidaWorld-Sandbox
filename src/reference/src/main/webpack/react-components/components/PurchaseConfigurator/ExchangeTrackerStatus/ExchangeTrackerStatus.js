import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ExchangeTrackerStatus = (props) => {
  const { config } = props;
  const { orderStatusConfig } = config;
  const [stepper, setStepper] = useState();

  useEffect(() => {
    const cStepper = orderStatusConfig.map((item, idx) => {
      item.selected = idx === 0 ? true : false;
      return item;
    });
    setStepper(cStepper);
  }, []);

  return (
    <div className="vida-exchange-tracker">
      <nav className="vida-exchange-tracker__stepper">
        {stepper &&
          stepper.map((item) => (
            <ul
              key={item.id}
              className={
                item.selected
                  ? "vida-exchange-tracker__list active"
                  : "vida-exchange-tracker__list"
              }
            >
              <li>
                <div className="vida-exchange-tracker__steps">
                  <div className="vida-exchange-tracker__iconDiv">
                    <i
                      className={`icon-${
                        item.icon ? item.icon : "scooter"
                      } vida-exchange-tracker__status-icons ${
                        item.selected && "active"
                      }`}
                    ></i>
                  </div>
                  <div className={`vida-exchange-tracker__info`}>
                    <h3 className="vida-exchange-tracker__info-title">
                      {item.label}
                    </h3>
                    <p className="vida-exchange-tracker__info-desc">
                      {item.message}
                    </p>
                  </div>
                  {/* <div className="vida-exchange-tracker__status-action"></div> */}
                </div>
              </li>
            </ul>
          ))}
      </nav>
    </div>
  );
};

ExchangeTrackerStatus.propTypes = {
  config: PropTypes.shape({
    orderStatusConfig: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        message: PropTypes.string,
        label: PropTypes.string
      })
    )
  })
};
export default ExchangeTrackerStatus;
