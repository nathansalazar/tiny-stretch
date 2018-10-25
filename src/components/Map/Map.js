/* global google */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GoogleMap, withGoogleMap, withScriptjs, Marker, DirectionsRenderer } from "react-google-maps";
import distanceBetweenPoints from '../../auxiliaryFunctions/distanceBetweenPoints';
import { PLAYGROUND_ACTIONS } from '../../redux/actions/playgroundActions';
import axios from 'axios';

const mapStateToProps = state => ({
    state,
});

let photo = '';

class Map extends Component {

    state = {
        directions: {},
        // route: {
        //     origin: 'shelbyville, ky',
        //     destination: 'iowa city, ia',
        //     radius: 20000
        // }
        selectedMarker: {},
        address: ''
    }

    onMarkerClick = (playground) => {
        console.log('You clicked on:', playground);
        this.setState({ selectedMarker: playground });
        if (playground.photoReference) {
            photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${playground.photoReference}&sensor=false&key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY`;
        } else {
            photo = `https://causeofaction.org/wp-content/uploads/2013/09/Not-available.gif`;
        }
        let geocoder = new google.maps.Geocoder;
        geocoder.geocode({ 'placeId': playground.id }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    console.log('results:', results)
                    let state = results[0].address_components.filter(component => component.types[0] === 'administrative_area_level_1')[0].short_name;
                    console.log('State:', state);
                    this.props.dispatch({ type: 'POST_PLAYGROUND', payload: { ...playground, photoReference: photo, state: state } })
                    this.setState({ address: results[0].formatted_address });
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        })
        console.log('Photo url:', photo);
    }

    plotRouteAndParks = (route) => {
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route({
            origin: route.origin,
            destination: route.destination,
            travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.setState({
                    directions: result
                });
                let polyline = new google.maps.Polyline({
                    path: [],
                });
                console.log(result);
                let legs = result.routes[0].legs;
                for (let i = 0; i < legs.length; i++) {
                    let steps = legs[i].steps;
                    for (let j = 0; j < steps.length; j++) {
                        let nextSegment = steps[j].path;
                        for (let k = 0; k < nextSegment.length; k++) {
                            polyline.getPath().push(nextSegment[k]);
                        }
                    }
                }
                console.log('Polyline:', polyline);
                console.log(Object.keys(polyline.latLngs));

                // we initialize our checkpoints with the first latLng from polyline
                let lastSearch = { lat: polyline.latLngs.j[0].j[0].lat(), lng: polyline.latLngs.j[0].j[0].lng() };
                let distanceTraveledMeters = 0;
                let searchAt = []; //an array of coordinates at which to search
                let stepBeginning; //we keep track of each beginning/end of each step of the trip
                let stepEnd = lastSearch;
                for (let step of polyline.latLngs.j[0].j) {
                    stepBeginning = stepEnd;
                    stepEnd = { lat: step.lat(), lng: step.lng() };
                    let segmentDistance = distanceBetweenPoints(stepEnd, stepBeginning);
                    distanceTraveledMeters = distanceTraveledMeters + segmentDistance;
                    if (distanceBetweenPoints(stepEnd, lastSearch) > route.radius * 2) {
                        lastSearch = stepEnd;
                        searchAt.push(lastSearch);
                        this.props.dispatch({ type: PLAYGROUND_ACTIONS.SEARCH_PLAYGROUNDS, payload: lastSearch, radius: route.radius });
                    }
                }
                console.log('We search at:', searchAt);
                console.log('polyline.latLngs.b[0].b', polyline.latLngs.j[0].j);
                this.props.dispatch({ type: 'SET_CHECKPOINTS', payload: searchAt });
            } else {
                console.error(`error fetching directions ${result}`);
            }
        });
    }

    routesEqual = (route1, route2) => {
        return route1.origin === route2.origin && route1.destination === route2.destination && route1.radius === route2.radius;
    }

    componentDidUpdate(prevProps) {
        if (this.routesEqual(prevProps.state.route, this.props.state.route)) {
            return null;
        } else {
            this.plotRouteAndParks(this.props.state.route);
        }
    }

    render() {

        return (
            <div>
                <div>
                    Test
                    <GoogleMap
                        defaultCenter={this.props.location}
                        defaultZoom={4}
                    >
                        {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
                        {this.props.state.checkpoints.map((checkpoint, index) =>
                            <Marker key={index} position={checkpoint} title={JSON.stringify(checkpoint)} label='Search' />
                        )}
                        {this.props.state.playgrounds.map((playground, index) =>
                            <Marker key={index} position={playground.location} title={playground.name} onClick={() => this.onMarkerClick(playground)} />)}

                    </GoogleMap>
                    <div>
                        <h3>More Info</h3>
                        <p>{JSON.stringify(this.state.selectedMarker)}</p>
                        <p>{JSON.stringify(this.state.address)}</p>
                        <img src={photo} style={{ maxWidth: "400px" }} />
                    </div>
                    {JSON.stringify(this.props, null, 2)}
                </div>
            </div>
        );
    }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(withScriptjs(withGoogleMap(Map)));