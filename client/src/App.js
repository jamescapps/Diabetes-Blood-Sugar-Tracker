import React from 'react'
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
  const token = localStorage.jwtToken

  if (token) {
    setAuthToken(token)
    const decoded = jwt_decode(token)
    store.dispatch(setCurrentUser(decoded))

    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
      store.dispatch(logoutUser())
      return true // Indicates the token is expired
    }
  }
  return false // Indicates the token is valid or not present
}

function App() {
  const isTokenExpired = checkAuthToken()

  if (isTokenExpired) {
    return <Redirect to="/login" />
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
        </Switch>
      </Router>
    </Provider>
  )
}

export default App