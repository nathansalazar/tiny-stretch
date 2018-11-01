import axios from 'axios';


let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY&v=3.exp&libraries=geometry,drawing,places');
// xhr.send();

// const playgroundObject = yield axios('/', {
//             headers: { 'Access-Control-Allow-Origin': 'http://10.100.100.158/3000' },
//             method: 'GET',
//             // url: `https://maps.googleapis.com/maps/api/place/textsearch/json?type=park&keyword=playground&location=42,-90&radius=10000&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`,
//             url: `https://maps.googleapis.com/maps/api/place/textsearch/json?type=park&keyword=playground&location=${action.payload.lat},${action.payload.lng}&radius=${Math.max(10000,action.radius)}&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`,
//           })


//this is a nearby search
export const searchNearby =  (lat, lng, radius, proxy) => {
    // return axios.get(`https://cors.io/?https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=park&keyword=playground&location=${lat},${lng}&radius=${Math.max(10000,radius)}&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`);
    return axios.get(`${proxy}https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=park&keyword=playground&location=${lat},${lng}&radius=${Math.max(10000,radius)}&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`);

    // return axios.get(xhr.send());
}

//this is a text search
// export function searchNearby(lat,lng,radius){
//     return axios.get(`https://cors.io/?https://maps.googleapis.com/maps/api/place/textsearch/json?query=playground&location=${lat},${lng}&radius=${Math.max(10000,radius)}&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`);
// }
