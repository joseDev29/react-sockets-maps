import React from "react";

import { useMapSockets } from "../hooks/useMapSockets";

export const MapPage = () => {
  const { coords, setRef } = useMapSockets();

  return (
    <>
      <div className="mapInfo">
        Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainer"></div>
    </>
  );
};
