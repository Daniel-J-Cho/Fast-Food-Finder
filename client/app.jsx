import React from 'react';
import jwtDecode from 'jwt-decode';
import AppContext from './lib/app-context';
import Auth from './pages/auth';
import FastFoodFinder from './components/fast-food-finder';
import HomeButton from './components/home-button';
import FavoritesButton from './components/favorites-button';
import LocationMarker from './components/location-marker';
import { parseRoute } from './lib';
import { Wrapper } from '@googlemaps/react-wrapper';
import Map from './components/map';
import FavoritesView from './pages/favorites-view';
import Navbar from './components/navbar';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restName: '',
      restAddress: '',
      googlePlaceId: '',
      route: parseRoute(window.location.hash),
      user: null,
      isAuthorizing: true
    };
    this.updateRestNameAddress = this.updateRestNameAddress.bind(this);
    this.renderEntry = this.renderEntry.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    const token = window.localStorage.getItem('fast-food-finder-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('fast-food-finder-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('fast-food-finder-jwt');
    this.setState({ user: null });
  }

  updateRestNameAddress(event) {
    this.setState({
      restName: event.target.getAttribute('restName').replaceAll('_', ' '),
      restAddress: event.target.getAttribute('restAddress').replaceAll('_', ' '),
      googlePlaceId: event.target.getAttribute('googlePlaceId')
    }, this.renderEntry);
  }

  renderEntry() {
    fetch('/api/restLocs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        restName: this.state.restName,
        restAddress: this.state.restAddress,
        googlePlaceId: this.state.googlePlaceId
      })
    })
      .then(res => res.json())
      .catch(err => console.error(err));
  }

  renderPage() {
    const { route } = this.state;

    const render = Status => {
      return <h1>{Status}</h1>;
    };

    if (route.path === '') {
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
            <div className="col d-flex justify-content-end">
              <LocationMarker />
            </div>
          </div>
          <div className="row map-row mt-lg-3">
            <Wrapper apiKey={process.env.GOOGLE_MAPS_API_KEY} render={render} libraries={['places']} >
              <Map onUpdateNameAdd={this.updateRestNameAddress}/>
            </Wrapper>
          </div>
        </div>
      );
    }
    if (route.path === 'favorites') {
      return <FavoritesView />;
    }
    if (route.path === 'register' || route.path === 'sign-in') {
      return <Auth />;
    }
  }

  render() {
    if (this.state.isAuthorizing) {
      return null;
    }
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          {this.renderPage()}
        </>
      </AppContext.Provider>
    );
  }
}
