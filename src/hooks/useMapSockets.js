import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { useMap } from "./useMap";

const initialPoint = {
  lng: 5,
  lat: 34,
  zoom: 2,
};

export const useMapSockets = () => {
  const {
    coords,
    setRef,
    onNewMarker$,
    onMoveMarker$,
    addMarker,
    updateMarkerPosition,
  } = useMap(initialPoint);

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("active-markers", (markers) => {
      for (const key of Object.keys(markers)) {
        addMarker(markers[key]);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("updated-marker", (marker) => {
      updateMarkerPosition(marker);
    });
  }, [socket]);

  useEffect(() => {
    onNewMarker$.subscribe((marker) => {
      socket.emit("create-marker", marker);
    });
  }, [onNewMarker$, socket]);

  useEffect(() => {
    onMoveMarker$.subscribe((marker) => {
      socket.emit("updated-marker", marker);
    });
  }, [onMoveMarker$]);

  useEffect(() => {
    socket.on("create-marker", (marker) => {
      addMarker(marker);
    });
  }, [socket]);

  return {
    coords,
    setRef,
  };
};
