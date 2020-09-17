import React, {useState, useEffect} from 'react'
import {Map, TileLayer, Marker} from 'react-leaflet'
import Icon from "./Icon"
import "leaflet/dist/leaflet.css"

const MapView = () => {

    const [markers, setMarkers] = useState([])

    const [state, setState] = useState({
        position: {
            long: 0,
            lat: 0
        },
        zoom: 13
    })

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    setState({
                        position: {
                            long: position.coords.longitude,
                            lat: position.coords.latitude
                        },
                        zoom: 16
                    })
                }, 
                function(error) {
                    console.log(error)
                },
                {
                    enableHighAccuracy: true
                })
        }
    })

    const handleClick = (e)  => {

        setMarkers(markers => [...markers, e.latlng])
    }

    return (
        <Map 
            center={{lat: state.position.lat, lng: state.position.long}} 
            zoom={state.zoom}
            onclick={handleClick}>
            <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='attribution: "&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors"'/>
            <Marker position={{lat: state.position.lat, lng: state.position.long}} icon={Icon}/>
            {markers.map((marker, index) =>
                <Marker key={index} position={{lat: marker.lat, lng: marker.lng}} icon={Icon}/>
            )}
        </Map>
    )
}

export default MapView 