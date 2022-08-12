import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { City, PlannerOptions, PlannerResult } from "../util/typings";
import cities from "../cities.json";
import toast from "react-hot-toast";

export default ({ city }: { city: City }) => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { from, fromName, to, toName, transfers, facilities, type } = (state as PlannerOptions) || {};
    const [results, setResults] = useState<PlannerResult>();

    useEffect(() => {
        if (!from || !fromName || !to || !toName || (!transfers && transfers !== 0) || !facilities || !type) return navigate("../", { replace: true });
        setResults(undefined);
        fetch(cities[city].api.planner! + "&ezz", {
            method: "PATCH",
            body: JSON.stringify({
                from,
                to,
                transfers,
                facilities,
                type
            }),
        }).then(res => res.json()).then(res => {
            if (res.error) {
                toast.error(res.error);
                return navigate("./", { replace: true });
            }
            setResults(res);
        }).catch((e) => {
            console.error(e);
            toast.error("Nie możemy się połączyć z serwerem... Spróbuj ponownie za chwilę.");
            navigate("./", { replace: true });
        });
    }, [state]);

    return <>{results?.routes.map(x => <>
        No to tak, zaczynasz o {new Date(x.startTime).toLocaleString()}, kończysz o {new Date(x.endTime).toLocaleString()}, będziesz dochodził {x.walkTime / 60} minut do autobusów
        <br />
        Przesiadki: {x.legs.map(y => <p>{y.mode} {y.line || "-"} przez {y.duration / 60} min</p>)}<br />
    </>)}</>;
};