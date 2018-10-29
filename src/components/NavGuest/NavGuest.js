import React from 'react';
import { Link } from 'react-router-dom';

const NavGuest = () => (
  <div className="navbar">
    <div>
      <ul>
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

export default NavGuest;