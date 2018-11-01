import axios from 'axios';
import {put, takeEvery, takeLatest, select} from 'redux-saga/effects';
import distanceBetweenPoints from '../../auxiliaryFunctions/distanceBetweenPoints';
import {searchNearby} from '../requests/playgroundRequests';

const trimDownPlayground = (playground) => {
    let photoReference = '';
            if(playground.photos){
                photoReference = playground.photos[0].photo_reference;
            }
    return {name: playground.name, location: playground.geometry.location, id: playground.place_id, types: playground.types, photoReference: photoReference};
}

function* searchParks (action) {
    try{
        const proxyToUse = yield select(state => state.proxy);
        const playgroundObject = yield searchNearby(action.payload.lat, action.payload.lng, action.radius, proxyToUse);

        // const playgroundObject = yield axios('/', {
        //     headers: { 'Access-Control-Allow-Origin': 'http://localhost:3000', 'Access-Control-Allow-Methods': 'GET' },
        //     method: 'GET',
        //     // url: `https://maps.googleapis.com/maps/api/place/textsearch/json?type=park&keyword=playground&location=42,-90&radius=10000&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`,
        //     url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=park&keyword=playground&location=${action.payload.lat},${action.payload.lng}&radius=${Math.max(10000,action.radius)}&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`,
        //   })

        const allInfoOnPlaygrounds = playgroundObject.data.results;
        //allInfoOnPlaygrounds is an array of objects with a ton of properties,
        //most of which we don't care about. So we trim down to just what we need
        let playgrounds = [];
        if(allInfoOnPlaygrounds.length>0){
            playgrounds = allInfoOnPlaygrounds.map(playground => trimDownPlayground(playground));
        }
        let filteredPlaygrounds = playgrounds.filter( pg => distanceBetweenPoints(pg.location, action.payload) < action.radius && !pg.types.includes('campground') );
        yield put({type: 'SET_PLAYGROUNDS', payload: filteredPlaygrounds});
    } catch (error) {
        console.log('Error in searchParks:',error);
    }
}


function* postPlayground (action) {
    try{
        yield axios.post('/api/park', action.payload).then((response)=>{
            console.log('Response:',response);
        })
    }catch(error){
        console.log('Error in postPlayground:',error);
    }
}

function* addDescription (action) {
    try{
        if(action.payload.firstReview){
            //if this is the first review, we make an entry in TABLE park_description
            yield axios.post('/api/park/description', action.payload);
        }
        else{
            //otherwise we update TABLE park_description
            yield axios.put(`/api/park`,action.payload);
        }
        yield getParksInState( {payload: action.payload.postal_code} );
    }catch(error){
        console.log('Error in addDescription:',error);
    }
}

function* getParksInState (action) {
    try{
        const response = yield axios.get(`/api/park/${action.payload}`);
        const parksInState = response.data;
        yield put({type: 'SET_PARKS', payload: parksInState});
    }catch(error){
        console.log('Error in getParksInState');
    }
}

function* playgroundSaga () {
    yield takeEvery('SEARCH_PLAYGROUNDS', searchParks);
    yield takeLatest('POST_PLAYGROUND', postPlayground);
    yield takeEvery('ADD_DESCRIPTION', addDescription);
    yield takeEvery('GET_PARKS_IN_STATE', getParksInState);
}


export default playgroundSaga;