import React, { Component } from 'react';
import { GoogleMap, withGoogleMap, withScriptjs, Marker } from 'react-google-maps';
import axios from 'axios';
import Select from 'react-select';
import { connect } from 'react-redux';
// import { PLAYGROUND_ACTIONS } from '../../redux/actions/playgroundActions';

class StateMap extends Component {
    state = {
        selectedState: { center_lat: 41, center_lng: -98, zoom: 4 },
        selectedPark: {},
        parks: [],
        description: '',
        addDescription: false,
        allStates: [],
        initialRender: true,
    }
    componentDidMount = () => {
        axios.get('/api/states').then((response) => {
            this.setState({ allStates: response.data });
        }).catch((error) => {
            console.log('Error in GET /states:', error);
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if( this.state.initialRender || nextProps.parks.length*this.props.parks.length===0){ //
            this.setState({initialRender: false});
            return null;
        }
        if(this.props.parks[0].state !== nextProps.parks[0].state){
            return null;
        }
        let descriptionUpdated = false;
        for (let i = 0; i < this.props.parks.length; i++) {
            if(this.props.parks[i].description !== nextProps.parks[i].description){
                descriptionUpdated = true;
            }
        }
        console.log(this.state);
        if(descriptionUpdated && this.state.selectedPark.id){
            let parkIds = this.props.parks.map(park => park.id);
            let currentParkIndex = parkIds.indexOf(this.state.selectedPark.id);
            this.setState({ selectedState: this.state.selectedState, selectedPark: nextProps.parks[currentParkIndex] });
            this.setState({ addDescription: false });
        }
    }

    handleChange = (selectedState, resetCurrentPark) => {
        this.setState({ selectedState: selectedState });
        this.props.dispatch({type: 'GET_PARKS_IN_STATE', payload: selectedState.postal_code});
        // if (resetCurrentPark) {
        //     let parkIds = this.props.parks.map(park => park.id);
        //     let currentParkIndex = parkIds.indexOf(this.state.selectedPark.id);
        //     console.log('about to update park with id:',this.state.selectedPark.id);
        //     this.setState({ selectedPark: this.state.parks[currentParkIndex] });
        // }
        // axios.get(`/api/park/${selectedState.postal_code}`).then((response) => {
        //     this.setState({ parks: response.data });
        //     if (resetCurrentPark) {
        //         let parkIds = this.state.parks.map(park => park.id);
        //         let currentParkIndex = parkIds.indexOf(this.state.selectedPark.id);
        //         console.log('about to update park with id:',this.state.selectedPark.id);
        //         this.setState({ selectedPark: this.state.parks[currentParkIndex] });
        //     }
        //     console.log('Back from DB with all parks.');
        // }).catch((error) => {
        //     console.log('Error in GET /parks:', error);
        // })
    }

    handleClick = (park) => {
        this.setState({ selectedPark: park });
        this.setState({ selectedState: { ...this.state.selectedState, center_lat: Number(park.latitude), center_lng: Number(park.longitude) } });
        // console.log('refs:', this.gmap);
        console.log(this.state.selectedState);
    }

    addDescription = () => {
        console.log(this.props.user.userName, 'wishes to add description to ', this.state.selectedPark.name, '?');
        this.setState({ addDescription: true });
    }

    setDescription = (event) => {
        this.setState({ description: event.target.value });
    }

    handleSubmit = () => {
        console.log('Your description was:', this.state.description);
        this.props.dispatch({
            type: 'ADD_DESCRIPTION',
            payload: { userId: this.props.user.id, park: this.state.selectedPark.id, description: this.state.description, postal_code: this.state.selectedState.postal_code }
        });
        // this.handleChange(this.state.selectedState,true);
    }

    render() {
        return (
            <div>
                <Select
                    options={this.state.allStates.map(state => ({ label: state.full_name, value: state.id, selectedState: state }))}
                    onChange={(option) => this.handleChange(option.selectedState,false)}
                />
                <GoogleMap
                    center={{ lat: Number(this.state.selectedState.center_lat), lng: Number(this.state.selectedState.center_lng) }}
                    zoom={this.state.selectedState.zoom}
                // ref={(googleMap) => this.gmap = googleMap}
                >
                    {this.props.parks.map(park => <Marker key={park.id}
                        position={{ lat: Number(park.latitude), lng: Number(park.longitude) }}
                        title={park.name}
                        onClick={() => this.handleClick(park)} />)}
                </GoogleMap>
                <p>Parks in state: {this.props.parks.length}</p>
                <div className="card">
                    <h4>{this.state.selectedPark.name}</h4>
                    <img src={this.state.selectedPark.photo_reference} style={{ maxWidth: "300px" }} alt="" />

                    {this.state.selectedPark.description ?
                        <p>Description: {this.state.selectedPark.description}</p> :
                        this.state.selectedPark.name ?
                            this.state.addDescription ?
                                <button onClick={this.handleSubmit}>Submit</button> :
                                this.props.user.id ?
                                    <button onClick={this.addDescription}>Add description</button> :
                                    <span></span> :
                            <span></span>}

                    {this.props.user.id === this.state.selectedPark.added_by &&
                        <p>You added this park!</p>}

                    {this.state.addDescription &&
                        <textarea rows="4" cols="40" onChange={this.setDescription}></textarea>}
                </div>
                <pre>{JSON.stringify(this.state, null, 2)}</pre>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { 
        user: state.user,
        parks: state.parksInState,
        }
}

export default connect(mapStateToProps)(withScriptjs(withGoogleMap(StateMap)));
// export default StateMap;