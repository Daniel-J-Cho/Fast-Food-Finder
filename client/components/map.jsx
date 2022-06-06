import React from 'react';
// import DropdownMenu from './dropdown.jsx';
import { Marker } from '@googlemaps/react-wrapper';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: null,
      locationList: [],
      franchiseName: ''
    };
    this.map = null;
    this.marker = null;
    this.mapDivRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.handleLocationSearch = this.handleLocationSearch.bind(this);
  }

  componentDidMount() {
    if (this.mapDivRef.current && !this.map) {
      this.map = new window.google.maps.Map(this.mapDivRef.current);

    }
    if (this.map) {
      this.map.setOptions({ zoom: 11, center: { lat: 33.669445, lng: -117.823059 } });
    }
  }

  handleClick() {
    navigator.geolocation.getCurrentPosition(position => {
      if (position.coords) {
        this.setState({ coords: position.coords });
        this.map.setOptions({ center: { lat: position.coords.latitude, lng: position.coords.longitude } });
        this.marker = new window.google.maps.Marker();
        this.marker.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        this.marker.setMap(this.map);
      }
    });
  }

  handleDropdownClick(event) {
    this.setState({ franchiseName: event.target.textContent });
    // console.log('this.state.franchiseName:', this.state.franchiseName);
    this.handleLocationSearch();
  }

  // restaurant search method in-progress
  handleLocationSearch() {
    // console.log('this.props.franchiseName: ', this.props.franchiseName);
    // const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?';
    const query = `${this.state.franchiseName}`;
    const location = `${this.state.coords.latitude},${this.state.coords.longitude}}`;
    // const queryString = `&query=${this.state.franchiseName}`;
    // const locationString = `&location=${this.state.coords.latitude},${this.state.coords.longitude}}`;
    const radius = `${800 * 1000}`;
    // const type = '&type=restaurant';
    // const key = `&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    // const url = baseUrl + queryString + locationString + radius + type + key;
    // console.log('url:', url);
    fetch(`/api/locations?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&radius=${radius}`)
      .then(res => res.json())
      .then(results => {
        this.setState({ locationList: results });
        // console.log('this.state:', this.state);
      })
      .then(results => {
        this.state.locationList.map(item => {
          return <Marker key={item.place_id} position={{
            lat: item.geometry.lat,
            lng: item.geometry.lng
          }} map={this.map} />;
        });
      })
      .catch(err => console.error('error:', err));

  }

  render() {
    return (
      <div>
        <div className="modal" id="permModal" tabIndex="-1" aria-labelledby="permModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="permModalLabel">Enable Location Services</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to enable location services?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={this.handleClick}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown-menu-main">
          <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenu1" data-bs-toggle="dropdown" aria-expanded="false">
            Select a restaurant
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li><a className="dropdown-item" href="#" onClick={ event => this.handleDropdownClick(event) } id='McDonald&apos;s'>McDonald&apos;s</a></li>
            <li><a className="dropdown-item" href="#" onClick={ event => this.handleDropdownClick(event) } id='Taco Bell'>Taco Bell</a></li>
            <li><a className="dropdown-item" href="#" onClick={ event => this.handleDropdownClick(event) } id='In-N-Out'>In-N-Out</a></li>
            <li><a className="dropdown-item" href="#" onClick={ event => this.handleDropdownClick(event) } id='Chipotle'>Chipotle</a></li>
            <li><a className="dropdown-item" href="#" onClick={ event => this.handleDropdownClick(event) } id='Burger King'>Burger King</a></li>
            <li><a className="dropdown-item" href="#" onClick={ event => this.handleDropdownClick(event) } id='Del Taco'>Del Taco</a></li>
            <li><a className="dropdown-item" href="#" onClick={ event => this.handleDropdownClick(event) } id='Carl&apos;s Jr'>Carl&apos;s Jr</a></li>
            <li><a className="dropdown-item" href="#" onClick={ event => this.handleDropdownClick(event) } id='Wienerschnitzel'>Wienerschnitzel</a></li>
            <li><a className="dropdown-item" href="#" onClick={ event => this.handleDropdownClick(event) } id='Subway'>Subway</a></li>
            <li><a className="dropdown-item" href="#" onClick={ event => this.handleDropdownClick(event) } id='Jersey Mike&apos;s'>Jersey Mike&apos;s</a></li>
          </ul>
        </div>
        <div ref={this.mapDivRef} style={{ height: '68vh', width: '81vw', margin: 'auto' }} />
      </div>
    );
  }
}

export default Map;
