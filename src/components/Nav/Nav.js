import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Nav = (props) => (
  <div className="navbar">
    <div>
      <ul>
        {props.user.userName ?
          <li>
            <Link to="/user">
              User Home
        </Link>
          </li> :
          <li>
            <Link to="/">
              Login
      </Link>
          </li>
        }
        <li>
          <Link to="/search">
            Search Page
          </Link>
        </li>
        <li>
          <Link to="/search_by_State">
            Search by State
          </Link>
        </li>
        <li>
          <Link to="/add_playground">
            Add Playground
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

const mapReduxStateToProps = (state) => {
  return { user: state.user };
}

export default connect(mapReduxStateToProps)(Nav);
