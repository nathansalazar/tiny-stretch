import axios from 'axios';
import {put, takeEvery} from 'redux-saga/effects';


function* getAPIkey(){
    try{
        const response = yield axios.get('/api/user/key');
        const APIkey = response.data;
        yield put({type: 'SET_API_KEY', payload: APIkey});
    }catch(error){
        console.log('Error getting API key:',error);
    }
}

function* APIkeySaga(){
    yield takeEvery('GET_API_KEY',getAPIkey);
}

export default APIkeySaga;