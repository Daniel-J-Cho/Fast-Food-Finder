import React from 'react';
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = { coords: null };
    this.map = null;
    this.marker = null;
    this.mapDivRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);
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
        <div ref={this.mapDivRef} style={{ height: '68vh', width: '81vw', margin: 'auto' }} />
      </div>
    );
  }
}

export default Map;
