import axios from 'axios';
import {put, takeEvery} from 'redux-saga/effects';


function* getUsernames(){
    try{
        const response = yield axios.get('/api/user/usernames');
        //we just want an array of usernames
        const usernames = response.data.map(usernameObject => usernameObject.username);
        yield put({type: 'SET_USERNAMES', payload: usernames});
    }catch(error){
        console.log('Error getting usernames:',error);
    }
}

function* usernamesSaga(){
    yield takeEvery('GET_USERNAMES',getUsernames);
}

export default usernamesSaga;