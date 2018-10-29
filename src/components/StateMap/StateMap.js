import React, { Component } from 'react';
import { GoogleMap, withGoogleMap, withScriptjs, Marker } from 'react-google-maps';
import axios from 'axios';
import Select from 'react-select';
// import { PLAYGROUND_ACTIONS } from '../../redux/actions/playgroundActions';

class StateMap extends Component {
    state = {
        selectedState: { center_lat: 41, center_lng: -98, zoom: 4 },
        parks: [],
        allStates: [],
        selectedPark: {}
    }
    componentDidMount = () => {
        axios.get('/api/states').then((response) => {
            this.setState({ allStates: response.data });
        }).catch((error) => {
            console.log('Error in GET /states:', error);
        })
    }

    handleChange = (selectedState) => {
        this.setState({ selectedState: selectedState });
        axios.get(`/api/park/${selectedState.postal_code}`).then((response) => {
            this.setState({ parks: response.data });
        }).catch((error) => {
            console.log('Error in GET /parks:', error);
        })
    }

    handleClick = (park) => {
        this.setState({selectedPark: park, selectedState: {center_lat: Number(park.latitude), center_lng: Number(park.longitude)}} );
        // console.log('refs:', this.gmap);
        console.log(this.state.selectedState);
    }


    render() {
        return (
            <div>
                <Select
                    options={this.state.allStates.map(state => ({ label: state.postal_code, value: state.id, selectedState: state }))}
                    onChange={(option) => this.handleChange(option.selectedState)}
                />
                <GoogleMap
                    center={{ lat: Number(this.state.selectedState.center_lat), lng: Number(this.state.selectedState.center_lng) }}
                    zoom={this.state.selectedState.zoom}
                    // ref={(googleMap) => this.gmap = googleMap}
                >
                    {this.state.parks.map(park => <Marker key={park.id}
                        position={{ lat: Number(park.latitude), lng: Number(park.longitude) }}
                        title={park.name} 
                        onClick={()=>this.handleClick(park)}/>)}
                </GoogleMap>
                <p>Parks in state: {this.state.parks.length}</p>
                <div className="card">
                        <h4>{this.state.selectedPark.name}</h4>
                        <img src={this.state.selectedPark.photo_reference} style={{maxWidth: "300px"}}/>
                        {this.state.selectedPark.description && 
                            <p>Description: {this.state.selectedPark.description}</p>}
                </div>
                {JSON.stringify(this.state)}
            </div>
        );
    }
}

export default withScriptjs(withGoogleMap(StateMap));
// export default StateMap;