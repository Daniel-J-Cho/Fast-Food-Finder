import React from 'react';
import Redirect from '../components/redirect';
import AuthForm from '../components/auth-form';
import AppContext from '../lib/app-context';
import FastFoodFinder from '../components/fast-food-finder';
import HomeButton from '../components/home-button';
import FavoritesButton from '../components/favorites-button';
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
        <div className="row home-fav-row">
          <div className="home-button d-flex align-items-center">
            <HomeButton />
          </div>
          <div className="col-1 favorites-button d-flex align-items-center">
            <FavoritesButton />
          </div>
          <div className="card">
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
