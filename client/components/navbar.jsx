import React from 'react';
import AppContext from '../lib/app-context';

class Navbar extends React.Component {
  render() {
    const { user, handleSignOut } = this.context;

    return (
      <nav className="navbar">
        <div className="container">
          <div>
            { user !== null &&
              <button className="btn sign-out-button" onClick={handleSignOut}>
                Sign out
              </button>
            }
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;

Navbar.contextType = AppContext;
