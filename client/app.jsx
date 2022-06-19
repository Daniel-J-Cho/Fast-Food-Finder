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
      entries: [],
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
    const entry = <div className="card mb-4" key={this.state.googlePlaceId}>
                    <div className="card-body">
                      <h5 className="card-title" >{this.state.restName}</h5>
                      <p className="card-text" >{this.state.restAddress}</p>
                      <p className="card-text">make this a bullet-pointed comment</p>
                      <div className="row">
                        <div className="d-flex justify-content-around">
                          <button type="button" className="btn btn-primary">Add Comment</button>
                          <button type="button" className="btn btn-secondary">Edit Comment</button>
                          <button type="button" className="btn btn-warning">Delete Comment</button>
                          <button type="button" className="btn btn-danger">Delete Location</button>
                        </div>
                      </div>
                    </div>
                  </div>;
    this.setState({ entries: [...this.state.entries, entry] });
  }

  renderPage() {
    const { route } = this.state;

    const render = Status => {
      return <h1>{Status}</h1>;
    };

    if (route.path === '') {
      return (
        <div className="container">
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
              <Map onUpdateNameAdd={this.updateRestNameAddress}/>
            </Wrapper>
          </div>
        </div>
      );
    }
    if (route.path === 'favorites') {
      return <FavoritesView restName={this.state.restName} restAddress={this.state.restAddress} createCards={this.state.entries} />;
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
