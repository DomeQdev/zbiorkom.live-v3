import { Layer, Marker, Source } from "react-map-gl";
import { Trip, TripStop } from "../typings"

export default ({ trip }: { trip: Trip }) => {
    return <>
        <Source type="geojson" data={trip.shapes}>
            <Layer
                id="route"
                type="line"
                layout={{
                    "line-join": "round",
                    "line-cap": "round"
                }}
                paint={{
                    "line-color": trip.color,
                    "line-width": 6
                }}
            />
        </Source>
        {trip.stops.map(stop => <Marker
            latitude={stop.location[0]}
            longitude={stop.location[1]}
        >
            <button className={`stop_marker`} style={{ border: `3px solid ${trip.color}` }} title={stop.name} />
        </Marker>)}
    </>;
};