import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import { connect } from 'react-redux';
import { USER_ACTIONS } from './redux/actions/userActions'

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

import Header from './components/Header/Header';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import UserPage from './components/UserPage/UserPage';
import SearchPage from './components/SearchPage/SearchPage';
import addPlaygroundPage from './components/addPlaygroundPage/addPlaygroundPage';
import SearchByStatePage from './components/searchByStatePage/searchByStatePage';

import './styles/main.css';

class App extends Component {

  //Constructor is the best place to initialize dependent data
  //Will fire before render, insuring that our call is at least pending
  constructor(props) {
    super(props);
    props.dispatch({ type: USER_ACTIONS.FETCH_USER })
  }

  render() {
    return (
      <div>
        <Header title="Tiny Stretch" />
        <Router>
          <Switch>
            <Redirect exact from="/" to="/home" />
            <Route
              path="/home"
              component={LoginPage}
            />
            <Route
              path="/register"
              component={RegisterPage}
            />
            <ProtectedRoute
              path="/user"
              component={UserPage}
            />
            <Route
              path="/info"
              component={SearchPage}
            />
            <Route
              path="/add_playground"
              component={addPlaygroundPage}
            />
            <Route
              path="/search_by_state"
              component={SearchByStatePage}
            />
            {/* OTHERWISE (no path!) */}
            <Route render={() => <h1>404</h1>} />

          </Switch>
        </Router>
      </div>
    )
  }
}

export default connect()(App);
