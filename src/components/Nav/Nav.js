import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => (
  <div className="navbar">
    <div>
      <ul>
        <li>
          <Link to="/user">
            User Home
          </Link>
        </li>
        <li>
          <Link to="/info">
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

export default Nav;
