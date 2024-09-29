import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";

const initialState = {
    message: null,
    status: null,
}

export default function errorReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            console.error("Error occurred:", action.payload); // Optional: log the error
            return {
                ...state,
                message: action.payload.message || "An error occurred",
                status: action.payload.status || null,
            };
        case CLEAR_ERRORS:
            return initialState; // Resetting the error state
        default:
            return state;
    }
}
