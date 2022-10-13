import React from 'react';
import HomeButton from '../components/home-button';
import FavoritesButton from '../components/favorites-button';
import FastFoodFinder from '../components/fast-food-finder';
import SignInButton from '../components/sign-in-button';

class RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUsername: '',
      newPassword: ''
    };
    this.register = this.register.bind(this);
    this.handleNewUsernameInput = this.handleNewUsernameInput.bind(this);
    this.handleNewPasswordInput = this.handleNewPasswordInput.bind(this);
  }

  // componentDidMount() {
  //   fetch('/api/restLocs') {
  //     .then(res => res.json())
  //   }
  // }

  handleNewUsernameInput(event) {
    this.setState({ newUsername: event.target.value });
  }

  handleNewPasswordInput(event) {
    this.setState({ newPassword: event.target.value });
  }

  register() {
    fetch('/api/users/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.newUsername,
        password: this.state.newPassword
      })
    })
      .then(res => res.json())
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="container">
        <div className="row sign-in-register-row">
          <div className="mt-3 d-flex justify-content-end ">
            <SignInButton />
          </div>
        </div>
        <div className="row main-header-row">
          <div className="main-header justify-content-center">
            <FastFoodFinder />
          </div>
        </div>
        <div className="row home-fav-row">
          <div className="home-button d-flex align-items-center">
            <HomeButton />
          </div>
          <div className="col-1 favorites-button d-flex align-items-center">
            <FavoritesButton />
          </div>
        </div>
        <div className="row register-card-row mt-4 ">
          <div className="card register-card">
            <div className="card-header register-card-header">
              Register
            </div>
            <div className="card-body">
              <form>
                <h5 className="card-title mt-5 px-4">Create your Username</h5>
                <input className="register-username-input" type="text" placeholder="Enter your username" onChange={event => this.handleNewUsernameInput(event)} />
                <h5 className="card-title mt-3 px-4">Create your Password</h5>
                <input className="register-password-input" type="password" placeholder="Create your password" onChange={event => this.handleNewPasswordInput(event) } />
                <div className="row register-buttons-row mt-5 mb-3">
                  <div className="col-6 reg-cancel-button-col d-flex justify-content-center">
                    <button type="button" className="btn btn-light reg-cancel-button">Cancel</button>
                  </div>
                  <div className="col-6 reg-submit-button-col d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary reg-submit-button" onClick={() => this.register()} >Sign Up</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterView;
