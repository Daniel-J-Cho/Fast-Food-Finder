import React from 'react';
import MainHeader from './pages/main-header';
import HomeButton from './components/home-button';
import FavoritesButton from './components/favorites-button';
import LocationMarker from './components/location-marker';
import { parseRoute } from './lib';
import { Wrapper } from '@googlemaps/react-wrapper';
import Map from './components/map';
import FavoritesView from './pages/favorites-view';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restName: '',
      restAddress: '',
      googlePlaceId: '',
      route: parseRoute(window.location.hash)
    };
    this.updateRestNameAddress = this.updateRestNameAddress.bind(this);
    this.renderEntry = this.renderEntry.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
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
  }

  render() {
    return (
    <>
      <MainHeader />
      { this.renderPage() }
    </>
    );
  }
}
