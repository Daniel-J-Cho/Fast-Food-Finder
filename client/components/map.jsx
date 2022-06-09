import React from 'react';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: { latitude: 33.669445, longitude: -117.823059 },
      locationList: [],
      franchiseName: '',
      markers: [],
      infowindow: null
    };
    this.map = null;
    this.marker = null;
    this.mapDivRef = React.createRef();
    this.handleGeoClick = this.handleGeoClick.bind(this);
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.handleLocationSearch = this.handleLocationSearch.bind(this);
    this.placeMarkers = this.placeMarkers.bind(this);
    this.clearMarkers = this.clearMarkers.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  clearMarkers() {
    for (let i = 0; i < this.state.markers.length; i++) {
      this.setState({ markers: this.state.markers[i].setMap(null) });
    }
    this.setState({ markers: [] });
  }

  componentDidMount() {
    if (this.mapDivRef.current && !this.map) {
      this.map = new window.google.maps.Map(this.mapDivRef.current);

    }
    if (this.map) {
      this.map.setOptions({ zoom: 11, center: { lat: 33.669445, lng: -117.823059 } });
    }
    this.clearMarkers();
  }

  handleGeoClick() {
    navigator.geolocation.getCurrentPosition(position => {
      if (position.coords) {
        this.setState({ coords: position.coords });
        this.map.setOptions({ center: { lat: position.coords.latitude, lng: position.coords.longitude } });
        this.marker = new window.google.maps.Marker();
        this.marker.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        this.marker.setMap(this.map);
      }
    });
    this.clearMarkers();
  }

  handleDropdownClick(event) {
    const ffName = event.target.textContent.replace(' ', '+');
    if (ffName !== this.state.franchiseName) {
      this.clearMarkers();
    } else if (this.state.franchiseName) {
      this.clearMarkers();
    }
    if (this.state.coords.latitude !== this.map.getCenter().lat() || this.state.coords.longitude !== this.map.getCenter().lng()) {
      this.setState({ coords: { latitude: this.map.getCenter().lat(), longitude: this.map.getCenter().lng() } });
      if (this.state.franchiseName) {
        this.clearMarkers();
      }
    }
    this.setState({ franchiseName: ffName }, this.handleLocationSearch);
  }

  handleLocationSearch() {
    // const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?';
    // const queryString = `query=${this.state.franchiseName}`;
    // const locationString = `&location=${this.state.coords.latitude}%2C${this.state.coords.longitude}`;
    // const radiusString = `&radius=${8000}`;
    // const type = '&type=restaurant';
    // const key = `&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    // const url = baseUrl + queryString + locationString + radiusString + type + key;
    // console.log('url:', url);
    const query = `${this.state.franchiseName}`;
    const location = `${this.state.coords.latitude}%2C${this.state.coords.longitude}`;
    const radius = `${8000}`;
    fetch(`/api/locations?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&radius=${radius}`)
      .then(res => res.json())
      .then(result => {
        this.setState({ locationList: result.results }, this.placeMarkers);
      })
      .catch(err => console.error('error:', err));
  }

  placeMarkers() {
    const markerArr = [];
    const listArr = this.state.locationList;
    const iconProps = {
      url: '/images/fries-icon.png',
      scaledSize: new window.google.maps.Size(40, 30),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(20, 25)
    };
    for (let i = 0; i < listArr.length; i++) {
      const marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(listArr[i].geometry.location.lat, listArr[i].geometry.location.lng),
        map: this.map,
        icon: iconProps,
        placeId: listArr[i].place_id,
        restName: listArr[i].name,
        restAddress: listArr[i].formatted_address,
        restRating: listArr[i].rating,
        restTotalRatings: listArr[i].user_ratings_total
      });
      marker.setAnimation(window.google.maps.Animation.DROP);
      markerArr.push(marker);
    }
    this.setState({ markers: markerArr }, this.handleMarkerClick);
  }

  handleMarkerClick(event) {
    let currWindow = false;
    const markersForInfoWindow = this.state.markers;
    markersForInfoWindow.forEach(marker => {
      const contentString =
        `<div class="info-window-header"><h6 class="info-header-text">${marker.restName}</h6></div>` + '<hr class="horizontal-line">' +
        `<div class="address-div"><p class="address-text">Address:&nbsp&nbsp${marker.restAddress}</p></div>` +
        `<div class="rating-div"><p class="rating-text">Rating: ${marker.restRating}&nbspout of 5&nbsp&nbsp&nbsp(Number of ratings: ${marker.restTotalRatings})</p></div>` +
        '<div class="add-fav-button-div"><button type=button class="add-fav-button">Add to Favorites</button></div>';
      const infoWindow = new window.google.maps.InfoWindow({
        content: contentString
      });
      marker.addListener('click', event => {
        if (currWindow) {
          currWindow.close();
        }
        currWindow = infoWindow;
        infoWindow.open({
          anchor: marker,
          map: this.map
        });
      });
      this.map.addListener('click', () => {
        infoWindow.close();
      });
    });

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
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={this.handleGeoClick}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="dropdown-menu-main">
            <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenu1" data-bs-toggle="dropdown" aria-expanded="false">
              Select a restaurant
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)} id='McDonald&apos;s'>McDonald&apos;s</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)} id='Taco Bell'>Taco Bell</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)} id='In-N-Out'>In-N-Out</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)} id='Chipotle'>Chipotle</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)} id='Burger King'>Burger King</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)} id='Del Taco'>Del Taco</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)} id='Carl&apos;s Jr'>Carl&apos;s Jr</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)} id='Wienerschnitzel'>Wienerschnitzel</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)} id='Subway'>Subway</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)} id='Jersey Mike&apos;s'>Jersey Mike&apos;s</a></li>
            </ul>
          </div>
        </div>
        <div ref={this.mapDivRef} style={{ height: '73vh', width: '81vw', margin: 'auto' }} />
      </div>
    );
  }
}

export default Map;
