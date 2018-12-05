import React, { Component } from 'react';
import Map from '../Map/Map';
import SearchForm from '../SearchForm/SearchForm';
import Nav from '../Nav/Nav';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
  APIkey: state.APIkey,
});

class SearchPage extends Component {

  state={
    url: `https://maps.googleapis.com/maps/api/js?key=${this.props.APIkey}&v=3.exp&libraries=geometry,drawing,places`
  }


  render() {

    return (
      <div>
        <Nav />
        <SearchForm url={this.state.url}/>
          <Map
            googleMapURL={this.state.url}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px`, maxWidth: "90%", margin: "auto" }} />}
            mapElement={<div style={{ height: `100%` }} />}
            location={{ lat: 41, lng: -98 }} />
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(SearchPage);
