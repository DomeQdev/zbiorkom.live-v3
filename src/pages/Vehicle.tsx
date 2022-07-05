import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trip, City, Vehicle } from "../typings";
import VehicleMarker from "../components/VehicleMarker";
import Shapes from "../components/Shapes";
import cities from "../cities.json";
import { toast } from "react-toastify";

export default ({ city, vehicle, mapBearing }: { city: City, vehicle: Vehicle, mapBearing: number }) => {
    const cityData = cities[city];
    const [trip, setTrip] = useState<Trip>();

    useEffect(() => {
        if(!vehicle.trip) return;
        fetch(cityData.api.trip.replace("{{trip}}", encodeURIComponent(vehicle.trip))).then(res => res.json()).then(setTrip).catch((e) => {
            toast.error(`Fatalny błąd.`);
            console.error(e);
        });
    }, [vehicle.trip]);

    return <>
        <VehicleMarker vehicle={vehicle} mapBearing={mapBearing} />

    </>;
};