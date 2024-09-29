import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store"
import jwt_decode from "jwt-decode"

import EntryPage from "./components/entry-page.component"
import LoggedIn from "./components/logged-in.component"
import CreateUser from "./components/create-user.component"
import FullHistory from "./components/full-history.component"
import ForgotPassword from "./components/forgot-password.component"
import ResetPassword from "./components/reset-password.component"
import Chart from "./components/chart.component"
import PrivateRoute from "./components/private-route/PrivateRoute"
import setAuthToken from "./utils/setAuthToken"
import { setCurrentUser, logoutUser } from "./components/actions/authActions"

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
        <Route path="/login" component={EntryPage} />
        <Route path="/createuser" component={CreateUser} />
        <Route path="/forgotpassword" component={ForgotPassword} />
        <Route path="/resetpassword" component={ResetPassword} />
        <Switch>
          <PrivateRoute exact path="/loggedin" component={LoggedIn} />
          <PrivateRoute path="/fullhistory" component={FullHistory} />
          <PrivateRoute path="/chart" component={Chart} />
          {isTokenExpired && <Redirect to="/login" />} {/* Redirect on expired token */}
        </Switch>
      </Router>
    </Provider>
  )
}

export default App;
