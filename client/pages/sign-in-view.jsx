import React from 'react';
import HomeButton from '../components/home-button';
import FavoritesButton from '../components/favorites-button';
import FastFoodFinder from '../components/fast-food-finder';
import RegisterButton from '../components/register-button';

class SignInView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: null,
      userId: null
    };
    this.handleUsernameInput = this.handleUsernameInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  handleUsernameInput(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordInput(event) {
    this.setState({ password: event.target.value });
  }

  signIn() {
    fetch('/api/users/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .then(result => {
        this.setState({ userId: result.user.userId });
      })
      .then(() => {
        this.setState({ message: `Welcome ${this.state.username}` });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="container">
        <div className="row sign-in-register-row">
          <div className="mt-3 d-flex justify-content-end ">
            <RegisterButton />
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
          <div className="col welcome-message d-flex justify-content-end">
            {this.state.message}
          </div>
        </div>
        <div className="row register-card-row mt-4 ">
          <div className="card register-card">
            <div className="card-header register-card-header">
              Sign-In
            </div>
            <div className="card-body">
              <form>
                <h5 className="card-title mt-5 px-4">Enter your Username</h5>
                <input className="register-username-input" type="text" placeholder="Enter your username" onChange={event => this.handleUsernameInput(event)} />
                <h5 className="card-title mt-3 px-4">Enter your Password</h5>
                <input className="register-password-input" type="password" placeholder="Enter your password" onChange={event => this.handlePasswordInput(event)} />
                <div className="row register-buttons-row mt-5 mb-3">
                  <div className="col-6 reg-cancel-button-col d-flex justify-content-center">
                    <a href="#" className="btn btn-light reg-cancel-button">Cancel</a>
                  </div>
                  <div className="col-6 reg-submit-button-col d-flex justify-content-center">
                    <a href="#" className="btn btn-primary reg-submit-button" id="sign-in" onClick={() => this.signIn()} >Sign In</a>
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

export default SignInView;
