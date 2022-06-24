import { useEffect, useState } from "react";
import { useMap } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import { lazy } from 'react';
import { Suspense } from '../components/Suspense';
import { toast } from "react-toastify";
import { Stop } from "../typings";
import cities from "../cities.json";

const StopMarker = lazy(() => import("../components/StopMarker"));

export default ({ city }: { city: keyof typeof cities }) => {
    const { current: map } = useMap();
    const navigate = useNavigate();
    const cityData = cities[city];
    const [bounds, setBounds] = useState(map?.getBounds());
    const [stops, setStops] = useState<Stop[]>([]);

    useEffect(() => {
        if(cityData.api.stops) fetch(cityData.api.stops).then(res => res.json()).then(setStops).catch(() => toast.error("Nie udało się pobrać przystanków."));
    }, []);

    map?.on("moveend", () => setBounds(map.getBounds()));

    return <>
        <Suspense>
            {(map?.getZoom() || 0) > 16 && stops.filter(stop => bounds?.contains({ lat: stop.location[0], lon: stop.location[1] })).map(stop => <StopMarker key={stop.id} stop={stop} onClick={() => toast.info(`${stop.type} ${stop.name} ${stop.code} ${stop.id}`)} />)}
        </Suspense>
    </>;
};