import { Avatar, Divider, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { PanTool } from "@mui/icons-material";
import { useMap } from "react-map-gl";
import { RealTimeResponse } from "../util/realtime";
import { Trip, VehicleType } from "../util/typings";
import { Icon } from "./Icons";

export default ({ trip, realtime, type, scrolled, setScrolled }: { trip: Trip, realtime: RealTimeResponse, type: VehicleType, scrolled: boolean, setScrolled: () => void }) => {
    const { current: map } = useMap();

    return <List>
        {realtime.stops.map<React.ReactNode>(stop => <ListItemButton
            key={stop.sequence}
            onClick={() => {
                setScrolled(true);
                map?.flyTo({
                    center: [stop.location[1], stop.location[0]],
                    zoom: 17
                });
            }}
            ref={(r) => {
                if (!scrolled && (stop.sequence === realtime.servingIndex || (!realtime.servingIndex && stop.sequence + 1 === realtime.nextStopIndex))) {
                    r?.scrollIntoView();
                    setScrolled(true);
                }
            }}
        >
            <ListItemAvatar>
                <>
                    <Avatar sx={{ bgcolor: trip.text, color: trip.text, width: 15, height: 15, border: `2px solid ${trip.color}`, marginLeft: "auto", marginRight: "auto", zIndex: 100 }} />
                    {stop.sequence + 1 !== realtime.stops.length && <div style={{ border: `7.5px solid ${trip.color}`, boxShadow: `0px 0px 8px 0px ${trip.text}`, backgroundColor: trip.color, marginLeft: 20.5, marginTop: -6, opacity: realtime.snIndex >= stop.sequence ? 0.6 : 1, height: '100%', position: 'absolute' }} />}
                    {(realtime.servingIndex === stop.sequence || realtime.nextStopIndex === stop.sequence + 1) && <IconButton key="move" sx={{ position: "absolute", zIndex: 101, transition: "margin 300ms", backgroundColor: "white", border: `1px solid ${trip.color}`, opacity: 1, marginLeft: 1.85, marginTop: realtime.servingIndex === stop.sequence ? -2.3 : returnTravelled(realtime.travelledToNextStop), pointerEvents: "none", padding: 0.4 }}><Icon type={type} style={{ width: 18, height: 18, fill: "#757575" }} /></IconButton>}
                </>
            </ListItemAvatar>
            <ListItemText
                sx={{ opacity: realtime.snIndex > stop.sequence ? 0.6 : 1, }}
                primary={<Typography noWrap>{stop.on_request && <PanTool sx={{ width: 15, height: 15 }} />} {stop.name}</Typography>}
                secondary={<><span style={{ textDecoration: Math.floor(realtime.delay / 60000) ? "line-through" : "" }}>{new Date(stop.departure).toLocaleTimeString("pl", { hour12: false, hour: "2-digit", minute: "2-digit" })}</span> {!!Math.floor(realtime.delay / 60000) && new Date(stop.realDeparture).toLocaleTimeString("pl", { hour12: false, hour: "2-digit", minute: "2-digit" })}{stop.platform && <> · Peron <b>{stop.platform}</b></>}</>}
            />
            <ListItemText
                sx={{ textAlign: "right" }}
                primary={realtime.snIndex <= stop.sequence && <><b>{minutesUntil(stop.realDeparture)}</b> min</>}
            />
        </ListItemButton>).reduce((prev, curr, i) => [prev, <Divider key={`divi-${i}`} />, curr])}
    </List>;
};

function minutesUntil(timestamp: number) {
    let res = Math.floor((timestamp - Date.now()) / 1000 / 60);
    if (res <= 0) return "<1";
    return res;
}

function returnTravelled(percent: number) {
    return -2.3 + ((1 - percent) * 6.8);
}

export { minutesUntil };