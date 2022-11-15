import React from 'react';
import Redirect from '../components/redirect';
import AuthForm from '../components/auth-form';
import AppContext from '../lib/app-context';
import FastFoodFinder from '../components/fast-food-finder';
import SignInButton from '../components/sign-in-button';
import RegisterButton from '../components/register-button';

class AuthPage extends React.Component {
  render() {

    const { user, route, handleSignIn } = this.context;

    if (user) {
      return <Redirect to="" />;
    }

    const toggleButton = route.path === 'register'
      ? <SignInButton />
      : <RegisterButton />;
    return (
      <div className="container">
        <div className="row sign-in-register-row">
          <div className="mt-3 d-flex justify-content-end">
            { toggleButton }
          </div>
        </div>
        <div className="row main-header-row">
          <div className="main-header justify-content-center">
            <FastFoodFinder />
          </div>
        </div>
        <div className="row sign-in-register-card-row">
          <div className="col-12">
            <AuthForm
              key={route.path}
              action={route.path}
              onSignIn={handleSignIn} />
          </div>
        </div>
      </div>
    );
  }
}

export default AuthPage;

AuthPage.contextType = AppContext;
