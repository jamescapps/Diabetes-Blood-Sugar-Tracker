import { SET_CURRENT_USER, USER_LOADING } from "../actions/types"
import isEmpty from "is-empty"

const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false,
}

export default function authReducer(state = initialState, { type, payload }) {
    switch (type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(payload),
                user: payload,
                loading: false, // You might want to set loading to false after user is set
            };
        case USER_LOADING:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
}
