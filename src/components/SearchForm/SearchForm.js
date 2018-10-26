import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PLAYGROUND_ACTIONS } from '../../redux/actions/playgroundActions';
import milesToMeters from '../../auxiliaryFunctions/milesToMeters';

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

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input placeholder="origin" type="text" onChange={this.handleChange('origin')} />
                <input placeholder="destination" type="text" onChange={this.handleChange('destination')} />
                <input placeholder="radius (miles)" type="number" onChange={this.handleChange('radius')} />
                <input type="submit" />
            </form>
        )
    }
}

export default connect()(SearchForm);