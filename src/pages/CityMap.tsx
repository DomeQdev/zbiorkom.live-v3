import { useEffect, useState, lazy } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMap } from "react-map-gl";
import { io } from "socket.io-client";
import { Button } from "@mui/material";
import { FilterList, PortableWifiOff, Star } from "@mui/icons-material";
import { Backdrop, Suspense } from '../components/Suspense';
import { City, Stop, Vehicle } from "../util/typings";
import { getData } from "../util/api";
import cities from "../util/cities.json";

const StopMarker = lazy(() => import("../components/StopMarker"));
const StopComp = lazy(() => import("./Stop"));
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
    const [stop, setStop] = useState<Stop>();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehicle, setVehicle] = useState<Vehicle>();

    useEffect(() => {
        const socket = io("https://api.zbiorkom.live/", {
            reconnection: true,
            reconnectionAttempts: 5,
            timeout: 15000,
            query: {
                city: city
            }
        }).on("positions", setVehicles);

        let toastId: any;
        socket.io.on("reconnect", () => {
            toast.success("Wznowiono połączenie z serwerem.", {
                id: toastId
            });
            toastId = undefined;
        });
        socket.io.on("reconnect_attempt", (n) => {
            toastId = toast.loading(`Ponawiam próbę połączenia... (${n}/5)`, {
                id: toastId
            });
        });
        socket.io.on("reconnect_failed", () => toast(() => <div style={{ textAlign: "center" }}>
            <PortableWifiOff style={{ width: 50, height: 50 }} /><br />
            <b>Nie udało się wznowić połączenia z serwerem.</b><br />
            <Button variant="outlined" onClick={() => window.location.reload()}>Spróbuj ponownie</Button>
        </div>, { duration: Infinity, id: toastId }));
        socket.io.on("error", console.error);

        if (cityData.api.stops) getData("stops", city).then(setStops).catch(() => toast.error("Nie udało się pobrać przystanków."));

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
            navigate(".", { replace: true });
            toast.error(vehicle ? "Stracono połączenie z pojazdem." : "Nie znaleziono pojazdu.");
        }
    }, [veh, vehicles]);

    const st = searchParams.get("stop");
    useEffect(() => {
        if (!st || !stops.length) return setStop(undefined);
        let s = stops.find(x => x.id === st);

        if (s) setStop(s);
        else {
            navigate(".", { replace: true });
            toast.error("Nie znaleziono przystanku.");
        }
    }, [st, stops]);

    return <>
        {!vehicles.length && <Backdrop />}
        <Suspense>
            {(zoom >= 15 && !vehicle && !stop) && stops.filter(stop => bounds?.contains({ lat: stop.location[0], lon: stop.location[1] })).map(stop => <StopMarker key={stop.id} stop={stop} city={city} onClick={() => navigate(`?stop=${stop.id}`)} />)}
            {(zoom >= 14 && !vehicle && !stop) && vehicles.filter(veh => bounds?.contains({ lat: veh._location[1], lon: veh._location[0] })).map(veh => <VehicleMarker key={veh.type + veh.tab} vehicle={veh} city={city} mapBearing={bearing || 0} onClick={() => navigate(`?vehicle=${veh.type}/${veh.tab}`)} />)}
            {vehicle && <VehicleComp city={city} vehicle={vehicle} mapBearing={bearing || 0} />}
            {stop && <StopComp city={city} stop={stop} vehicles={vehicles} />}
        </Suspense>
        <div className="mapboxgl-ctrl-top-right" style={{ top: 135 }}>
            <div className="mapboxgl-ctrl mapboxgl-ctrl-group">
                <button><FilterList sx={{ fontSize: 19, marginTop: "3px" }} /></button>
                <button><Star sx={{ fontSize: 19, marginTop: "3px" }} /></button>
            </div>
        </div>
    </>;
};