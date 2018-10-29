/* global google */
import React, { Component } from 'react';
import { GoogleMap, withGoogleMap, withScriptjs, Marker } from 'react-google-maps';

class AddPlaygroundMap extends Component {

    state = {
        coordinates: {
            lat: this.props.location.lat,
            lng: this.props.location.lng,
        },
        zoom: 4,
        mapClicked: false,
        playgroundName: '',
        description: '',
    }

    handleClick = (event) => {
        this.setState({ coordinates: { lat: event.latLng.lat(), lng: event.latLng.lng() }, zoom: Math.max(10, this.gmap.props.zoom), mapClicked: true });
        console.log('You clicked on', this.state);
        // console.log(this.gmap.__reactInternalMemoizedMaskedChildContext.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.zoom);
    }

    handleChange = (property) => (event) => {
        this.setState({ [property]: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('Playground:',this.state);
        console.log('Added by user number:',this.props.user.id);
    }

    render() {
        return <div>
            <GoogleMap
                center={this.state.coordinates}
                zoom={this.state.zoom}
                onClick={this.handleClick}
                ref={(googleMap) => this.gmap = googleMap}>
                {this.state.mapClicked && <Marker position={this.state.coordinates} />}
            </GoogleMap>
            {this.state.mapClicked ?
                <div>
                <form id="playgroundForm" onSubmit={this.handleSubmit}>
                    <input value={this.state.coordinates.lat} readOnly="readOnly"/>
                    <input value={this.state.coordinates.lng} readOnly="readOnly"/>
                    <input onChange={this.handleChange('playgroundName')} placeholder="Playground Name" />
                    {/* <input onChange={this.handleChange('description')} placeholder="Description" /> */}
                    <input type="button" value="Submit" onClick={this.handleSubmit}/>
                </form>
                <textarea rows="4" cols="50" 
                    form="playgroundForm" onChange={this.handleChange('description')} 
                    placeholder="Description"
                    style={{margin: "auto"}}/>
                </div>:
                <p>Click the park on the map to get started</p>
            }

        </div>
    }
}

export default withScriptjs(withGoogleMap(AddPlaygroundMap));