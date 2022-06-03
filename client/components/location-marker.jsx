import React from 'react';

function LocationMarker(props) {

  return (
    <div>
      <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#permModal"><i className="fa-solid fa-location-dot"></i></button>
    </div>
  );
}

export default LocationMarker;
