import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";
import { toast } from "react-hot-toast";
import { useMap } from "react-map-gl";
import { IconButton, Menu, MenuItem, Skeleton } from "@mui/material";
import { Check, Close, History, Logout, MoreVert } from "@mui/icons-material";
import { RealTime, RealTimeResponse } from "../util/realtime";
import { Trip, City, Vehicle } from "../util/typings";
import styled from "@emotion/styled";
import cities from "../cities.json";
import Shapes from "../components/Shapes";
import VehicleMarker from "../components/VehicleMarker";
import VehicleHeadsign from "../components/VehicleHeadsign";

export default ({ city, vehicle, mapBearing }: { city: City, vehicle: Vehicle, mapBearing: number }) => {
    const navigate = useNavigate();
    const { current: map } = useMap();
    const [follow, setFollow] = useState<boolean>(true);
    const [trip, setTrip] = useState<Trip>();
    const [realTime, setRealTime] = useState<RealTimeResponse>();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
    const cityData = cities[city];

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
        fetch(cityData.api.trip.replace("{{trip}}", encodeURIComponent(vehicle.trip))).then(res => res.json()).then(setTrip).catch((e) => {
            toast.error(`Fatalny błąd.`);
            console.error(e);
        });
    }, [vehicle.trip]);

    useEffect(() => {
        if (!trip || trip.error) return;
        setRealTime(RealTime({
            trip,
            location: vehicle._location,
            delay: vehicle.delay
        }));
    }, [vehicle, trip]);

    const InlineB = styled.b`
    display: inline-flex;
    align-items: center;
    `;

    return <>
        <VehicleMarker vehicle={vehicle} mapBearing={mapBearing} />
        {(trip && !trip.error) && <Shapes trip={trip} realTime={realTime} />}
        <BottomSheet
            open
            onDismiss={() => navigate(".")}
            blocking={false}
            header={<div style={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton onClick={() => navigate(".")} style={{ height: 40 }}><Close /></IconButton>
                <div style={{ cursor: "pointer" }} onClick={() => setFollow(true)}>
                    <VehicleHeadsign type={vehicle.type} line={vehicle.line} headsign={vehicle.headsign || trip?.headsign} color={trip?.color} textColor={trip?.text} />
                    {(realTime && trip) ? <span style={{ lineHeight: 1.4, fontSize: 15 }}><br />
                        {trip.stops[0].departure > Date.now() ? <InlineB><Logout style={{ width: 18, height: 18 }} />&nbsp;Odjazd za {Math.floor((trip.stops[0].departure - Date.now()) / 60000)} min</InlineB> : Math.floor(realTime.delay / 60000) ? <InlineB style={{ color: realTime.delay > 0 ? "red" : "green" }}><History style={{ width: 18, height: 18 }} />&nbsp;{Math.abs(Math.floor(realTime.delay / 60000))} min {realTime.delay > 0 ? "opóźnienia" : "przed czasem"}</InlineB> : <InlineB><Check style={{ width: 18, height: 18 }} />&nbsp;Planowo</InlineB>}
                    </span> : <Skeleton variant="text" style={{ width: 139, height: 21 }} />}
                </div>
                {trip ? <IconButton onClick={({ currentTarget }: { currentTarget: HTMLElement }) => setAnchorEl(anchorEl ? null : currentTarget)}  style={{ height: 40 }}><MoreVert /></IconButton> : <Skeleton variant="circular" width={40} height={40} />}
            </div>}
        >
            Linia {vehicle.line} kierunek {trip?.headsign} o nr taborowym {vehicle.tab}, Follow: {follow ? "Tak" : "Nie"} {trip?.error}
        </BottomSheet>
        <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(null)}
            style={{ zIndex: 300000 }}
            PaperProps={{
                style: {
                    maxHeight: 40 * 4.5,
                    minWidth: 30 * 4.5,
                }
            }}
        >

        </Menu>
    </>;
};