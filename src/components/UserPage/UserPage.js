import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from '../../components/Nav/Nav';

import { USER_ACTIONS } from '../../redux/actions/userActions';
import { triggerLogout } from '../../redux/actions/loginActions';

// Instead of taking everything from state, we just want the user info.
const mapStateToProps = state => ({
  user: state.user,
});

class UserPage extends Component {
  logout = () => {
    this.props.dispatch(triggerLogout());
  }

  render() {
    let content = null;

    // if (this.props.user.userName) {
      if(true){
      content = (
        <div>
          <h1
            id="welcome"
          >
            Welcome, { this.props.user.userName }!
          </h1>
          <p>Your ID is: {this.props.user.id}</p>
          <button
            onClick={this.logout}
          >
            Log Out
          </button>
        </div>
      );
    }

    return (
      <div>
        <Nav />
        { content }
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);

