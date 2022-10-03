import Map, { GeolocateControl, GeolocateControlRef, NavigationControl } from 'react-map-gl';
import { LngLatBounds, Style } from 'mapbox-gl';
import { useRef } from 'react';
import { City } from '../util/typings';
import cities from "../util/cities.json";
import mapStyles from "../util/styles.json";
import 'mapbox-gl/dist/mapbox-gl.css';

export default ({ city, location, style, children }: { city: City, location?: [number, number], style?: React.CSSProperties, children?: JSX.Element | JSX.Element[] }) => {
    const geolocateControlRef = useRef<GeolocateControlRef>(null);
    const _loc = location || cities[city].location;
    const mapStyle = localStorage.getItem("mapStyle") as keyof typeof mapStyles || "ms";

    return <Map
        initialViewState={{
            longitude: _loc[1],
            latitude: _loc[0],
            zoom: 17
        }}
        minZoom={2}
        maxPitch={0}
        mapStyle={mapStyles[mapStyle].style as string | Style}
        mapboxAccessToken="pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JnZnp5MDExMzJ4bWlpMjcwaDR0dCJ9.v2ONdyf7WN70xFwUOyUuXQ"
        attributionControl={false}
        style={style}
        onLoad={({ target }) => {
            if (window.location.search || !navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition((pos) => {
                let bounds = cities[city].bounds;
                if (!new LngLatBounds([bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]).contains([pos.coords.longitude, pos.coords.latitude])) return;
                target.flyTo({
                    center: [pos.coords.longitude, pos.coords.latitude],
                    zoom: 15,
                    duration: 0
                });
                geolocateControlRef.current?.trigger();
            });
        }}
    >
        <NavigationControl visualizePitch />
        <GeolocateControl
            trackUserLocation
            showUserHeading
            showUserLocation
            positionOptions={{ enableHighAccuracy: true }}
            fitBoundsOptions={{ animate: false, zoom: 15 }}
            ref={geolocateControlRef}
        />
        {children}
    </Map>
};