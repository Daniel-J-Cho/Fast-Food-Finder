import React from 'react';
import MainHeader from './pages/main-header';
import HomeButton from './components/home-button';
import FavoritesButton from './components/favorites-button';
import LocationMarker from './components/location-marker';
import { parseRoute } from './lib';
import { Wrapper } from '@googlemaps/react-wrapper';
import Map from './components/map';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  render() {
    const render = Status => {
      return <h1>{Status}</h1>;
    };

    return (
    <div className="container">
      <div className="row">
        <MainHeader />
      </div>
      <div className="row">
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
      <div className="row mt-lg-3">
        <Wrapper apiKey={process.env.GOOGLE_MAPS_API_KEY} render={render} libraries={['places']} >
          <Map />
        </Wrapper>
      </div>
    </div>
    );
  }
}
