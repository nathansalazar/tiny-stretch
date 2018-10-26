import React, { Component } from 'react';
import { GoogleMap, withGoogleMap, withScriptjs, Marker } from 'react-google-maps';
import axios from 'axios';
import Select from 'react-select';
// import { PLAYGROUND_ACTIONS } from '../../redux/actions/playgroundActions';

let test = { lat: 42, lng: -98 };
class StateMap extends Component {
    state = {
        selectedState: { center_lat: 41, center_lng: -98, zoom: 4 },
        parks: [],
        allStates: [],
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


    render() {
        return (
            <div>
                <Select
                    options={this.state.allStates.map(state => ({ label: state.postal_code, value: state.id, selectedState: state }))}
                    onChange={(option) => this.handleChange(option.selectedState)}
                />
                <GoogleMap
                    defaultCenter={test}
                    center={{ lat: Number(this.state.selectedState.center_lat), lng: Number(this.state.selectedState.center_lng) }}
                    zoom={this.state.selectedState.zoom}
                >
                    {this.state.parks.map(park => <Marker key={park.id}
                        position={{ lat: Number(park.latitude), lng: Number(park.longitude) }}
                        title={park.name} />)}
                </GoogleMap>
                {JSON.stringify(this.state)}
            </div>
        );
    }
}

export default withScriptjs(withGoogleMap(StateMap));
// export default StateMap;