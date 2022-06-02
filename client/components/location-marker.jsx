import React from 'react';
import Marker from './marker';
import Map from './map';

function LocationMarker(props) {
  function locateCurrPos() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          <Marker map={Map} position={pos} />;
        }
      );
    }
  }
  return (
    <div>
      <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#permModal"><i className="fa-solid fa-location-dot"></i></button>
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
              <button type="button" className="btn btn-primary" onClick={locateCurrPos}>Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationMarker;
