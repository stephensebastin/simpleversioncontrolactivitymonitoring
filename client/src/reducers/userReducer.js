
import { FETCH_USER_INFO, UPDATE_USER_INFO } from "../stores/actiontypes/userActionTypes";

const initialState = {
    userInfo: null
}


const userReducer = (state =initialState, action) => {
    switch(action.type) {
        case UPDATE_USER_INFO: return {
            userInfo: action.payload
        };
        /* break; */
/*         case FETCH_USER_INFO: return state; */
        default: return state
    }
}

export default userReducer