import React, { Component } from 'react';
import Nav from '../Nav/Nav';
import StateMap from '../StateMap/StateMap';

class searchByStatePage extends Component {
    
    render() {
        return <div>
            <Nav />
            Search by State Page
            <StateMap
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY&v=3.exp&libraries=places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />} 
                />
            
        </div>
    }
}

export default searchByStatePage;