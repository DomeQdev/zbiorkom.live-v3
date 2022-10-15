import { Box, Button, Divider, List, ListItem, ListItemButton, ListItemText, Skeleton, Typography } from "@mui/material";
import { Map, PanTool } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { City, Trip } from "../util/typings";
import { getData } from "../util/api";
import VehicleHeadsign from "../components/VehicleHeadsign";
import toast from "react-hot-toast";

export default ({ city }: { city: City }) => {
    const [tripData, setTripData] = useState<Trip>();
    const [searchParams] = useSearchParams();
    const trip = searchParams.get("trip");

    useEffect(() => {
        if (!trip) return;
        getData("trip", city, {
            trip
        }).then(trip => {
            if (trip.error) toast.error(trip.error);
            else setTripData(trip);
        }).catch(() => toast.error("Nie udało się załadować danych."));
    }, [trip]);

    return <Box sx={{ width: "90%", mx: "auto", textAlign: "center" }}>
        {tripData ? <>
            <h2><VehicleHeadsign type={tripData.type || 11} route={tripData.route || "🚎"} headsign={tripData.headsign} city={city} iconSize={25} /></h2>
            <Button variant="contained" endIcon={<Map />} sx={{ marginLeft: 1 }} disabled>Pokaż na mapie</Button>
            <List>
                {tripData.stops.map<React.ReactNode>((stop, i) => <ListItemButton key={i} component={Link} to={`../stop/${stop.id}`}>
                    <ListItemText
                        primary={<Typography noWrap>{stop.on_request && <PanTool sx={{ width: 15, height: 15 }} />} {stop.name}</Typography>}
                        secondary={stop.platform && <>Peron <b>{stop.platform}</b></>}
                    />
                    {new Date(stop.departure).toLocaleTimeString("pl", { hour12: false, hour: "2-digit", minute: "2-digit" })}
                </ListItemButton>).reduce((prev, curr, i) => [prev, <Divider key={`divi-${i}`} />, curr])}
            </List>
        </> : <>
            <Box sx={{ display: "inline-flex", alignItems: "center", my: 2.6 }}>
                <Skeleton variant="rectangular" width={84} height={38} style={{ borderRadius: 15 }} />&nbsp;<Skeleton variant="text" width={80} height={29} />
            </Box>
            <br />
            <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                <Skeleton variant="rounded" width={175} height={36} />
            </Box>
            <List>
                {[...Array(10)].map((_, i) => <ListItem key={i}>
                    <ListItemText primary={<Skeleton variant="text" width={135} />} />
                    <Skeleton variant="text" width={40} />
                </ListItem>)}
            </List>
        </>}
    </Box>;
};