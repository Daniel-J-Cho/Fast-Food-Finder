import React from 'react';
import jwtDecode from 'jwt-decode';
import AppContext from './lib/app-context';
import Auth from './pages/auth';
import { parseRoute } from './lib';
import FavoritesView from './pages/favorites-view';
import Home from './pages/home';

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
    this.setState({ user: null, route: parseRoute('#') });
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
        'X-Access-Token': window.localStorage.getItem('fast-food-finder-jwt'),
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

    if (route.path === '') {
      return <Home />;
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
    const { handleSignIn, handleSignOut, updateRestNameAddress } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut, updateRestNameAddress };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          {this.renderPage()}
        </>
      </AppContext.Provider>
    );
  }
}
