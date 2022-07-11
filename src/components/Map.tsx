import Map, { GeolocateControl, NavigationControl } from 'react-map-gl';
import { Style } from 'mapbox-gl';
import { City } from '../util/typings';
import cities from "../cities.json";
import mapStyles from "../mapStyles.json";
import 'mapbox-gl/dist/mapbox-gl.css';

export default ({ city, location, children }: { city: City, location?: [number, number], children?: JSX.Element | JSX.Element[] }) => {
    const _loc = location || cities[city].location;
    const mapStyle = localStorage.getItem("mapstyle") as keyof typeof mapStyles;

    return <Map
        initialViewState={{
            longitude: _loc[1],
            latitude: _loc[0],
            zoom: 17
        }}
        minZoom={6}
        minPitch={10}
        //mapStyle="mapbox://styles/domeq/cl4snfed1000w14p634lkox6f"
        mapStyle={mapStyles["mapbox"].style}
        mapboxAccessToken="pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JnZnp5MDExMzJ4bWlpMjcwaDR0dCJ9.v2ONdyf7WN70xFwUOyUuXQ"
        attributionControl={false}
        style={{ position: "absolute" }}
    >
        <NavigationControl visualizePitch />
        <GeolocateControl trackUserLocation showUserHeading showUserLocation positionOptions={{ enableHighAccuracy: true }} />
        {children}
    </Map>
};
// ZQ6ZGRJE