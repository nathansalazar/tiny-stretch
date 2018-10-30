import React, { Component } from 'react';
import Map from '../Map/Map';
import SearchForm from '../SearchForm/SearchForm';
import Nav from '../Nav/Nav';

// const mapStateToProps = state => ({
//   state,
// });

class SearchPage extends Component {

  state={
    url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBDKdBqDqbNQtLtmUGZkAlZhdiPzTbs1eY&v=3.exp&libraries=geometry,drawing,places"
  }


  render() {

    return (
      <div>
        <Nav />
        <SearchForm url={this.state.url}/>
          <Map
            googleMapURL={this.state.url}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px`, maxWidth: "800px", margin: "auto" }} />}
            mapElement={<div style={{ height: `100%` }} />}
            location={{ lat: 41, lng: -98 }} />
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default SearchPage;
