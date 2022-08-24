import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import { toast } from "react-hot-toast";
import { useMap } from "react-map-gl";
import { Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Skeleton } from "@mui/material";
import { Check, Close, Commit, DirectionsBus, GpsFixed, History, LocationDisabled, Logout, MoreVert, Route, Star, WifiOff } from "@mui/icons-material";
import { bbox, lineString } from "@turf/turf";
import { RealTime, RealTimeResponse } from "../util/realtime";
import { Trip, City, Vehicle } from "../util/typings";
import { getData } from "../util/api";
import { Color } from "../components/Icons";
import Shapes from "../components/Shapes";
import VehicleMarker from "../components/VehicleMarker";
import VehicleHeadsign from "../components/VehicleHeadsign";
import VehicleStopList from "../components/VehicleStopList";
import Timer from "../components/Timer";
import styled from "@emotion/styled";
import isDark from "../util/isDark";

export default ({ city, vehicle, mapBearing }: { city: City, vehicle: Vehicle, mapBearing: number }) => {
    const navigate = useNavigate();
    const { current: map } = useMap();
    const [follow, setFollow] = useState<boolean>(true);
    const [trip, setTrip] = useState<Trip>();
    const [realTime, setRealTime] = useState<RealTimeResponse>();
    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const sheetRef = useRef<BottomSheetRef>(null);
    const darkMode = isDark();

    useEffect(() => {
        map?.on("movestart", (e) => e.originalEvent && e.originalEvent.type !== "resize" ? setFollow(false) : undefined);
    }, []);

    useEffect(() => {
        if (!follow) return;
        map?.flyTo({
            center: vehicle._location
        });
    }, [vehicle._location, follow]);

    useEffect(() => {
        if (!vehicle.trip) return;

        getData("trip", city, {
            trip: encodeURIComponent(vehicle.trip)
        }).then(setTrip).catch(() => toast.error("Nie mogliśmy pobrać trasy..."));
    }, [vehicle.trip]);

    useEffect(() => {
        if (!trip || trip.error) return;
        setRealTime(RealTime({
            trip,
            location: vehicle._location,
            delay: vehicle.delay
        }));
    }, [vehicle, trip]);

    const InlineB = styled.b({
        display: "inline-flex",
        alignItems: "center"
    });

    return <>
        <VehicleMarker vehicle={vehicle} city={city} mapBearing={mapBearing} />
        {(trip && !trip.error) && <Shapes trip={trip} realTime={realTime} />}
        <BottomSheet
            open
            ref={sheetRef}
            defaultSnap={({ maxHeight }) => maxHeight / 3.5}
            snapPoints={({ maxHeight, headerHeight }) => [
                headerHeight,
                maxHeight / 3.5,
                maxHeight * 0.5
            ]}
            onDismiss={() => navigate(".", { replace: true })}
            style={{ zIndex: 100, position: "absolute" }}
            blocking={false}
            expandOnContentDrag
            header={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <IconButton onClick={() => navigate(".", { replace: true })} style={{ height: 40 }}><Close /></IconButton>

                <div style={{ cursor: "pointer" }} onClick={() => {
                    setFollow(true);
                    sheetRef.current?.snapTo(({ maxHeight }) => maxHeight / 3.5);
                }}>
                    <VehicleHeadsign type={vehicle.type} line={vehicle.line} headsign={vehicle.headsign || trip?.headsign || "Przejazd techniczny"} color={vehicle.trip && !trip?.error ? trip?.color : Color(vehicle.type, city)} textColor={vehicle.trip && !trip?.error ? trip?.text : "white"} />

                    {vehicle.trip && !trip?.error ? (realTime && trip) ? <span style={{ lineHeight: 1.4, fontSize: 15 }}><br />
                        {trip.stops[0].departure > Date.now()
                            ? <InlineB><Logout style={{ width: 18, height: 18 }} />&nbsp;Odjazd za {Math.floor((trip.stops[0].departure - Date.now()) / 60000)} min</InlineB>
                            : vehicle.isPredicted && vehicle.delay === undefined
                                ? <InlineB><WifiOff style={{ width: 18, height: 18 }} />&nbsp;Brak informacji o opóźnieniu</InlineB>
                                : Math.floor(realTime.delay / 60000) ? <InlineB style={{ color: realTime.delay > 0 ? darkMode ? "#F26663" : "red" : darkMode ? "#90EE90" : "green" }}><History style={{ width: 18, height: 18 }} />&nbsp;{Math.abs(Math.floor(realTime.delay / 60000))} min {realTime.delay > 0 ? "opóźnienia" : "przed czasem"}</InlineB> : <InlineB><Check style={{ width: 18, height: 18 }} />&nbsp;Planowo</InlineB>}
                    </span> : <Skeleton variant="text" style={{ width: 139, height: 21 }} /> : null}
                </div>

                {trip || !vehicle.trip ? <IconButton onClick={({ currentTarget }: { currentTarget: HTMLElement }) => setAnchorEl(anchorEl ? undefined : currentTarget)} style={{ height: 40 }}><MoreVert /></IconButton> : <Skeleton variant="circular" width={40} height={40} />}
            </div>}
        >
            {vehicle.trip && !trip?.error
                ? (realTime && trip)
                    ? <VehicleStopList trip={trip} realtime={realTime} type={vehicle.type} follow={follow} stopFollowing={() => setFollow(false)} />
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
        <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(undefined)}
            style={{ zIndex: 300000 }}
            PaperProps={{
                style: {
                    maxHeight: 40 * 4.5,
                    minWidth: 30 * 4.5,
                }
            }}
        >
            <MenuItem sx={{ borderBottom: 1, borderColor: "divider", pointerEvents: "none" }}>{vehicle.isPredicted ? <LocationDisabled style={{ width: 20, height: 20 }} color="primary" /> : <GpsFixed style={{ width: 20, height: 20 }} color="primary" />}&nbsp;<b><Timer timestamp={vehicle.lastPing} /></b>&nbsp;temu</MenuItem>
            <MenuItem><Star style={{ width: 20, height: 20 }} color="primary" />&nbsp;Dodaj linię do ulubionych</MenuItem>
            {trip?.shapes && <MenuItem onClick={() => {
                setAnchorEl(undefined);
                setFollow(false);
                sheetRef.current?.snapTo(({ headerHeight }) => headerHeight);
                const [minLng, minLat, maxLng, maxLat] = bbox(lineString(trip.shapes.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]])));
                map?.fitBounds([[minLat, minLng], [maxLat, maxLng]], { padding: 125, duration: 1000 });
            }}><Route style={{ width: 20, height: 20 }} color="primary" />&nbsp;Pokaż trasę</MenuItem>}
            {vehicle.brigade && <MenuItem onClick={() => navigate(`/${city}/brigade/${vehicle.line}/${vehicle.brigade}`)}><Commit style={{ width: 20, height: 20 }} color="primary" />&nbsp;Rozkład brygady</MenuItem>}
            {vehicle.brigade && <MenuItem><DirectionsBus style={{ width: 20, height: 20 }} color="primary" />&nbsp;Informacje o pojeździe</MenuItem>}
        </Menu>
    </>;
};