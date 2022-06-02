import { useState, useEffect } from 'react';
import Map from './map';

const Marker = () => {
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker({
        position: new window.google.maps.LatLng(33.669445, -117.823059),
        map: Map
      }));
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);
};

export default Marker;
