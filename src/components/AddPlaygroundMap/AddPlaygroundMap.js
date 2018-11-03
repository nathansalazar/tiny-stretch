import React, { Component } from 'react';
import { GoogleMap, withGoogleMap, withScriptjs, Marker } from 'react-google-maps';
import { connect } from 'react-redux';
import Select from 'react-select';
import axios from 'axios';

class AddPlaygroundMap extends Component {

    state = {
        location: {
            lat: this.props.location.lat,
            lng: this.props.location.lng,
        },
        selectedState: { center_lat: 41, center_lng: -98, zoom: 4 },
        zoom: 4,
        mapClicked: false,
        name: '',
        description: '',
        state: '',
        allStates: []
    }

    componentDidMount = () => {
        axios.get('/api/states').then((response) => {
            this.setState({ allStates: response.data });
        }).catch((error) => {
            console.log('Error in GET /states:', error);
        })
    }

    handleClick = (event) => {
        this.setState({ location: { lat: event.latLng.lat(), lng: event.latLng.lng() }, 
            selectedState: { center_lat: event.latLng.lat(), center_lng: event.latLng.lng(), zoom: this.gmap.props.zoom },
            zoom: Math.max(10, this.gmap.props.zoom), mapClicked: true });
        console.log('You clicked on', this.state);
        // console.log(this.gmap.__reactInternalMemoizedMaskedChildContext.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.zoom);
    }

    handleChange = (property) => (event) => {
        this.setState({ [property]: event.target.value });
    }

    handleStateSelection = (state) => {
        this.setState({ state: state.postal_code, selectedState: state });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('Playground:', this.state);
        if (this.state.state && this.state.name) {
            this.props.dispatch({ type: 'POST_PLAYGROUND', payload: { ...this.state, photoReference: 'https://causeofaction.org/wp-content/uploads/2013/09/Not-available.gif', added_by: this.props.user.id } });
            console.log('payload:', { ...this.state, photoReference: 'https://causeofaction.org/wp-content/uploads/2013/09/Not-available.gif', added_by: this.props.user.id });
        } else {
            alert('You must enter a name and choose the state');
        }

    }

    render() {
        return <div>
            <GoogleMap
                center={{ lat: Number(this.state.selectedState.center_lat), lng: Number(this.state.selectedState.center_lng) }}
                zoom={this.state.selectedState.zoom}
                onClick={this.handleClick}
                ref={(googleMap) => this.gmap = googleMap}>
                {this.state.mapClicked && <Marker position={this.state.location} />}
            </GoogleMap>
            <br />
            <div style={{ width: '300px', margin: 'auto', color: 'black' }}>
                <Select
                    options={this.state.allStates.map(state => ({ label: state.full_name, value: state.id, selectedState: state }))}
                    onChange={(option) => this.handleStateSelection(option.selectedState)}
                    // className="col-5 select"
                />
            </div>

            {this.state.mapClicked ?
                <div >
                    <div className="container" style={{ width: "300px", margin: "auto" }}>
                        <div className="row">
                            <input value={this.state.location.lat} readOnly="readOnly" className="col-sm-5" />
                            <input value={this.state.location.lng} readOnly="readOnly" className="col-sm-5" />
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <Select
                                options={this.state.allStates.map(state => ({ label: state.full_name, value: state.id, selectedState: state }))}
                                onChange={(option) => this.handleStateSelection(option.selectedState)}
                                className="col-5 select"
                            />
                            <form id="playgroundForm" onSubmit={this.handleSubmit} className="col-5">
                                {/* <input onChange={this.handleChange('state')} placeholder="State" /> */}
                                <input onChange={this.handleChange('name')} placeholder="Playground Name" />
                                {/* <input onChange={this.handleChange('description')} placeholder="Description" /> */}
                                <input type="button" value="Submit" onClick={this.handleSubmit} />
                            </form>
                            <textarea rows="4" cols="50"
                                form="playgroundForm" onChange={this.handleChange('description')}
                                placeholder="Description"
                                style={{ margin: "auto" }} />
                        </div>
                    </div>
                </div> :
                <p>Click on the map to get started</p>
            }
            <pre style={{color: 'white'}}>{JSON.stringify(this.state, null, 2)}</pre>
        </div>
    }
}

export default connect()(withScriptjs(withGoogleMap(AddPlaygroundMap)));