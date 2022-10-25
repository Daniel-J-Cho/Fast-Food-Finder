import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import Navbar from '../components/navbar';
import HomeButton from '../components/home-button';
import FavoritesButton from '../components/favorites-button';
import FastFoodFinder from '../components/fast-food-finder';
import LocationMarker from '../components/location-marker';
import { Wrapper } from '@googlemaps/react-wrapper';
import Map from '../components/map';

class Home extends React.Component {

  render() {

    const render = Status => {
      return <h1>{Status}</h1>;
    };

    const welcomeMessage = this.context.user === null
      ? 'Welcome Guest!'
      : `Welcome ${this.context.user.username}!`;

    if (!this.context.user) {
      return <Redirect to="sign-in" />;
    }

    return (
      <div className="container">
        <div className="row sign-in-register-row">
          <div className="col navbar-col d-flex justify-content-end">
            <Navbar />
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
          <div className="col d-flex justify-content-end align-items-center welcome-message">
            {welcomeMessage}
          </div>
          <div className="col d-flex justify-content-end">
            <LocationMarker />
          </div>
        </div>
        <div className="row map-row mt-lg-3">
          <Wrapper apiKey={process.env.GOOGLE_MAPS_API_KEY} render={render} libraries={['places']} >
            <Map onUpdateNameAdd={this.context.updateRestNameAddress} />
          </Wrapper>
        </div>
      </div>
    );
  }
}

export default Home;

Home.contextType = AppContext;
