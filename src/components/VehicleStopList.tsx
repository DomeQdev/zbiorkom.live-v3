import { Avatar, Divider, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import { PanTool } from "@mui/icons-material";
import { useMap } from "react-map-gl";
import { RealTimeResponse } from "../util/realtime";
import { City, Trip, VehicleType } from "../util/typings";
import { Color, Icon } from "./Icons";

export default ({ trip, realtime, type, city, scrolled, setScrolled, stopFollowing }: { trip: Trip, realtime: RealTimeResponse, type: VehicleType, city: City, scrolled: boolean, setScrolled: (scrolled: boolean) => void, stopFollowing: () => void }) => {
    const { current: map } = useMap();
    const color = Color(type, city);

    return <List>
        {realtime.stops.map<React.ReactNode>((stop, i) => <ListItemButton
            key={i}
            onClick={() => {
                stopFollowing();
                map?.flyTo({
                    center: [stop.location[1], stop.location[0]],
                    zoom: 17
                });
            }}
            ref={(r) => {
                if (!scrolled && (i === realtime.servingIndex || (!realtime.servingIndex && i + 1 === realtime.nextStopIndex))) {
                    r?.scrollIntoView();
                    setScrolled(true);
                }
            }}
        >
            <ListItemAvatar>
                <>
                    <Avatar sx={{ color: "white", bgcolor: "white", width: 14.9, height: 14.9, border: `2px solid ${color}`, marginLeft: 2.6, marginRight: "auto", zIndex: 100 }} />
                    {i + 1 !== realtime.stops.length && <Paper elevation={0} sx={{ border: `7.5px solid ${color}`, backgroundColor: color, borderRadius: 0, marginLeft: 2.58, marginTop: -0.9, opacity: realtime.snIndex <= i + 1 && realtime.servingIndex !== i + 1 ? 1 : 0.4, height: '100%', position: 'absolute' }} />}
                    {(realtime.servingIndex === i || realtime.nextStopIndex === i + 1) && <IconButton key="move" sx={{ position: "absolute", zIndex: 101, transition: "margin 300ms", backgroundColor: "white", border: `1px solid ${color}`, opacity: 1, marginLeft: 1.70, marginTop: realtime.servingIndex === i ? -2.3 : returnTravelled(realtime.travelledToNextStop), pointerEvents: "none", padding: 0.5 }}><Icon type={type} style={{ width: 18, height: 18, fill: "#757575" }} /></IconButton>}
                </>
            </ListItemAvatar>
            <ListItemText
                sx={{ opacity: realtime.snIndex > i ? 0.6 : 1, }}
                primary={<Typography noWrap>{stop.on_request && <PanTool sx={{ width: 15, height: 15 }} />} {stop.name}</Typography>}
                secondary={<><span style={{ textDecoration: Math.round(realtime.delay / 60000) ? "line-through" : "" }}>{new Date(stop.departure).toLocaleTimeString("pl", { hour12: false, hour: "2-digit", minute: "2-digit" })}</span> {!!Math.round(realtime.delay / 60000) && new Date(stop.departure + realtime.delay).toLocaleTimeString("pl", { hour12: false, hour: "2-digit", minute: "2-digit" })}{stop.platform && <> · Peron <b>{stop.platform}</b></>}</>}
            />
            <ListItemText
                sx={{ textAlign: "right" }}
                primary={realtime.snIndex <= i && <><b>{minutesUntil(stop.departure + realtime.delay)}</b> min</>}
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