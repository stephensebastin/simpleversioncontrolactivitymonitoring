import { applyMiddleware, createStore} from 'redux';
/* import { fetchUserInfo, updateUserInfo } from "../stores/actions/userinfo"; */
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger'

import userReducer from '../reducers/userReducer';


const userStore = createStore(userReducer,composeWithDevTools(applyMiddleware(logger)));

export default userStore;