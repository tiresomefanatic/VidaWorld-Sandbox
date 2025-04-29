import React from "react";
import PropTypes from "prop-types";
import Logger from "../../../services/logger.service";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  componentDidCatch(error, errorInfo) {
    Logger.info(errorInfo);
    this.setState({ error: error });
  }

  render() {
    if (this.state.error) {
      return <h3>An Error Occurred</h3>;
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};

ErrorBoundary.defaultProps = {
  children: null
};

export default ErrorBoundary;
