import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { v4 as uuidv4 } from "uuid";
import { Subject } from "rxjs";

mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9zZWRldjI5IiwiYSI6ImNrc2NtbmdmejBpOGsyb3VmOHJuenVic2gifQ.-iDKBzL4CCDpGHJmZDl_1Q";

export const useMap = (initialPoint) => {
  const mapDiv = useRef();
  //useCallback memoriza el valor devulto y
  //solo se ejcuta cuando una de sus dependencias cambia

  //setRef ingresa la referencia del div en el cual ira el map
  //cuando el div sea creado
  const setRef = useCallback((node) => {
    mapDiv.current = node;
  }, []);
  const map = useRef(null);
  const [coords, setCoords] = useState(initialPoint);

  //referencia a los marcadores
  const markers = useRef({});

  //observables rxjs
  const onMoveMarker = useRef(new Subject());
  const onNewMarker = useRef(new Subject());

  //agregar marcadores
  const addMarker = useCallback((event) => {
    const { lng, lat } = event.lngLat;

    const marker = new mapboxgl.Marker();
    marker.id = uuidv4();
    marker.setLngLat([lng, lat]).addTo(map.current).setDraggable(true);
    //adTo recibe el map en el cual se insertara el marker
    //setDraggable permite deslizar el markador

    markers.current[marker.id] = marker;

    onNewMarker.current.next({
      id: marker.id,
      lng,
      lat,
    });

    //escuchar movimiento del marker
    marker.on("drag", (event) => {
      const { id } = event.target;
      const { lng, lat } = event.target.getLngLat();
      onMoveMarker.current.next({
        id,
        lng,
        lat,
      });
    });
  }, []);

  useEffect(() => {
    let mapbox = new mapboxgl.Map({
      container: mapDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [coords.lng, coords.lat],
      zoom: coords.zoom,
    });

    map.current = mapbox;
  }, [initialPoint]);

  //evento de movimiento en el map
  useEffect(() => {
    map.current?.on("move", () => {
      const { lng, lat } = map.current.getCenter();
      const zoom = map.current.getZoom();

      //toFixed(number) corta un numero al numero de decimales que se le indique
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: zoom.toFixed(2),
      });
    });

    return () => {
      map.current?.off("move");
    };
  }, []);

  //agregar marcadores al map al hacer click
  useEffect(() => {
    map.current?.on("click", addMarker);
  }, [addMarker]);

  //el sigono $ inidca que es un observable
  return {
    coords,
    setRef,
    addMarker,
    onNewMarker$: onNewMarker.current,
    onMoveMarker$: onMoveMarker.current,
  };
};
