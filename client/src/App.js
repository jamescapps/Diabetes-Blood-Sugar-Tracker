import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store"
import jwt_decode from "jwt-decode"

import Login from "./components/login"
import Dashboard from "./components/dashboard"
import Register from "./components/register"
import History from "./components/history"
import ForgotPassword from "./components/password/forgot-password"
import ResetPassword from "./components/password/reset-password"
import Chart from "./components/chart"
import PrivateRoute from "./components/private-route/PrivateRoute"

import setAuthToken from "./utils/setAuthToken"
import { setCurrentUser, logoutUser } from "./actions/authActions"

const checkAuthToken = () => {
  const token = localStorage.jwtToken;

  if (token) {
    setAuthToken(token);
    const decoded = jwt_decode(token);
    
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      return { expired: true }; // Token is expired
    }
    
    return { expired: false, decoded }; // Token is valid
  }
  
  return { expired: false }; // No token
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  
  useEffect(() => {
    const { expired, decoded } = checkAuthToken();
    if (expired) {
      store.dispatch(logoutUser());
      setIsTokenExpired(true);
    } else if (decoded) {
      store.dispatch(setCurrentUser(decoded));
    }
    setIsLoading(false);
  }, [])

  if (isLoading) {
    return <p>Loading...</p>; // Optional loading state
  }

  return (
    <Provider store={store}>
      <Router>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgotpassword" component={ForgotPassword} />
        <Route path="/resetpassword" component={ResetPassword} />
        <Switch>
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/history" component={History} />
          <PrivateRoute path="/chart" component={Chart} />
          {isTokenExpired && <Redirect to="/login" />} {/* Redirect on expired token */}
        </Switch>
      </Router>
    </Provider>
  )
}

export default App;
