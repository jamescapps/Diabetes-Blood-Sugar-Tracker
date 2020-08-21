import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store"

import EntryPage from "./components/entry-page.component"
import LoggedIn from "./components/logged-in.component.js"
import CreateUser from "./components/create-user.component"
import FullHistory from "./components/full-history.component"
import ForgotPassword from "./components/forgot-password.component"
import ResetPassword from "./components/reset-password.component"
import Chart from "./components/chart.component"

import PrivateRoute from "./components/private-route/PrivateRoute"
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./components/actions/authActions"


// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken
  setAuthToken(token)
  // Decode token and get user info and exp
  const decoded = jwt_decode(token)
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded))
// Check for expired token
  const currentTime = Date.now() / 1000 // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser())
    // Redirect to login
    window.location.href = "./login"
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Route path = "/login" component={EntryPage} />
        <Route path = "/createuser" component={CreateUser} />
        <Route path = "/forgotpassword" component={ForgotPassword} />
        <Route path = "/resetpassword" component={ResetPassword} />
        <Switch>
            <PrivateRoute exact path="/loggedin" component={LoggedIn} />
            <PrivateRoute path = "/fullhistory" component={FullHistory} />
            <PrivateRoute path = "/chart" component={Chart} />
        </Switch>
      </Router>
    </Provider>
  );
}


export default App