import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMap } from "react-map-gl";
import { io } from "socket.io-client";
import { Suspense } from '../components/Suspense';
import { City, Stop, Vehicle } from "../typings";
import cities from "../cities.json";

const StopMarker = lazy(() => import("../components/StopMarker"));
const VehicleMarker = lazy(() => import("../components/VehicleMarker"));

export default ({ city }: { city: City }) => {
    const { current: map } = useMap();
    const navigate = useNavigate();
    const cityData = cities[city];
    const [bounds, setBounds] = useState(map?.getBounds());
    const [stops, setStops] = useState<Stop[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        window.socket = io(cityData.api.ws).on("positions", setVehicles)
        if(cityData.api.stops) fetch(cityData.api.stops).then(res => res.json()).then(setStops).catch(() => toast.error("Nie udało się pobrać przystanków."));
    }, []);

    map?.on("moveend", () => setBounds(map.getBounds()));

    return <>
        <Suspense>
            {(map?.getZoom() || 0) >= 16 && stops.filter(stop => bounds?.contains({ lat: stop.location[0], lon: stop.location[1] })).map(stop => <StopMarker key={stop.id} stop={stop} onClick={() => toast.info(`${stop.type} ${stop.name} ${stop.code} ${stop.id}`)} />)}
            {(map?.getZoom() || 0) >= 15 && vehicles.filter(vehicle => bounds?.contains({ lat: vehicle.location[0], lon: vehicle.location[1] })).map(vehicle => <VehicleMarker key={vehicle.type + vehicle.tab} vehicle={vehicle} onClick={() => toast.info(JSON.stringify(vehicle))} />)}
        </Suspense>
    </>;
};