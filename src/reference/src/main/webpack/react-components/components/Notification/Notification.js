import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { hideNotificationDispatcher } from "../../store/notification/notificationActions";

const Notification = (props) => {
  const { type, title, description, isVisible } = props;

  const closeNotification = (e) => {
    e.preventDefault();
    hideNotificationDispatcher();
  };

  return isVisible ? (
    <section
      className={`notification notification--fixed notification--${type}`}
    >
      <div className="notification__container">
        <div className="notification__title">
          <span className="notification__icon">
            <i className="icon-information-circle"></i>
          </span>
          <label className="notification__label">{title}</label>
          <a
            href="#"
            className="notification__close"
            onClick={closeNotification}
          >
            <i className="icon-x"></i>
          </a>
        </div>
        {description && (
          <p className="notification__description">{description}</p>
        )}
      </div>
    </section>
  ) : (
    <></>
  );
};

const mapStateToProps = (state) => {
  return {
    title: state.notificationReducer.title,
    description: state.notificationReducer.description,
    type: state.notificationReducer.type,
    isVisible: state.notificationReducer.isVisible
  };
};

Notification.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  isVisible: PropTypes.bool
};

Notification.defaultProps = {
  type: "",
  title: "Default Title",
  description: "",
  isVisible: false
};

export default connect(mapStateToProps)(Notification);
