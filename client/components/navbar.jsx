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
              <button className="btn btn-dark" onClick={handleSignOut}>
                Sign out
              </button>
            }
            { user === null &&
              <>
              <a href="#sign-in" className="btn sign-in-button ml-3">
                Sign In
              </a>
              <a href="#register" className="btn btn-primary">
                Register
              </a>
              </>
            }
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;

Navbar.contextType = AppContext;
