import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';



class Nav extends React.Component {

  clearStore = () => {
    console.log('Clear reduxStore');
    this.props.dispatch({ type: 'CLEAR_PLAYGROUNDS' });
    this.props.dispatch({ type: 'CLEAR_PARKS' });
    this.props.dispatch({ type: 'CLEAR_CHECKPOINTS' });
    this.props.dispatch({ type: 'CLEAR_ROUTE' });
  }

  render() {
    return (<div className="navbar">
      <div>
        <ul>
          {this.props.user.userName ?
            <li>
              <Link to="/user" onClick={this.clearStore}>
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
            <Link to="/search" onClick={this.clearStore}>
              Search Page
          </Link>
          </li>
          <li>
            <Link to="/search_by_State" onClick={this.clearStore}>
              Search by State
          </Link>
          </li>
          <li>
            <Link to="/add_playground" onClick={this.clearStore}>
              Add Playground
          </Link>
          </li>
        </ul>
      </div>
    </div>)
  }
};

const mapReduxStateToProps = (state) => {
  return { user: state.user };
}

export default connect(mapReduxStateToProps)(Nav);
