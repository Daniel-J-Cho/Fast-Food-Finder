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
    this.markerForSearchBox = null;
    this.searchBox = null;
    this.mapDivRef = React.createRef();
    this.searchBoxRef = React.createRef();
    this.handleGeoClick = this.handleGeoClick.bind(this);
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.handleLocationSearch = this.handleLocationSearch.bind(this);
    this.placeMarkers = this.placeMarkers.bind(this);
    this.clearMarkers = this.clearMarkers.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.initSearchBox = this.initSearchBox.bind(this);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
    this.searchBoxMarker = this.searchBoxMarker.bind(this);
    this.prepEntryBox = this.prepEntryBox.bind(this);
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
    this.initSearchBox();
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
    if (this.markerForSearchBox) {
      this.markerForSearchBox.setMap(null);
    }
    this.clearMarkers();
  }

  handleDropdownClick(event) {
    const ffName = event.target.textContent.replace(' ', '+');
    this.clearMarkers();
    if (this.state.coords.latitude !== this.map.getCenter().lat() || this.state.coords.longitude !== this.map.getCenter().lng()) {
      this.setState({ coords: { latitude: this.map.getCenter().lat(), longitude: this.map.getCenter().lng() } });
      if (this.state.franchiseName) {
        this.clearMarkers();
        if (this.marker) {
          this.marker.setMap(null);
        }
      }
    }
    this.setState({ franchiseName: ffName }, this.handleLocationSearch);
  }

  handleLocationSearch() {
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

  initSearchBox() {
    if (this.searchBoxRef.current && !this.searchBox) {
      this.searchBox = new window.google.maps.places.SearchBox(this.searchBoxRef.current,
        {
          componentRestrictions: { country: ['us'] },
          fields: ['place_id', 'geometry', 'formatted_address']
        });
    }
    this.searchBox.addListener('places_changed', this.onPlaceChanged);
  }

  onPlaceChanged() {
    const place = this.searchBox.getPlaces();

    if (!place[0].geometry) {
      this.setState({ address: 'Enter a place' });
    } else {
      this.setState({ coords: { latitude: place[0].geometry.location.lat, longitude: place[0].geometry.location.lng } }, this.searchBoxMarker);
      this.setState({ address: place[0].formatted_address });
    }
  }

  searchBoxMarker() {
    this.map.setCenter({ lat: this.state.coords.latitude(), lng: this.state.coords.longitude() });
    this.markerForSearchBox = new window.google.maps.Marker({
      position: { lat: this.state.coords.latitude(), lng: this.state.coords.longitude() },
      map: this.map
    });
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
        `<div class="add-fav-button-div"><button id="addFav" restName=${marker.restName.replaceAll(' ', '_')} restAddress=${marker.restAddress.replaceAll(' ', '_')}
        class="add-fav-button">Add to Favorites</button></div>`;
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

  prepEntryBox(event) {
    if (event.target.id === 'addFav') {
      this.props.onUpdateNameAdd(event);
    }
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
        <div className="row mb-md-4 mb-sm-2">
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
          <div className="searchbox-div col d-flex justify-content-end">
            <input ref={this.searchBoxRef} id="searchbox" className="searchbox" placeholder="Enter an address" type="text" />
          </div>
        </div>
        <div ref={this.mapDivRef} className="map-div" style={{ height: '73vh', width: '81vw', margin: 'auto' }} onClick={event => this.prepEntryBox(event)} />
      </div>
    );
  }
}

export default Map;
