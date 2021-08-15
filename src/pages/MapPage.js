import React, { useEffect } from "react";
import { useMap } from "../hooks/useMap";

const initialPoint = {
  lng: 5,
  lat: 34,
  zoom: 2,
};

export const MapPage = () => {
  const { coords, setRef, onNewMarker$, onMoveMarker$ } = useMap(initialPoint);

  useEffect(() => {
    onNewMarker$.subscribe((marker) => {
      console.log("marker created: ", marker);
    });
  }, [onNewMarker$]);

  useEffect(() => {
    onMoveMarker$.subscribe((marker) => {
      console.log("marker move: ", marker);
    });
  }, [onMoveMarker$]);

  return (
    <>
      <div className="mapInfo">
        Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="mapContainer"></div>
    </>
  );
};
