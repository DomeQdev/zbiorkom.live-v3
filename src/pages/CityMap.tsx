import { useEffect, useState, lazy } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMap } from "react-map-gl";
import { io } from "socket.io-client";
import { Button } from "@mui/material";
import { FilterList, PortableWifiOff, Star } from "@mui/icons-material";
import { Backdrop, Suspense } from '../components/Suspense';
import { City, Stop, Vehicle } from "../util/typings";
import cities from "../cities.json";

const StopMarker = lazy(() => import("../components/StopMarker"));
const VehicleMarker = lazy(() => import("../components/VehicleMarker"));
const VehicleComp = lazy(() => import("./Vehicle"));

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
            timeout: 15000
        }).on("positions", setVehicles);

        socket.io.on("reconnect", () => toast.success("Wznowiono połączenie z serwerem."));
        socket.io.on("reconnect_attempt", (n) => toast.error(`Ponawiam próbę połączenia... (${n}/5)`));
        socket.io.on("reconnect_failed", () => toast(() => <div style={{ textAlign: "center" }}>
            <PortableWifiOff style={{ width: 50, height: 50 }} />
            <br />
            <b>Nie udało się wznowić połączenia z serwerem.</b>
            <br />
            <Button variant="outlined" onClick={() => window.location.reload()}>Spróbuj ponownie</Button>
        </div>, { duration: Infinity }));
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
            toast.error(vehicle ? "Stracono połączenie z pojazdem." : "Nie znaleziono pojazdu.");
        }
    }, [veh, vehicles]);

    return <>
        {!vehicles.length && <Backdrop />}
        <Suspense>
            {(zoom >= 16 && !vehicle) && stops.filter(stop => bounds?.contains({ lat: stop.location[0], lon: stop.location[1] })).map(stop => <StopMarker key={stop.id} stop={stop} onClick={() => toast.success(`${stop.type} ${stop.name} ${stop.code} ${stop.id}`)} />)}
            {(zoom >= 15 && !vehicle) && vehicles.filter(veh => bounds?.contains({ lat: veh._location[1], lon: veh._location[0] })).map(veh => <VehicleMarker key={veh.type + veh.tab} vehicle={veh} mapBearing={bearing || 0} onClick={() => navigate(`?vehicle=${veh.type}/${veh.tab}`)} />)}
            {vehicle && <VehicleComp city={city} vehicle={vehicle} mapBearing={bearing || 0} />}
        </Suspense>
        <div className="mapboxgl-ctrl-top-right" style={{ top: 135 }}>
            <div className="mapboxgl-ctrl mapboxgl-ctrl-group">
                <button><FilterList sx={{ fontSize: 19, marginTop: "3px" }} /></button>
                <button><Star sx={{ fontSize: 19, marginTop: "3px" }} /></button>
            </div>
        </div>
    </>;
};