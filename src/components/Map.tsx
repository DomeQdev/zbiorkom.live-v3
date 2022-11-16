import Map from 'react-map-gl';
import { Style } from 'mapbox-gl';
import { City } from '../util/typings';
import cities from "../util/cities.json";
import mapStyles from "../util/styles.json";
import 'mapbox-gl/dist/mapbox-gl.css';

export default ({ city, location, style, children }: { city: City, location?: [number, number], style?: React.CSSProperties, children?: JSX.Element | JSX.Element[] }) => {
    const _loc = location || cities[city].location;
    const mapStyle = localStorage.getItem("mapStyle") as keyof typeof mapStyles || "ms";

    return <Map
        mapboxAccessToken="pk.eyJ1IjoiZG9tZXEiLCJhIjoiY2t6c2JnZnp5MDExMzJ4bWlpMjcwaDR0dCJ9.v2ONdyf7WN70xFwUOyUuXQ"
        mapStyle={mapStyles[mapStyle]?.style as string | Style || mapStyles["ms"].style}
        initialViewState={{
            longitude: _loc[1],
            latitude: _loc[0],
            zoom: 16
        }}
        minZoom={2}
        maxPitch={0}
        attributionControl={false}
        touchZoomRotate={false}
        dragRotate={false}
        reuseMaps={true}
        style={style}
    >
        {children}
    </Map>
};