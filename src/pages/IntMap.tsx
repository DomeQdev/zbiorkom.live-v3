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
const Shapes = lazy(() => import("../components/Shapes"));

export default ({ city }: { city: City }) => {
    const { current: map } = useMap();
    const navigate = useNavigate();
    const cityData = cities[city];

    const [bounds, setBounds] = useState(map?.getBounds());
    const [zoom, setZoom] = useState(map?.getZoom() || 0);
    const [bearing, setBearing] = useState(map?.getBearing())

    const [stops, setStops] = useState<Stop[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        const socket = io(cityData.api.ws, {
            reconnection: true,
            reconnectionAttempts: 5,
            timeout: 20000
        }).on("positions", setVehicles);

        socket.io.on("reconnect", () => toast.success("Wznowiono połączenie z serwerem."));
        socket.io.on("reconnect_attempt", (n) => toast.warn(`Ponawiam próbę połączenia... (${n}/5)`));
        socket.io.on("reconnect_failed", () => toast.error("Nie udało się wznowić połączenia z serwerem. Odśwież stronę aby spróbować ponownie.", { autoClose: false }))
        socket.io.on("error", console.error);

        if (cityData.api.stops) fetch(cityData.api.stops).then(res => res.json()).then(setStops).catch(() => toast.error("Nie udało się pobrać przystanków."));

        map?.on("moveend", () => setBounds(map.getBounds()));
        map?.on("zoomend", () => setZoom(map.getZoom()));
        map?.on("rotate", () => setBearing(map.getBearing()));

        return () => {
            socket.disconnect();
        };
    }, []);

    return <>
        <Suspense>
            {zoom >= 16 && stops.filter(stop => bounds?.contains({ lat: stop.location[0], lon: stop.location[1] })).map(stop => <StopMarker key={stop.id} stop={stop} onClick={() => toast.info(`${stop.type} ${stop.name} ${stop.code} ${stop.id}`)} />)}
            {zoom >= 15 && vehicles.filter(vehicle => bounds?.contains({ lat: vehicle.location[0], lon: vehicle.location[1] })).map(vehicle => <VehicleMarker key={vehicle.type + vehicle.tab} vehicle={vehicle} onClick={() => toast.info(JSON.stringify(vehicle))} />)}
        </Suspense>
    </>;
};