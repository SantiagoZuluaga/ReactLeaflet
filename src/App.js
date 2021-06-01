import React, { useEffect, useRef, useState } from 'react';
import L from "leaflet";
import "leaflet-routing-machine";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine/dist/leaflet.routing.icons.png';
import { PositionIcon, RouteIcon } from "./components/Icon"

function App() {
  const [mapReference, setMapReference] = useState(null);
  const [routing, setRouting] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapReferenceRef = useRef();
  const routeRef = useRef();
  const routingRef = useRef();
  mapReferenceRef.current = mapReference;
  routeRef.current = markers;
  routingRef.current = routing;

  const handlerCallback = (event, callback) => {
    callback();
  }

  const handlerEventMap = (e, map) => {
    handlerCallback(e, () => {
      if (routeRef.current.length == 0) {
        setMarkers([...routeRef.current, {
          position: e.latlng,
          marker: L.marker(e.latlng, { icon: RouteIcon }).addTo(map)
        }]);
      } else if (routeRef.current.length == 1 && routeRef.current.length < 2) {
        setMarkers([...routeRef.current, {
          position: e.latlng,
          marker: L.marker(e.latlng, { icon: RouteIcon }).addTo(map)
        }]);
        setRouting(L.Routing.control({
          waypoints: [
            L.Routing.waypoint(L.latLng(routeRef.current[0].position.lat, routeRef.current[0].position.lng)),
            L.Routing.waypoint(L.latLng(routeRef.current[1].position.lat, routeRef.current[1].position.lng))],
          routeWhileDragging: true,
          showAlternatives: true,
          createMarker: () => { }
        }).addTo(map));

      } else if (routeRef.current.length == 2) {
        map.removeLayer(routeRef.current[0].marker);
        map.removeLayer(routeRef.current[1].marker);
        routingRef.current.remove();
        setRouting(null);
        setMarkers([...[], {
          position: e.latlng,
          marker: L.marker(e.latlng, { icon: RouteIcon }).addTo(map)
        }]);
      }
    })
  }

  const handlerMap = (position) => {
    let map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 16);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([position.coords.latitude, position.coords.longitude], { icon: PositionIcon }).addTo(map)
    map.on("contextmenu", (e) => { handlerEventMap(e, map) });
    map.on("click", (e) => { handlerEventMap(e, map) });

  }

  useEffect(() => {
    document.title = "Map Routing"
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        handlerMap,
        (error) => {
          console.log(error)
          handlerMap([""])
        },
        {
          enableHighAccuracy: true
        })
    }
  }, [])

  return (
    <div className="App">
      <div style={{ height: "100vh" }} id="map"></div>
    </div>
  );
}

export default App;
