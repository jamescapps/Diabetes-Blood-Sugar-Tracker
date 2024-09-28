import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  const renderRoute = (props) => {
    return auth.isAuthenticated ? (
      <Component {...props} />
    ) : (
      <Redirect to="/login" />
    );
  };

  return <Route {...rest} render={renderRoute} />;
};

PrivateRoute.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired
  }).isRequired,
  component: PropTypes.elementType.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
