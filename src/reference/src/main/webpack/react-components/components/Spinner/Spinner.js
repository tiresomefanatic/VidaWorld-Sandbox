import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Spinner = ({ mode, loadingStatus }) => {
  return (
    <>
      {loadingStatus && (
        <>
          {mode === "action" ? (
            <div className="vida-spinner__loader vida-spinner__loader-sm"></div>
          ) : (
            <div className="vida-spinner__wrapper">
              <div className="vida-spinner__loader"></div>
              <h3>Loading...</h3>
            </div>
          )}
        </>
      )}
    </>
  );
};

Spinner.propTypes = {
  mode: PropTypes.string,
  loadingStatus: PropTypes.bool
};

const mapStateToProps = ({ spinnerReducer }) => {
  return {
    loadingStatus: spinnerReducer.loading
  };
};

export default connect(mapStateToProps)(Spinner);
