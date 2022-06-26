import { Layer, Marker, Popup, Source } from "react-map-gl";
import { Trip, TripStop } from "../typings"
import { Chip, Tooltip } from "@mui/material";
import { useState } from "react";
import { PanTool } from "@mui/icons-material";

export default ({ trip, delay = -5 }: { trip: Trip, delay?: number }) => {
    const [stopPopup, setStopPopup] = useState<TripStop>();

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
        {trip.stops.map((stop, i) => <Marker
            key={i}
            latitude={stop.location[0]}
            longitude={stop.location[1]}
            onClick={e => {
                e.originalEvent.stopPropagation();
                setStopPopup(stop);
            }}
        >
            <Tooltip title={stop.name} arrow placement="left">
                <div>
                    <button className="stop_marker" style={{ border: `3px solid ${trip.color}` }} title={stop.name} />
                </div>
            </Tooltip>
        </Marker>)}
        {stopPopup && <Popup
            anchor="top"
            latitude={stopPopup.location[0]}
            longitude={stopPopup.location[1]}
            onClose={() => setStopPopup(undefined)}
            offset={[1, 8]}
            style={{ textAlign: "center", backgroundColor: "white", zIndex: 10 }}
        >
            <h5 style={{ display: "inline" }}>{stopPopup.on_request && <PanTool style={{ width: 12, height: 12 }} />}&nbsp;<b style={{ fontSize: 14 }}>{stopPopup.name}</b></h5><br />
            za <b style={{ fontSize: 16 }}>{minutesUntil(stopPopup.arrival + (delay || 0))}</b> minut<br />
            <Chip label={new Date(stopPopup.arrival + (delay || 0)).toLocaleTimeString("pl", { hour12: false, hour: "2-digit", minute: "2-digit" })} variant="outlined" style={{ color: delay ? (delay > 0 ? "red" : "green") : "#000000", fontWeight: delay ? "bold" : "normal" }} />
        </Popup>}
    </>;
};

function minutesUntil(timestamp: number) {
    let res = Math.floor((timestamp - Date.now()) / 1000 / 60);
    if (res <= 0) return "<1";
    return res;
}