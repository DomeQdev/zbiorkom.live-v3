import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";
import { toast } from "react-toastify";
import { useMap } from "react-map-gl";
import { RealTime, RealTimeResponse } from "../util/realtime";
import { Trip, City, Vehicle } from "../util/typings";
import VehicleMarker from "../components/VehicleMarker";
import Shapes from "../components/Shapes";
import cities from "../cities.json";

export default ({ city, vehicle, mapBearing }: { city: City, vehicle: Vehicle, mapBearing: number }) => {
    const navigate = useNavigate();
    const { current: map } = useMap();
    const [follow, setFollow] = useState<boolean>(true);
    const [trip, setTrip] = useState<Trip>();
    const [realTime, setRealTime] = useState<RealTimeResponse>();
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

    return <>
        <VehicleMarker vehicle={vehicle} mapBearing={mapBearing} />
        {(trip && !trip.error) && <Shapes trip={trip} delay={realTime?.delay} />}
        <BottomSheet
            open
            onDismiss={() => navigate(".")}
            blocking={false}
        >
            Linia {vehicle.line} kierunek {trip?.headsign} o nr taborowym {vehicle.tab}, Follow: {follow ? "Tak" : "Nie"} {trip?.error}
        </BottomSheet>
    </>;
};