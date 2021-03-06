/* global google */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GoogleMap, withGoogleMap, withScriptjs, Marker, DirectionsRenderer, Circle } from "react-google-maps";
import distanceBetweenPoints from '../../auxiliaryFunctions/distanceBetweenPoints';
import { PLAYGROUND_ACTIONS } from '../../redux/actions/playgroundActions';
import axios from 'axios';

const mapStateToProps = state => ({
    state,
});

//we give our photos a default image
let photo = 'https://causeofaction.org/wp-content/uploads/2013/09/Not-available.gif';

class Map extends Component {

    state = {
        selectedMarker: {},
        address: '',
        waypoints: [],
        instructions: [],
        directions: {},
    }

    componentDidMount = () => {
        if (this.props.state.usernames.length === 0) {
            this.props.dispatch({ type: 'GET_USERNAMES' });
        }
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

    onMarkerClick = (playground) => {
        // console.log('You clicked on:', playground);
        this.setState({ selectedMarker: playground });
        //first we check if the park is already in the database
        axios.get(`/api/park/check_database/${playground.id}`).then((response) => {
            if (response.data.length > 0) {//if already in the database, get the description and user_id info
                console.log('Park is already in the database!');
                this.setState({
                    selectedMarker: {
                        ...playground,
                        description: response.data[0].description,
                        user_id: response.data[0].user_id
                    }
                });
                photo = response.data[0].photo_reference;
            }
            //then post it to the database with info from Geocoder (the server will check first 
            //if it's already in the database)
            //get the associated photo
            if (playground.photoReference) {
                photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${playground.photoReference}&sensor=false&key=${this.props.state.APIkey}`;
            } else {
                photo = 'https://causeofaction.org/wp-content/uploads/2013/09/Not-available.gif';
            }
            //get the state
            let geocoder = new google.maps.Geocoder();
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

        })
        // if (databaseResult() > 0) {
        // }
        // else {
        //     //get the associated photo
        //     if (playground.photoReference) {
        //         photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${playground.photoReference}&sensor=false&key=${this.props.state.APIkey}`;
        //     } else {
        //         photo = 'https://causeofaction.org/wp-content/uploads/2013/09/Not-available.gif';
        //     }
        //     //get the state
        //     let geocoder = new google.maps.Geocoder;
        //     geocoder.geocode({ 'placeId': playground.id }, (results, status) => {
        //         if (status === 'OK') {
        //             if (results[0]) {
        //                 console.log('results:', results)
        //                 let state = results[0].address_components.filter(component => component.types[0] === 'administrative_area_level_1')[0].short_name;
        //                 console.log('State:', state);
        //                 this.props.dispatch({ type: 'POST_PLAYGROUND', payload: { ...playground, photoReference: photo, state: state } })
        //                 this.setState({ address: results[0].formatted_address });
        //             } else {
        //                 window.alert('No results found');
        //             }
        //         } else {
        //             window.alert('Geocoder failed due to: ' + status);
        //         }
        //     })
        // }
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
                // console.log(result);
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
                // console.log('Polyline:', polyline);
                console.log('Polyline keys:', Object.keys(polyline.latLngs));

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
                    if (distanceBetweenPoints(stepEnd, lastSearch) > route.radius * 1.5) {
                        lastSearch = stepEnd;
                        searchAt.push(lastSearch);
                        this.setState({ searchAt: [...searchAt, lastSearch] });
                        this.props.dispatch({ type: PLAYGROUND_ACTIONS.SEARCH_PLAYGROUNDS, payload: lastSearch, radius: route.radius });
                    }
                }
                console.log('We search at:', searchAt);
                // console.log('polyline.latLngs.b[0].b', polyline.latLngs.j[0].j);
                this.props.dispatch({ type: 'SET_CHECKPOINTS', payload: searchAt });
            } else {
                console.error(`error fetching directions ${result}`);
            }
        });
    }


    addPark = () => {
        this.setState({ waypoints: [...this.state.waypoints, { location: this.state.address, name: this.state.selectedMarker.name }] });
    }

