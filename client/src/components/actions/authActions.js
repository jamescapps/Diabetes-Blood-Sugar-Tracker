import axios from "axios"
import setAuthToken from "./utils/setAuthToken"
import jwt_decode from "jwt-decode"
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types"

export const loginUser = userData => dispatch => {
  axios
    .post('/login/login', userData)
    .then(res => {
      const { token } = res.data
      // Save token to localStorage and set it in axios headers
      localStorage.setItem("jwtToken", token)
      setAuthToken(token)

      // Decode token to get user data and set current user
      const decoded = jwt_decode(token)
      dispatch(setCurrentUser(decoded))
    })
    .catch(err => {
      const errorPayload = err.response ? err.response.data : { msg: "An error occurred" }
      dispatch({
        type: GET_ERRORS,
        payload: errorPayload
      })
    })
}

export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
})

export const setUserLoading = () => ({
  type: USER_LOADING
})

export const logoutUser = () => dispatch => {
  localStorage.removeItem("jwtToken")
  setAuthToken(false)
  dispatch(setCurrentUser({}))
}
