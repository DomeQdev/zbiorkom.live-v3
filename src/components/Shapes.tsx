import { Layer, Marker, Popup, Source } from "react-map-gl";
import { Chip, Tooltip } from "@mui/material";
import { PanTool } from "@mui/icons-material";
import { useState } from "react";
import { minutesUntil } from "./VehicleStopList";
import { Trip, TripStop } from "../util/typings";
import { RealTimeResponse } from "../util/realtime";
import styled from "@emotion/styled";

const StopMarker = styled.button((props) => ({
    width: 5,
    height: 5,
    padding: 5,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    justifyContent: "center",
    outline: "none",
    border: `3px solid ${props.color?.toLowerCase() === "#ffffff" ? "#000" : props.color}`,
    borderRadius: 18
}));

export default ({ trip, realTime }: { trip: Trip, realTime?: RealTimeResponse }) => {
    const [stopPopup, setStopPopup] = useState<TripStop>();
    let delay = realTime?.delay || 0;

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
                    "line-width": 5
                }}
            />
            <Layer
                id="route2"
                type="line"
                layout={{
                    "line-join": "round",
                    "line-cap": "round"
                }}
                paint={{
                    "line-color": trip.text,
                    "line-width": 1,
                    "line-gap-width": 5
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
            style={{ zIndex: 5 }}
        >
            <Tooltip title={stop.name} arrow placement="left">
                <StopMarker color={trip.color} />
            </Tooltip>
        </Marker>)}
        {stopPopup && <Popup
            anchor="top"
            latitude={stopPopup.location[0]}
            longitude={stopPopup.location[1]}
            onClose={() => setStopPopup(undefined)}
            offset={[1, 8]}
            style={{ textAlign: "center", color: "black", backgroundColor: "white", zIndex: 10 }}
            closeButton={false}
        >
            <h5 style={{ display: "inline" }}>{stopPopup.on_request && <PanTool style={{ width: 13, height: 13 }} />}&nbsp; <b style={{ fontSize: 15 }}>{stopPopup.name}</b></h5><br />
            {!realTime || realTime.snIndex <= stopPopup.sequence ? <>
                za <b style={{ fontSize: 16 }}>{minutesUntil(stopPopup.arrival + delay)}</b> min<br />
                <Chip label={new Date(stopPopup.arrival + delay).toLocaleTimeString("pl", { hour12: false, hour: "2-digit", minute: "2-digit" })} variant="outlined" style={{ color: Math.floor(delay / 60000) ? (delay > 0 ? "red" : "green") : "#000000", fontWeight: delay ? "bold" : "normal" }} />
            </> : <b>Odjechał</b>}
        </Popup>}
    </>;
};