    //Once we've added some waypoints this function will recalculate the new route
    routeWithWaypoints = (route) => {
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route({
            origin: route.origin,
            destination: route.destination,
            waypoints: this.state.waypoints.map(waypoint => { return { location: waypoint.location } }),
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.props.dispatch({ type: PLAYGROUND_ACTIONS.CLEAR_PLAYGROUNDS });
                this.setState({
                    directions: result
                });
                console.log(this.state.directions);
                let legs = result.routes[0].legs;
                let directions = [];
                // let waypointsIndex = 0;
                for (let leg of legs) {
                    for (let i = 0; i < leg.steps.length; i++) {
                        if (i === leg.steps.length - 1) {
                            directions.push({ text: leg.steps[i].instructions, distance: leg.steps[i].distance.text, finalStep: true });
                            // directions.push({ text: `Arrive at ${this.state.waypoints[waypointsIndex].name}`, distance: null, finalStep: true });
                            // waypointsIndex++;
                        } else {
                            directions.push({ text: leg.steps[i].instructions, distance: leg.steps[i].distance.text, finalStep: false });
                        }
                    }
                }
                this.setState({ instructions: directions });
            } else {
                console.error(`error fetching directions ${result}`);
            }
        }
        )
    }

    //The directions returned by Google have html elements inside them (like <b>),
    //so we use this function to remove them and get only the text.
    strip = (html) => {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        let tempString = tmp.textContent || tmp.innerText || "";
        //this next bit formats the driving directions since the 'strip' function
        //ends up pushing together the ends/starts of sentences
        let addSpaceObject = {
            "Destination": '. Destination',
            "Continue": ' Continue',
            "Entering": '. Entering',
            "Pass": '. Pass'
        }
        let formattedInstructions = tempString.replace(/Destination|Continue|Entering|Pass/,
            function (matchedString) { return addSpaceObject[matchedString] });
        // return tmp.textContent || tmp.innerText || "";
        return formattedInstructions;
    }

    switchProxy = () => {
        this.props.dispatch({ type: 'SWITCH_PROXY' });
    }


    //-----------------------------------------------------------------------------------------------------

    render() {

        return (
            <div >
                <div>
                    <GoogleMap
                        defaultCenter={this.props.location}
                        defaultZoom={4}
                    >
                        {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
                        {/* {this.props.state.checkpoints.map((checkpoint, index) =>
                            <Marker key={index} position={checkpoint} title={JSON.stringify(checkpoint)} label='Search' />
                        )} */}
                        {this.props.state.playgrounds.map((playground, index) =>
                            <Marker key={index} position={playground.location} title={playground.name} onClick={() => this.onMarkerClick(playground)} />)}

                        {this.props.state.checkpoints.map((checkpoint, index) => <Circle key={index}
                            center={checkpoint} radius={this.props.state.route.radius} options={{ fillOpacity: "0.1", strokeColor: 'green', strokeOpacity: '0.1' }} />)}
                    </GoogleMap>
                    <div className="container" >
                    <br />
                        <h3 onClick={this.switchProxy} style={{width: '50%', marginLeft: '30%'}}><font size="+3"><b>Click a Marker for More Info</b></font></h3>
                        <div className="row justify-content-between" >
                            {/* this.state.selectedMarker.name && */}
                            {this.state.selectedMarker.name && <div className="col-5 card">
                                <h4 style={{textAlign: 'center'}}>{this.state.selectedMarker.name}</h4>
                                <p style={{textAlign: 'center'}}>{this.state.address}</p>
                                <img src={photo} alt={"park"} style={{ maxWidth: "300px", margin: 'auto' }} />

                                <br />
                                <button onClick={this.addPark} className="btn btn-secondary">Add this park to your trip</button>
                                <br />
                                <button onClick={() => this.routeWithWaypoints(this.props.state.route)} className="btn btn-secondary">Map your new route</button>
                                {this.state.waypoints.length>0 &&
                                    <div style={{ maxWidth: "300px", margin: 'auto' }} >
                                        <p>Parks on Your Route:</p>
                                        <table>
                                            <tbody>
                                            {this.state.waypoints.map((waypoint, index) => <tr key={index}><td>{waypoint.name}</td></tr>)}
                                            </tbody>
                                        </table>
                                    </div>}
                            </div>}
                            <br />
                            {/* this.state.selectedMarker.description && */}
                            {this.state.selectedMarker.name && <div className="col-6 card" style={{ color: 'black'}}>
                                <h3 style={{textAlign: 'center'}}>User Reviews</h3>
                                {/* show all descriptions */}
                                {this.state.selectedMarker.description &&
                                    <table><tbody style={{ color: 'black' }}>
                                        {this.state.selectedMarker.description.map((text, index) => (<div><tr key={index}>
                                            <td><b><font size="+1">
                                                {this.props.state.usernames[this.state.selectedMarker.user_id[index] - 1]}
                                                </font></b></td></tr>
                                                <tr key={(index + 1) * 100}><td><font size="-1">{text}</font></td></tr>
                                                <tr key={(index + 2) * 200}><td></td></tr>
                                                </div>))}
                                    </tbody></table>}
                            </div>}

                            {/* <p>Parks at which you are stopping:</p>
                            <ul>
                                {this.state.waypoints.map((waypoint, index) => <li key={index}>{JSON.stringify(waypoint.name)}</li>)}
                            </ul> */}
                        </div>
                        {/* <p>Parks currently in waypoints: {JSON.stringify(this.state.waypoints)}</p> */}
                    </div>
                    {/* this table shows the directions */}
                    <table style={{ background: 'linear-gradient(-45deg,green,white)', color: 'black' }} >
                        <tbody>
                            {this.state.instructions.map((instruction, index) => {
                                if (instruction.finalStep) { /*if it's the final step, put text in bold */
                                    return (<tr key={index}>
                                        <td><b><font size="+2">{this.strip(instruction.text)}</font></b></td>
                                        <td>{instruction.distance}</td>
                                    </tr>);
                                } else {
                                    return (<tr key={index}>
                                        <td>{this.strip(instruction.text)}</td>
                                        <td>{instruction.distance}</td>
                                    </tr>);
                                }
                            })}
                        </tbody>
                    </table>
                </div>
                <br />
                {/* <button onClick={this.switchProxy}>switch proxy</button> */}
                <br />
                {/* <pre>{JSON.stringify(this.state, null, 2)}</pre> */}
            </div>
        );
    }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(withScriptjs(withGoogleMap(Map)));