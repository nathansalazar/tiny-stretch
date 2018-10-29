import React, { Component } from 'react';
import { GoogleMap, withGoogleMap, withScriptjs, Marker } from 'react-google-maps';
import {connect} from 'react-redux';

class AddPlaygroundMap extends Component {

    state = {
        location: {
            lat: this.props.location.lat,
            lng: this.props.location.lng,
        },
        zoom: 4,
        mapClicked: false,
        name: '',
        description: '',
        state: '',
    }

    handleClick = (event) => {
        this.setState({ location: { lat: event.latLng.lat(), lng: event.latLng.lng() }, zoom: Math.max(10, this.gmap.props.zoom), mapClicked: true });
        console.log('You clicked on', this.state);
        // console.log(this.gmap.__reactInternalMemoizedMaskedChildContext.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.zoom);
    }

    handleChange = (property) => (event) => {
        this.setState({ [property]: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('Playground:',this.state);
        this.props.dispatch({type: 'POST_PLAYGROUND', payload: {...this.state, photoReference: 'https://causeofaction.org/wp-content/uploads/2013/09/Not-available.gif', added_by: this.props.user.id}});
        console.log('payload:',{...this.state, photoReference: 'https://causeofaction.org/wp-content/uploads/2013/09/Not-available.gif', added_by: this.props.user.id});
    }

    render() {
        return <div>
            <GoogleMap
                center={this.state.location}
                zoom={this.state.zoom}
                onClick={this.handleClick}
                ref={(googleMap) => this.gmap = googleMap}>
                {this.state.mapClicked && <Marker position={this.state.location} />}
            </GoogleMap>
            {this.state.mapClicked ?
                <div>
                <form id="playgroundForm" onSubmit={this.handleSubmit}>
                    <input value={this.state.location.lat} readOnly="readOnly"/>
                    <input value={this.state.location.lng} readOnly="readOnly"/>
                    <input onChange={this.handleChange('state')} placeholder="State" />
                    <input onChange={this.handleChange('name')} placeholder="Playground Name" />
                    {/* <input onChange={this.handleChange('description')} placeholder="Description" /> */}
                    <input type="button" value="Submit" onClick={this.handleSubmit}/>
                </form>
                <textarea rows="4" cols="50" 
                    form="playgroundForm" onChange={this.handleChange('description')} 
                    placeholder="Description"
                    style={{margin: "auto"}}/>
                </div>:
                <p>Click on the map to get started</p>
            }

        </div>
    }
}

export default connect()(withScriptjs(withGoogleMap(AddPlaygroundMap)));