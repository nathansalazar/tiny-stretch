import axios from 'axios';

//this is a nearby search
export function searchNearby (lat, lng, radius) {
    return axios.get(`https://cors.io/?https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=park&keyword=playground&location=${lat},${lng}&radius=${Math.max(10000,radius)}&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`);
}

//this is a text search
// export function searchNearby(lat,lng,radius){
//     return axios.get(`https://cors.io/?https://maps.googleapis.com/maps/api/place/textsearch/json?query=playground&location=${lat},${lng}&radius=${Math.max(10000,radius)}&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`);
// }