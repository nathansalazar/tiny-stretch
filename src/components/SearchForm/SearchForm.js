import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PLAYGROUND_ACTIONS } from '../../redux/actions/playgroundActions';
import milesToMeters from '../../auxiliaryFunctions/milesToMeters';
// import Script from 'react-load-script';

class SearchForm extends Component {

    state = {
        origin: '',
        destination: '',
        radius: 0,
        submitted: false
    }

    handleChange = (property) => (event) => {
        if (property === 'radius') {
            this.setState({ radius: milesToMeters(event.target.value) })
        } else {
            this.setState({ [property]: event.target.value })
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.dispatch({ type: PLAYGROUND_ACTIONS.CLEAR_PLAYGROUNDS });
        console.log('State:', this.state);
        this.setState({ submitted: !this.state.submitted });
        this.props.dispatch({ type: 'SET_ROUTE', payload: this.state });
    }

    // handleScriptLoad = () =>  { 
    //     // Declare Options For Autocomplete 
    //     var options = { types: ['(cities)'] }; 
    //     // Initialize Google Autocomplete 
    //     /*global google*/
    //     let origin = new google.maps.places.Autocomplete(document.getElementById('origin'),options ); 
    //     let destination = new google.maps.places.Autocomplete(document.getElementById('destination'),options ); 
    //     // Fire Event when a suggested name is selected
    //     origin.addListener('place_changed', ()=>{this.setState({origin: origin.getPlace().formatted_address})}); 
    //     destination.addListener('place_changed',  ()=>{this.setState({destination: destination.getPlace().formatted_address})}); 
    //   }

   

    render() {
        return (
            <div>
                {/* <Script 
                    url={this.props.url}
                    onLoad={this.handleScriptLoad}
                    onError={()=>{console.log('ERROR!')}}
                /> */}
                <form onSubmit={this.handleSubmit} className="autocomplete">
                    <input placeholder="origin" id="origin" type="text" onChange={this.handleChange('origin')} />
                    <input placeholder="destination" id="destination" type="text" onChange={this.handleChange('destination')} /> {/*onChange={this.handleChange('destination')}*/}
                    <input placeholder="radius (miles)" type="number" onChange={this.handleChange('radius')} />
                    <input type="submit" />
                </form>
            </div>
        )
    }
}

export default connect()(SearchForm);