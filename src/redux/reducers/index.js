import { combineReducers } from 'redux';
import user from './userReducer';
import login from './loginReducer';
import route from './routeReducer';
import checkpoints from './checkpointReducer';
import playgrounds from './playgroundReducer';
import parksInState from './parksInStateReducer';
import usernames from './usernamesReducer';
import proxy from './proxyReducer';

//Lets make a bigger object for our store, with the objects from our reducers.
//This is why we get this.props.reduxStore.user.isLoading
const store = combineReducers({
  user,
  login,
  route,
  checkpoints,
  playgrounds,
  parksInState,
  usernames,
  proxy,
});

export default store;
