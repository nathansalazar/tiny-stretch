import React from 'react';
import Nav from '../Nav/Nav';
import { connect } from 'react-redux';
import AddPlaygroundMap from '../AddPlaygroundMap/AddPlaygroundMap';

const AddPlaygroundPage = (props) => (
    <div>
        {props.user.userName ? 
            (<div>
                <Nav />
                <AddPlaygroundMap
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${props.APIkey}&v=3.exp&libraries=geometry,drawing,places`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px`, maxWidth: "800px", margin: "auto" }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    location={{ lat: 41, lng: -98 }} 
                    user={props.user}/>
            </div>) :
            (<div>
                <Nav />
                <p>Login to add a playground</p>
            </div>)
        }
    </div>
)

const mapReduxStateToProps = (state) => {
    return { 
        user: state.user, 
        APIkey: state.APIkey }
}

export default connect(mapReduxStateToProps)(AddPlaygroundPage);