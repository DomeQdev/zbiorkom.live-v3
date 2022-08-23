import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Skeleton } from "@mui/material";
import { BusAlert, Close, DirectionsTransit, MoreVert } from "@mui/icons-material";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useMap } from "react-map-gl";
import toast from "react-hot-toast";
import { City, Stop, StopDepartures, Vehicle } from "../util/typings";
import { getData } from "../util/api";
import { Color, Icon } from "../components/Icons";
import { minutesUntil } from "../components/VehicleStopList"
import StopMarker from "../components/StopMarker";
import VehicleHeadsign from "../components/VehicleHeadsign";
import VehicleMarker from "../components/VehicleMarker";
import isDark from "../util/isDark";

export default ({ city, stop, vehicles }: { city: City, stop: Stop, vehicles: Vehicle[] }) => {
    const { current: map } = useMap();
    const navigate = useNavigate();
    const darkMode = isDark();
    const [stopDepartures, setStopDepartures] = useState<StopDepartures>();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();

    useEffect(() => {
        map?.flyTo({
            center: [stop.location[1], stop.location[0]]
        });
        const fetchDepartures = () => getData("stop", city, {
            stop: stop.id
        }).then((res) => {
            if (res.error) {
                toast.error(res.error);
                return navigate(".", { replace: true });
            }
            setStopDepartures(res);
        }).catch((e) => {
            console.error(e);
            toast.error("Wystąpił fatalny błąd podczas pobierania danych.");
            navigate(".", { replace: true });
        });
        fetchDepartures();
        const int = setInterval(fetchDepartures, 20000);
        return () => clearInterval(int);
    }, [stop]);

    return <>
        <StopMarker stop={stop} city={city} />
        {vehicles.filter(v => stopDepartures?.departures.some(d => d.trip && d.trip === v.trip)).map(v => <VehicleMarker key={v.trip} vehicle={v} city={city} mapBearing={map?.getBearing() || 0} onClick={() => navigate(`?vehicle=${v.type}/${v.tab}`)} />)}
        <BottomSheet
            open
            defaultSnap={({ maxHeight }) => maxHeight / 3.5}
            snapPoints={({ maxHeight }) => [
                maxHeight / 3,
                maxHeight * 0.5
            ]}
            onDismiss={() => navigate(".", { replace: true })}
            style={{ zIndex: 100, position: "absolute" }}
            blocking={false}
            expandOnContentDrag
            header={<>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <IconButton onClick={() => navigate(".", { replace: true })} style={{ height: 40 }}><Close /></IconButton>

                    <div style={{ display: "inline-flex", cursor: "pointer" }} onClick={() => {
                        map?.flyTo({
                            center: [stop.location[1], stop.location[0]],
                            zoom: 17
                        });
                    }}>
                        {stop.type ? stop.type.map(type => <Icon type={type} key={type} style={{ color: Color(type, city) }} />) : <DirectionsTransit sx={{ color: Color("unknown", city) }} />}&nbsp;{stop.name} {stop.code || ""}
                    </div>

                    <IconButton onClick={({ currentTarget }: { currentTarget: HTMLElement }) => setAnchorEl(anchorEl ? null : currentTarget)} style={{ height: 40 }}><MoreVert /></IconButton>
                </div>
                {stopDepartures?.lines && <Box
                    sx={{
                        display: "flex",
                        marginTop: 1,
                        width: "100%",
                        overflowX: "auto",
                        button: {
                            flex: "none"
                        }
                    }}
                >
                    {stopDepartures.lines.map((line, i) => <Button
                        variant="contained"
                        key={i}
                        sx={{
                            backgroundColor: line.color,
                            color: line.text,
                            mx: 0.4,
                            px: 2,
                            py: 0,
                            borderRadius: 2,
                            minWidth: 0,
                            opacity: i % 2 === 0 ? 1 : 0.9,
                            "&:hover": {
                                backgroundColor: line.color,
                                color: line.text
                            }
                        }}
                    >
                        {line.line}
                    </Button>)}
                </Box>}
            </>}
        >
            {stopDepartures?.alert && <Alert severity={stopDepartures.alert.type} sx={{ cursor: stopDepartures.alert.link ? "pointer" : "" }} onClick={() => stopDepartures.alert?.link ? window.open(stopDepartures.alert!.link, "_blank") : null}>{stopDepartures.alert.text}</Alert>}
            {stopDepartures ? stopDepartures.departures.length ? <List>
                {stopDepartures.departures.map<React.ReactNode>((departure) => <ListItemButton key={departure.trip} onClick={() => map?.flyTo({
                    center: vehicles.find(v => v.trip === departure.trip)?._location || [stop.location[1], stop.location[0]],
                    zoom: 17
                })}>
                    <ListItemText
                        primary={<VehicleHeadsign type={departure.type} line={departure.line} headsign={departure.headsign} color={departure.color} textColor={departure.text} />}
                        secondary={<>{Math.floor(departure.delay / 60000) ? <b style={{ color: darkMode ? "#F26663" : "red" }}>{Math.abs(Math.floor(departure.delay / 60000))} min {departure.delay > 0 ? "opóźnienia" : "przed czasem"}</b> : <b style={{ color: departure.status === "REALTIME" ? darkMode ? "#90EE90" : "green" : "" }}>{departure.status === "REALTIME" ? "Planowo" : "Według rozkładu"}</b>} · <span style={{ textDecoration: Math.floor(departure.delay / 60000) ? "line-through" : "" }}>{new Date(departure.scheduledTime).toLocaleTimeString("pl", { hour12: false, hour: "2-digit", minute: "2-digit" })}</span>{departure.platform && <> · Peron <b>{departure.platform}</b></>}</>}
                    />
                    <ListItemText
                        sx={{ textAlign: "right" }}
                        primary={<><b>{minutesUntil(departure.realTime)}</b> min</>}
                    />
                </ListItemButton>).reduce((prev, curr, i) => [prev, <Divider key={`divi-${i}`} />, curr])}
            </List> : <div style={{ textAlign: "center" }}>
                <BusAlert color="primary" sx={{ width: 60, height: 60, marginTop: 1 }} /><br />
                <b style={{ fontSize: 17 }}>Brak odjazdów w najbliższym czasie.</b>
            </div> : <List>
                {new Array(5).fill(0).map<React.ReactNode>((_, i) => <ListItem key={i}>
                    <ListItemText
                        primary={<VehicleHeadsign />}
                        secondary={<Skeleton variant="text" width={120} height={20} />}
                    />
                </ListItem>).reduce((prev, curr, i) => [prev, <Divider key={`div-${i}`} />, curr])}
            </List>}
        </BottomSheet>
    </>;
};