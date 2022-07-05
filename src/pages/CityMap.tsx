import { useEffect, useState, lazy } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMap } from "react-map-gl";
import { io } from "socket.io-client";
import { Backdrop, Suspense } from '../components/Suspense';
import { City, Stop, Vehicle } from "../typings";
import cities from "../cities.json";

const StopMarker = lazy(() => import("../components/StopMarker"));
const VehicleMarker = lazy(() => import("../components/VehicleMarker"));
const Vehicle_ = lazy(() => import("./Vehicle"));

export default ({ city }: { city: City }) => {
    const [searchParams] = useSearchParams();
    const { current: map } = useMap();
    const navigate = useNavigate();
    const cityData = cities[city];

    const [bounds, setBounds] = useState(map?.getBounds());
    const [zoom, setZoom] = useState(map?.getZoom() || 0);
    const [bearing, setBearing] = useState(map?.getBearing())

    const [stops, setStops] = useState<Stop[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehicle, setVehicle] = useState<Vehicle>();

    useEffect(() => {
        const socket = io(cityData.api.ws, {
            reconnection: true,
            reconnectionAttempts: 5,
            timeout: 20000
        }).on("positions", setVehicles);

        socket.io.on("reconnect", () => toast.success("Wznowiono połączenie z serwerem."));
        socket.io.on("reconnect_attempt", (n) => toast.warn(`Ponawiam próbę połączenia... (${n}/5)`));
        socket.io.on("reconnect_failed", () => toast.error("Nie udało się wznowić połączenia z serwerem. Odśwież stronę aby spróbować ponownie.", { autoClose: false }));
        socket.io.on("error", console.error);

        if (cityData.api.stops) fetch(cityData.api.stops).then(res => res.json()).then(setStops).catch(() => toast.error("Nie udało się pobrać przystanków."));

        map?.on("moveend", () => setBounds(map.getBounds()));
        map?.on("zoomend", () => setZoom(map.getZoom()));
        map?.on("rotate", () => setBearing(map.getBearing()));

        return () => {
            socket.disconnect();
        };
    }, []);

    const veh = searchParams.get("vehicle");
    useEffect(() => {
        if (!veh || !vehicles.length) return setVehicle(undefined);
        let [type, tab] = veh.split("/");
        let v = vehicles.find(x => x.type === type && x.tab === tab.replace(/\s/g, "+"));

        if (v) setVehicle(v);
        else {
            navigate(".");
            if (vehicle) toast.warn("Stracono połączenie z pojazdem.");
            else toast.error("Nie znaleziono pojazdu.");
        }
    }, [veh, vehicles]);

    return <>
        {!vehicles.length && <Backdrop />}
        <Suspense>
            {(zoom >= 16 && !vehicle) && stops.filter(stop => bounds?.contains({ lat: stop.location[0], lon: stop.location[1] })).map(stop => <StopMarker key={stop.id} stop={stop} onClick={() => toast.info(`${stop.type} ${stop.name} ${stop.code} ${stop.id}`)} />)}
            {(zoom >= 15 && !vehicle) && vehicles.filter(veh => bounds?.contains({ lat: veh._location[1], lon: veh._location[0] })).map(veh => <VehicleMarker key={veh.type + veh.tab} vehicle={veh} mapBearing={bearing || 0} onClick={() => navigate(`?vehicle=${veh.type}/${veh.tab}`)} />)}
            {vehicle && <Vehicle_ city={city} vehicle={vehicle} mapBearing={bearing || 0} />}
        </Suspense>
    </>;
};