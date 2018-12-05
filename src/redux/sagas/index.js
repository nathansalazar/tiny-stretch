import { all } from 'redux-saga/effects';
import userSaga from './userSaga';
import loginSaga from './loginSaga';
import playgroundSaga from './playgroundSaga';
import usernamesSaga from './usernamesSaga';
import APIkeySaga from './APIkeySaga';



export default function* rootSaga() {
  yield all([
    userSaga(),
    loginSaga(),
    playgroundSaga(),
    usernamesSaga(),
    APIkeySaga(),
  ]);
}
