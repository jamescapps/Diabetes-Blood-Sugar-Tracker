import axios from "axios"
import setAuthToken from "../utils/setAuthToken"
import jwt_decode from "jwt-decode"
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types"


export const loginUser = userData => async dispatch => {
  try {
    const res = await axios.post('/login/login', userData)

    const { token } = res.data
    localStorage.setItem("jwtToken", token)
    setAuthToken(token)

    const decoded = jwt_decode(token)

    dispatch(setCurrentUser(decoded))
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { message: "Error occurred" }
    })
  }
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
