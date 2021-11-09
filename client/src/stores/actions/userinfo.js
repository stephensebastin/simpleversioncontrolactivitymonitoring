
import { UPDATE_USER_INFO, FETCH_USER_INFO } from "../actiontypes/userActionTypes"

export const updateUserInfo = (userInfo) => {
    return {
        type:UPDATE_USER_INFO,
        payload:userInfo
    }
}


export const fetchUserInfo = () => {
    return {
        type:FETCH_USER_INFO,
       /*  payload:userInfo */
    }
}

