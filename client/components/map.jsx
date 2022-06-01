import React, { useState, useRef, useEffect } from 'react';

const Map = () => {
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
    if (map) {
      map.setOptions({ zoom: 11, center: { lat: 33.669445, lng: -117.823059 } });
    }
  }, [ref, map]);

  return <div ref={ref} style={{ height: '68vh', width: '80vw', margin: 'auto' }}/>;
};

export default Map;
