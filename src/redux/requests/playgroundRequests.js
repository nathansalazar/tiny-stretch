import axios from 'axios';

/*
let xhr = new XMLHttpRequest();
xhr.open('GET', `https://maps.googleapis.com/maps/api/js?key=${APIkey}&v=3.exp&libraries=geometry,drawing,places`);
xhr.send();

const playgroundObject = yield axios('/', {
            headers: { 'Access-Control-Allow-Origin': 'http://10.100.100.158/3000' },
            method: 'GET',
            // url: `https://maps.googleapis.com/maps/api/place/textsearch/json?type=park&keyword=playground&location=42,-90&radius=10000&key=${APIkey}`,
            url: `https://maps.googleapis.com/maps/api/place/textsearch/json?type=park&keyword=playground&location=${action.payload.lat},${action.payload.lng}&radius=${Math.max(10000,action.radius)}&key=${APIkey}`,
          })
*/

//we use one of these web proxies to deal with the CORS errors
let proxies = ['http://cors-anywhere.herokuapp.com/','https://cors.io/?','https://cors-proxy.htmldriven.com/?url='];
//this is a nearby search
export const searchNearby =  (lat, lng, radius, proxyIndex, APIkey) => {
    // return axios.get(`https://cors.io/?https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=park&keyword=playground&location=${lat},${lng}&radius=${Math.max(10000,radius)}&key=${APIkey}`);
    return axios.get(`${proxies[proxyIndex]}https://maps.googleapis.com/maps/api/place/nearbysearch/json?type=park&keyword=playground&location=${lat},${lng}&radius=${Math.max(10000,radius)}&key=${APIkey}`);

    // return axios.get(xhr.send());
}

//this is a text search
// export function searchNearby(lat,lng,radius){
//     return axios.get(`https://cors.io/?https://maps.googleapis.com/maps/api/place/textsearch/json?query=playground&location=${lat},${lng}&radius=${Math.max(10000,radius)}&key=${APIkey}`);
// }
