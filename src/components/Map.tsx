import Map, { GeolocateControl, NavigationControl, Marker } from 'react-map-gl';
import cities from "../cities.json";

import 'mapbox-gl/dist/mapbox-gl.css';

export default ({ city, location, children }: { city: keyof typeof cities, location?: [number, number], children?: JSX.Element | JSX.Element[] }) => {
    const _loc = location || cities[city].location;

    return <Map
        initialViewState={{
            longitude: _loc[1],
            latitude: _loc[0],
            zoom: 17
        }}
        minZoom={8}
        minPitch={10}
        style={{ width: "100%", height: "calc(100vh - 64px)", overflow: "hidden" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken="pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JnZnp5MDExMzJ4bWlpMjcwaDR0dCJ9.v2ONdyf7WN70xFwUOyUuXQ" // idk if it's should be here, but who cares :)
        attributionControl={false}
    >
        <NavigationControl visualizePitch />
        <GeolocateControl trackUserLocation showUserHeading showUserLocation positionOptions={{ enableHighAccuracy: true }} />
        {children}
    </Map>
};
