import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";
import { toast } from "react-hot-toast";
import { useMap } from "react-map-gl";
import { Divider, IconButton, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Skeleton, Badge } from "@mui/material";
import { Check, Close, Commit, DirectionsBus, GpsFixed, History, LocationDisabled, Logout, MoreVert, Route, WifiOff } from "@mui/icons-material";
import { bbox, lineString } from "@turf/turf";
import { RealTime, RealTimeResponse } from "../util/realtime";
import { Trip, City, Vehicle } from "../util/typings";
import { getData } from "../util/api";
import Shapes from "../components/Shapes";
import VehicleMarker from "../components/VehicleMarker";
import VehicleHeadsign from "../components/VehicleHeadsign";
import VehicleStopList from "../components/VehicleStopList";
import Timer from "../components/Timer";
import styled from "@emotion/styled";
import isDark from "../util/isDark";

export default ({ city, vehicle, mapBearing }: { city: City, vehicle: Vehicle, mapBearing: number }) => {
    const navigate = useNavigate();
    const { state, search } = useLocation();
    const { current: map } = useMap();
    const [follow, setFollow] = useState<boolean>(true);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [trip, setTrip] = useState<Trip>();
    const [realTime, setRealTime] = useState<RealTimeResponse>();
    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const darkMode = isDark();

    useEffect(() => {
        map?.on("movestart", (e) => e.originalEvent && e.originalEvent.type !== "resize" ? setFollow(false) : undefined);
    }, []);

    useEffect(() => {
        if (!follow) return;
        setScrolled(false);
        map?.flyTo({
            center: [vehicle.location[1], vehicle.location[0]],
            duration: 0
        });
    }, [vehicle.location, follow]);

    useEffect(() => {
        if (!vehicle.trip) return setTrip(undefined);

        setScrolled(false);
        getData("trip", city, {
            trip: encodeURIComponent(vehicle.trip)
        }).then(setTrip).catch(() => toast.error("Nie mogliśmy pobrać trasy..."));
    }, [vehicle.trip]);

    useEffect(() => {
        if (!trip || trip.error) return;
        setRealTime(RealTime({
            trip,
            location: [vehicle.location[1], vehicle.location[0]],
            delay: vehicle.delay
        }));
    }, [vehicle, trip]);

    const InlineB = styled.b({
        display: "inline-flex",
        alignItems: "center"
    });

    return <>
        <VehicleMarker vehicle={vehicle} city={city} mapBearing={mapBearing} />
        {(trip && !trip.error) && <Shapes trip={trip} type={vehicle.type} city={city} realTime={realTime} />}
        <BottomSheet
            open
            snapPoints={({ maxHeight }) => [maxHeight / 3]}
            onDismiss={() => navigate(".", { replace: true })}
            style={{ zIndex: 100, position: "absolute" }}
            blocking={false}
            expandOnContentDrag
            skipInitialTransition
            header={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <IconButton onClick={() => navigate(".", { replace: true })} style={{ height: 40 }}><Close /></IconButton>

                <div style={{ cursor: "pointer" }} onClick={() => {
                    setFollow(true);
                    setScrolled(false);
                }}>
                    <VehicleHeadsign type={vehicle.type} city={city} route={vehicle.route} headsign={trip?.headsign || ""} />

                    {vehicle.trip && !trip?.error ? (realTime && trip) ? <span style={{ lineHeight: 1.4, fontSize: 15 }}><br />
                        {trip.stops[0].departure > Date.now()
                            ? <InlineB><Logout style={{ width: 18, height: 18 }} />&nbsp;Odjazd{!!Math.floor((trip.stops[0].departure - Date.now()) / 60000) && ` za ${Math.floor((trip.stops[0].departure - Date.now()) / 60000)} min`}</InlineB>
                            : vehicle.isPredicted && vehicle.delay === undefined
                                ? <InlineB><WifiOff style={{ width: 18, height: 18 }} />&nbsp;Brak informacji o opóźnieniu</InlineB>
                                : Math.floor(realTime.delay / 60000) ? <InlineB style={{ color: realTime.delay > 0 ? darkMode ? "#F26663" : "red" : darkMode ? "#90EE90" : "green" }}><History style={{ width: 18, height: 18 }} />&nbsp;{Math.abs(Math.floor(realTime.delay / 60000))} min {realTime.delay > 0 ? "opóźnienia" : "przed czasem"}</InlineB> : <InlineB><Check style={{ width: 18, height: 18 }} />&nbsp;Planowo</InlineB>}
                    </span> : <Skeleton variant="text" style={{ width: 139, height: 21 }} /> : null}
                </div>

                {trip || !vehicle.trip ? <IconButton onClick={({ currentTarget }: { currentTarget: HTMLElement }) => setAnchorEl(anchorEl ? undefined : currentTarget)} style={{ height: 40 }}>
                    <Badge color="error" variant="dot" invisible={Date.now() - vehicle.lastPing < 300000}>
                        <MoreVert />
                    </Badge>
                </IconButton> : <Skeleton variant="circular" width={40} height={40} />}
            </div>}
        >
            {vehicle.trip && !trip?.error
                ? (realTime && trip)
                    ? <VehicleStopList realtime={realTime} type={vehicle.type} city={city} scrolled={scrolled} setScrolled={setScrolled} stopFollowing={() => setFollow(false)} />
                    : <List>
                        {new Array(10).fill(null).map<React.ReactNode>((_, i) => <ListItem key={i}>
                            <ListItemAvatar>
                                <Skeleton variant="circular" width={15} height={15} sx={{ marginLeft: "auto", marginRight: "auto" }} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Skeleton variant="text" width={200} />}
                                secondary={<Skeleton variant="text" width={100} />}
                            />
                        </ListItem>).reduce((prev, curr, i) => [prev, <Divider key={`div-${i}`} />, curr])}
                    </List>
                : <div style={{ textAlign: "center" }}>
                    <h2>Brak trasy</h2>
                    <p>Pojazd nie realizuje żadnego kursu lub jego trasa nie została dodana do systemu.</p>
                </div>}
        </BottomSheet>
        <Dialog
            open={state === "vehicle"}
            onClose={() => navigate(search, { state: "", replace: true })}
            fullWidth
            scroll="paper"
        >
            <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Informacje o pojeździe</span><IconButton onClick={() => navigate(search, { state: "", replace: true })}><Close /></IconButton></DialogTitle>
            <DialogContent dividers>
                Numer pojazdu: {vehicle.id}

            </DialogContent>
        </Dialog>
        <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(undefined)}
            style={{ zIndex: 300000 }}
        >
            <MenuItem sx={{ borderBottom: 1, borderColor: "divider", pointerEvents: "none" }}>{vehicle.isPredicted ? <LocationDisabled style={{ width: 20, height: 20 }} color="primary" /> : <GpsFixed style={{ width: 20, height: 20 }} color="primary" />}&nbsp;<b style={{ color: Date.now() - vehicle.lastPing > 300000 ? "red" : "" }}><Timer timestamp={vehicle.lastPing} /></b>&nbsp;temu</MenuItem>
            {trip?.shapes && <MenuItem onClick={() => {
                setAnchorEl(undefined);
                setFollow(false);
                const [minLng, minLat, maxLng, maxLat] = bbox(lineString(trip.shapes));
                map?.fitBounds([[minLat, minLng], [maxLat, maxLng]], { duration: 0 });
            }}><Route style={{ width: 20, height: 20 }} color="primary" />&nbsp;Pokaż trasę</MenuItem>}
            {vehicle.brigade && <MenuItem onClick={() => navigate(`/${city}/brigade/${vehicle.route}/${vehicle.brigade}`)}><Commit style={{ width: 20, height: 20 }} color="primary" />&nbsp;Rozkład brygady</MenuItem>}
            {vehicle.brigade && <MenuItem onClick={() => {
                setAnchorEl(undefined);
                navigate(search, { state: "vehicle" });
            }}><DirectionsBus style={{ width: 20, height: 20 }} color="primary" />&nbsp;Informacje o pojeździe</MenuItem>}
        </Menu>
    </>;
};