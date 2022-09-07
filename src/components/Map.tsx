import Map, { GeolocateControl, GeolocateControlRef, Layer, NavigationControl } from 'react-map-gl';
import { useState, useRef } from 'react';
import { Style } from 'mapbox-gl';
import { City } from '../util/typings';
import cities from "../util/cities.json";
import mapStyles from "../util/mapStyles.json";
import 'mapbox-gl/dist/mapbox-gl.css';

export default ({ city, location, style, children }: { city: City, location?: [number, number], style?: React.CSSProperties, children?: JSX.Element | JSX.Element[] }) => {
    const [pitch, setPitch] = useState(10);
    const geolocateControlRef = useRef<GeolocateControlRef>(null);
    const _loc = location || cities[city].location;
    const mapStyle = localStorage.getItem("mapstyle") as keyof typeof mapStyles || "ms";

    return <Map
        initialViewState={{
            longitude: _loc[1],
            latitude: _loc[0],
            zoom: 17
        }}
        minZoom={2}
        maxPitch={50}
        maxBounds={[{ lat: cities[city].bounds[0][0], lng: cities[city].bounds[0][1] }, { lat: cities[city].bounds[1][0], lng: cities[city].bounds[1][1] }]}
        mapStyle={mapStyles[mapStyle].style as string | Style}
        mapboxAccessToken="pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JnZnp5MDExMzJ4bWlpMjcwaDR0dCJ9.v2ONdyf7WN70xFwUOyUuXQ"
        attributionControl={false}
        style={style}
        onPitch={e => setPitch(e.target.getPitch())}
        onLoad={() => !window.location.search && geolocateControlRef.current?.trigger()}
    >
        <NavigationControl visualizePitch />
        <GeolocateControl trackUserLocation showUserHeading showUserLocation positionOptions={{ enableHighAccuracy: true }} fitBoundsOptions={{ animate: false, zoom: 15 }} ref={geolocateControlRef} />
        {pitch >= 35 && <Layer {...{
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 17,
            'paint': {
                'fill-extrusion-color': '#69A968',
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
            }
        }} />}
        {children}
    </Map>
};