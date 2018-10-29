import React, { Component } from 'react';
import Nav from '../Nav/Nav';
import { connect } from 'react-redux';
import AddPlaygroundMap from '../AddPlaygroundMap/AddPlaygroundMap';

const AddPlaygroundPage = (props) => (
    <div>
        {props.user.userName ? 
            (<div>
                <Nav />
                <AddPlaygroundMap
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    location={{ lat: 42, lng: -98 }} 
                    user={props.user}/>
            </div>) :
            (<div>
                <Nav />
                Login to add a playground
            </div>)
        }
    </div>
)

const mapReduxStateToProps = (state) => {
    return { user: state.user }
}

export default connect(mapReduxStateToProps)(AddPlaygroundPage);