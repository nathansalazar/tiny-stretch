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
        if (this.props.usernames.length === 0) {
            this.props.dispatch({ type: 'GET_USERNAMES' });
        }
    }

    componentWillReceiveProps = (nextProps) => {
        //We don't update on initial render or if either the previous US state or 
        //incoming US state has no parks
        if (this.state.initialRender || nextProps.parks.length * this.props.parks.length === 0) {
            this.setState({ initialRender: false });
            return null;
        }
        //we don't update if we're switching between states
        if (this.props.parks[0].state !== nextProps.parks[0].state) {
            return null;
        }
        let descriptionUpdated = false;
        let currentParkIndex;
        //we check to see which park was updated
        for (let i = 0; i < this.props.parks.length; i++) {
            //we check if number of descriptions increased
            let thisPropsDescriptions = this.props.parks[i].description || [];
            let nextPropsDescriptions = nextProps.parks[i].description || [];
            if (thisPropsDescriptions.length < nextPropsDescriptions.length) {
                descriptionUpdated = true;
                currentParkIndex = i;
            }
        }//I'm not sure why we need to check this second condition
        if (descriptionUpdated && this.state.selectedPark.id) {
            this.setState({ selectedState: this.state.selectedState, selectedPark: nextProps.parks[currentParkIndex] });
            this.setState({ addDescription: false });
        }
    }

    handleChange = (selectedState) => {
        this.setState({ selectedState: selectedState });
        this.props.dispatch({ type: 'GET_PARKS_IN_STATE', payload: selectedState.postal_code });
    }

    handleClick = (park) => {
        this.setState({ selectedPark: park });
        this.setState({ selectedState: { ...this.state.selectedState, center_lat: Number(park.latitude), center_lng: Number(park.longitude) } });
    }

    setDescription = (event) => {
        this.setState({ description: event.target.value });
    }

    handleSubmit = () => {
        const firstReview = this.state.selectedPark.description === null;
        this.props.dispatch({
            type: 'ADD_DESCRIPTION',
            payload: {
                userId: this.props.user.id,
                park: this.state.selectedPark.id,
                description: this.state.description,
                postal_code: this.state.selectedState.postal_code,
                firstReview: firstReview
            }
        });
        this.setState({addDescription: false});
    }

    render() {
        return (
            <div >
                <div style={{ width: '300px', margin: 'auto' }}>
                    <br />
                    <Select
                        options={this.state.allStates.map(state => ({ label: state.full_name, value: state.id, selectedState: state }))}
                        onChange={(option) => this.handleChange(option.selectedState)}
                        className="select"
                    />
                </div>
                <GoogleMap
                    center={{ lat: Number(this.state.selectedState.center_lat), lng: Number(this.state.selectedState.center_lng) }}
                    zoom={this.state.selectedState.zoom}
                >
                    {this.props.parks.map(park => <Marker key={park.id}
                        position={{ lat: Number(park.latitude), lng: Number(park.longitude) }}
                        title={park.name}
                        onClick={() => this.handleClick(park)} />)}
                </GoogleMap>

                <p style={{ color: 'white' }}>Parks in state: {this.props.parks.length}</p>



                <div className="container">
                    <div className="row justify-content-between" >
                        {/* this.state.selectedPark.name && */}
                        {this.state.selectedPark.name &&
                            <div className="col-5 card" style={{ background: 'linear-gradient(-45deg,green,white)' }}>
                                <h4 style={{ textAlign: 'center' }}>{this.state.selectedPark.name}</h4>
                                <img src={this.state.selectedPark.photo_reference} style={{ maxWidth: "300px", margin: 'auto' }} />
                                <br />
                            </div>}
                        {/* this.state.selectedPark.description && */}
                        {this.state.selectedPark.name ?
                            <div className="col-6 card" style={{ color: 'black', background: 'linear-gradient(-45deg,green,white)' }}>
                                <h3 style={{ textAlign: 'center' }}>User Reviews</h3>
                                {/* show all descriptions */}
                                {this.state.selectedPark.description &&
                                    <div>
                                    <table><tbody style={{ color: 'black' }}>
                                        {this.state.selectedPark.description.map((text, index) => (<div><tr key={index}>
                                            <td><b><font size="+1">
                                                {this.props.usernames[this.state.selectedPark.user_id[index] - 1]}
                                            </font></b></td></tr>
                                            <tr key={(index + 1) * 100}><td><font size="-1">{text}</font></td></tr>
                                            <tr key={(index + 2) * 200}><td></td></tr></div>))}
                                    </tbody></table>
                                </div>}
                                {!this.state.addDescription && 
                                <button className="btn btn-secondary" onClick={() => this.setState({ addDescription: true })} 
                                    style={{ maxWidth: "300px", margin: 'auto' }}>Add a review</button>}
                                {this.state.addDescription &&
                                <div><textarea rows="4" cols="40" onChange={this.setDescription}></textarea>
                                    <button onClick={this.handleSubmit} className="btn btn-secondary">Submit</button></div>}
                            </div> :
                    <noscript></noscript>}
                    </div>
                </div>

            {/* <pre style={{color: 'white'}}>{JSON.stringify(this.state,null,2)}</pre> */}

            </div>


            // {this.props.user.id === this.state.selectedPark.added_by &&
            //     <p>You added this park!</p>} 
            //          Later we can set it up so that parks reviewed by the user show up in a different color 


        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        parks: state.parksInState,
        usernames: state.usernames,
    }
}

export default connect(mapStateToProps)(withScriptjs(withGoogleMap(StateMap)));