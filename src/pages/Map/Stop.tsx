import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, IconButton, Skeleton } from "@mui/material";
import { Close, DirectionsTransit, MoreVert } from "@mui/icons-material";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useMap } from "react-map-gl";
import { City, Stop, StopDepartures, Vehicle } from "../../util/typings";
import { getData } from "../../util/api";
import { Color, Icon } from "../../components/Icons";
import StopMarker from "../../components/StopMarker";
import VehicleMarker from "../../components/VehicleMarker";
import Departures from "../../components/Departures";
import toast from "react-hot-toast";

export default ({ city, stop, vehicles }: { city: City, stop: Stop, vehicles: Vehicle[] }) => {
    const { current: map } = useMap();
    const navigate = useNavigate();
    const [stopDepartures, setStopDepartures] = useState<StopDepartures>();
    const [anchorEl, setAnchorEl] = useState<HTMLElement>();

    useEffect(() => {
        map?.flyTo({
            center: [stop.location[1], stop.location[0]],
            duration: 0
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
        const int = setInterval(() => document.visibilityState === "visible" && fetchDepartures(), 20000);
        return () => clearInterval(int);
    }, [stop]);

    return <>
        <StopMarker stop={stop} city={city} />
        {vehicles.filter(v => stopDepartures?.departures.some(d => d.trip && d.trip === v.trip)).map(v => <VehicleMarker key={v.trip} vehicle={v} city={city} mapBearing={map?.getBearing() || 0} onClick={() => navigate(`?vehicle=${v.type}/${v.id}`)} />)}
        <BottomSheet
            open
            snapPoints={({ maxHeight }) => [maxHeight / 3]}
            onDismiss={() => navigate(".", { replace: true })}
            style={{ zIndex: 500, position: "absolute" }}
            blocking={false}
            skipInitialTransition
            header={<div style={{ display: "inline-flex", cursor: "pointer" }} onClick={() => {
                map?.flyTo({
                    center: [stop.location[1], stop.location[0]],
                    zoom: 17
                });
            }}>
                {stop.type ? stop.type.map(type => <Icon type={type} key={type} style={{ color: Color(type, city) }} />) : <DirectionsTransit sx={{ color: Color(3, city) }} />}&nbsp;{stopDepartures ? `${stopDepartures.name} ${stopDepartures.code || ""}` : <Skeleton variant="text" width={150} />}
            </div>}
        >
            {stopDepartures?.alert && <Alert severity={stopDepartures.alert.type} sx={{ cursor: stopDepartures.alert.link ? "pointer" : "" }} onClick={() => stopDepartures.alert?.link ? window.open(stopDepartures.alert!.link, "_blank") : null}>{stopDepartures.alert.text}</Alert>}
            <Departures departures={stopDepartures} city={city} onClick={(departure) => {
                let location = vehicles.find(v => v.trip === departure.trip)?.location;
                map?.flyTo({
                    center: location ? [location[1], location[0]] : [stop.location[1], stop.location[0]],
                    zoom: 17,
                    duration: 0
                });
            }} />
        </BottomSheet>
    </>;
};