import Map, { GeolocateControl, GeolocateControlRef, NavigationControl } from 'react-map-gl';
import { LngLatBounds, Style } from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { City } from '../util/typings';
import cities from "../util/cities.json";
import mapStyles from "../util/styles.json";
import 'mapbox-gl/dist/mapbox-gl.css';

export default ({ city, location, userLocation, style, children }: { city: City, location?: [number, number], userLocation?: GeolocationPosition, style?: React.CSSProperties, children?: JSX.Element | JSX.Element[] }) => {
    const [triggered, setTriggered] = useState(false);
    const geolocateControlRef = useRef<GeolocateControlRef>(null);
    const _loc = location || cities[city].location;
    const mapStyle = localStorage.getItem("mapStyle") as keyof typeof mapStyles || "ms";

    useEffect(() => {
        if (window.location.search || !userLocation || triggered) return;
        let bounds = cities[city].bounds;
        if (!new LngLatBounds([bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]).contains([userLocation.coords.longitude, userLocation.coords.latitude])) return;
        geolocateControlRef.current?.trigger();
    }, [userLocation, geolocateControlRef]);

    return <Map
        initialViewState={{
            longitude: _loc[1],
            latitude: _loc[0],
            zoom: 15
        }}
        minZoom={2}
        maxPitch={0}
        mapStyle={mapStyles[mapStyle]?.style as string | Style || mapStyles["ms"].style}
        mapboxAccessToken="pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JnZnp5MDExMzJ4bWlpMjcwaDR0dCJ9.v2ONdyf7WN70xFwUOyUuXQ"
        attributionControl={false}
        style={style}
        reuseMaps
    >
        <NavigationControl visualizePitch />
        <GeolocateControl
            trackUserLocation
            showUserHeading
            showUserLocation
            positionOptions={{ enableHighAccuracy: true }}
            fitBoundsOptions={{ animate: false, zoom: 15 }}
            ref={geolocateControlRef}
            onGeolocate={() => setTriggered(true)}
        />
        {children}
    </Map>
};