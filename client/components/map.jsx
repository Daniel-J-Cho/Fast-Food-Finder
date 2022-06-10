import React from 'react';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: { latitude: 33.669445, longitude: -117.823059 },
      locationList: [],
      franchiseName: '',
      markers: [],
      address: ''
    };
    this.map = null;
    this.marker = null;
    this.autoComplete = null;
    this.mapDivRef = React.createRef();
    this.autoCompleteRef = React.createRef();
    this.handleGeoClick = this.handleGeoClick.bind(this);
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.handleLocationSearch = this.handleLocationSearch.bind(this);
    this.placeMarkers = this.placeMarkers.bind(this);
    this.clearMarkers = this.clearMarkers.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.initAutoComplete = this.initAutoComplete.bind(this);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
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
    this.initAutoComplete();
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
    this.clearMarkers();
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

  initAutoComplete() {
    if (this.autoCompleteRef.current && !this.autoComplete) {
      this.autoComplete = new window.google.maps.places.Autocomplete(this.autoCompleteRef.current,
        {
          types: ['restaurant'],
          componentRestrictions: { country: ['us'] },
          fields: ['place_id', 'geometry', 'name']
        });
    }
    this.autoComplete.addListener('place_changed', this.onPlaceChanged);
    // console.log('this.autoComplete:', this.autoComplete);
  }

  onPlaceChanged() {
    const place = this.autoComplete.getPlace();
    // console.log('place:', place);

    if (!place.geometry) {
      this.setState({ address: 'Enter a place' });
    } else {
      this.setState({ coords: { latitude: place.geometry.location.lat, longitude: place.geometry.location.lng } });
      this.setState({ address: place.name });
      // calling this.handleLocationSearch here gives a variety of restaurants and not the one you typed in the search bar
      // this.handleLocationSearch();
      // if (this.state.franchiseName) {
      //   this.clearMarkers();
      // }
    }
  }

  placeMarkers() {
    const markerArr = [];
    const listArr = this.state.locationList;
    const iconProps = {
      url: '/images/fries-icon.png',
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(20, 25),
      scaledSize: new window.google.maps.Size(40, 30)
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
    // console.log('this.state:', this.state);
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
          <div className="dropdown-menu-main col-2">
            <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenu1" data-bs-toggle="dropdown" aria-expanded="false">
              Select a restaurant
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>McDonald&apos;s</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Taco Bell</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>In-N-Out</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Chipotle</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Burger King</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Del Taco</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Carl&apos;s Jr</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Wendy&apos;s</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Wienerschnitzel</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Subway</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Jersey Mike&apos;s</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Mendocino Farms</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>KFC</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Popeye&apos;s</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Church&apos;s Chicken</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Domino&apos;s</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Pizza Hut</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Krispy Kreme</a></li>
              <li><a className="dropdown-item" href="#" onClick={event => this.handleDropdownClick(event)}>Dunkin&apos;</a></li>
            </ul>
          </div>
          <div className="autocomplete-div col d-flex justify-content-end">
            <input ref={this.autoCompleteRef} id="autocomplete" placeholder="Enter a place" type="text" />
          </div>
        </div>
        <div ref={this.mapDivRef} style={{ height: '73vh', width: '81vw', margin: 'auto' }} />
      </div>
    );
  }
}

export default Map;
