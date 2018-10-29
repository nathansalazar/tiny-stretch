import axios from 'axios';
import {put, takeEvery, takeLatest, call} from 'redux-saga/effects';
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
        //this is a textSearch
        // const playgroundObject = yield axios.get(`https://cors.io/?https://maps.googleapis.com/maps/api/place/textsearch/json?query=playground&location=${action.payload.lat},${action.payload.lng}&radius=${action.radius}&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`);
        
        //and this is a nearbySearch
        // const playgroundObject = yield axios.get(`https://cors.io/?https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=park&keyword=playground&location=${action.payload.lat},${action.payload.lng}&radius=${Math.max(10000,action.radius)}&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`);
        const playgroundObject = yield searchNearby(action.payload.lat, action.payload.lng, action.radius);

        // const playgroundObject = yield axios('/', {
        //     headers: { 'Access-Control-Allow-Origin': '*' },
        //     method: 'GET',
        //     url: `https://maps.googleapis.com/maps/api/place/textsearch/json?type=park&keyword=playground&location=42,-90&radius=10000&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`,
        //     // url: `https://maps.googleapis.com/maps/api/place/textsearch/json?type=park&keyword=playground&location=${action.payload.lat},${action.payload.lng}&radius=${Math.max(10000,action.radius)}&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`,
        //   })
        const allInfoOnPlaygrounds = playgroundObject.data.results;
        //allInfoOnPlaygrounds is an array of objects with a ton of properties,
        //most of which we don't care about. So we trim down to just what we need
        let playgrounds = [];
        if(allInfoOnPlaygrounds.length>0){
            playgrounds = allInfoOnPlaygrounds.map(playground => trimDownPlayground(playground));
        }
        let filteredPlaygrounds = playgrounds.filter( pg => distanceBetweenPoints(pg.location, action.payload) < action.radius );
        console.log(`We searched at (${action.payload.lat},${action.payload.lng}) and found:`,filteredPlaygrounds);
        yield put({type: 'SET_PLAYGROUNDS', payload: filteredPlaygrounds});
    } catch (error) {
        console.log('Error in searchParks:',error);
    }
}


function* postPlayground (action) {
    try{
        console.log('POST_PLAYGROUND:',action.payload);
        yield axios.post('/api/park', action.payload).then((response)=>{
            console.log('Response:',response);
        }).catch((error)=>{
            console.log('Error in POST:',error);
        })
    }catch(error){
        console.log('Error in postPlayground:',error);
    }
}

function* playgroundSaga () {
    yield takeEvery('SEARCH_PLAYGROUNDS', searchParks);
    yield takeLatest('POST_PLAYGROUND', postPlayground);
}


export default playgroundSaga;