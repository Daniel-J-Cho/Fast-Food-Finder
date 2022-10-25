import React from 'react';

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGuest = this.handleGuest.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleGuest(event) {
    this.setState({
      username: 'Guest',
      password: 'eeeyybattabatta'
    }, this.handleSubmit(event));
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
    const req = {
      method: 'POST',
      headers: {
        'X-Access-Token': window.localStorage.getItem('fast-food-finder-jwt'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch(`/api/users/${action}`, req)
      .then(res => res.json())
      .then(result => {
        if (action === 'register') {
          window.location.hash = 'sign-in';
        } else if (result.user && result.token) {
          this.props.onSignIn(result);
        }
      });
  }

  render() {
    const { action } = this.props;
    const { handleChange, handleSubmit, handleGuest } = this;
    const headerMessage = action === 'register'
      ? 'Register'
      : 'Sign In';
    const submitButtonText = action === 'register'
      ? 'Register'
      : 'Sign In';
    const placeholderUsernameText = action === 'register'
      ? 'Create a username'
      : 'Enter your username';
    const placeholderPasswordText = action === 'register'
      ? 'Create a password'
      : 'Enter your password';
    const alternateActionHref = action === 'register'
      ? '#sign-in'
      : '#register';
    const alternateActionText = action === 'register'
      ? 'Already registered? Sign In!'
      : 'Don\'t have an account yet? Register!';
    return (
      <>
        <div className="card mt-3">
          <div className="card-header register-card-header">
            {headerMessage}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <h5 className="card-title mt-5 px-4">{placeholderUsernameText}</h5>
              <input
                required
                autoFocus
                id="username"
                type="text"
                name="username"
                onChange={handleChange}
                className="form-control bg-light"
                placeholder={placeholderUsernameText} />
              <h5 className="card-title mt-3 px-4">{placeholderPasswordText}</h5>
              <input
                required
                id="password"
                type="password"
                name="password"
                onChange={handleChange}
                className="form-control bg-light"
                placeholder={placeholderPasswordText} />
              <div className="row register-buttons-row mt-5 mb-3">
                <div className="col-6 reg-cancel-button-col d-flex justify-content-center">
                  <a href="#" className="btn btn-light reg-cancel-button">Clear Fields</a>
                </div>
                <div className="col-6 reg-submit-button-col d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary reg-submit-button" >{submitButtonText}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-body">
            <div className="row alt-links-row">
              <div className="col-6 d-flex justify-content-center align-items-center">
                <a href={alternateActionHref} className="alt-link">{alternateActionText}</a>
              </div>
              <div className="col-6 d-flex justify-content-center align-items-center">
                <form onSubmit={handleSubmit}>
                  <a href='#' className="sign-in-guest" onClick={handleGuest}>Sign In as &apos;Guest&apos;</a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AuthForm;