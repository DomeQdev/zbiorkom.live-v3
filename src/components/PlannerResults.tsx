import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { List, ListItemButton, Divider, ListItemText, Stack, Typography } from "@mui/material";
import { AccessTime, DirectionsBike, DirectionsCar, DirectionsWalk, NavigateNext, TransferWithinAStation } from "@mui/icons-material";
import { City, PlannerLeg, PlannerOptions, PlannerResult } from "../util/typings";
import cities from "../util/cities.json";
import toast from "react-hot-toast";
import { Box } from "@mui/system";
import { Icon } from "./Icons";
import { LineNumber } from "./VehicleHeadsign";
import DetectDevice from "./DetectDevice";

const Leg = ({ leg }: { leg: PlannerLeg }) => leg.mode === "transit"
    ? <LineNumber color={leg.textColor!} backgroundColor={leg.color!}><Icon type={leg.type!} style={{ width: 18, height: 18 }} />&nbsp;{leg.line}</LineNumber>
    : (leg.mode === "walk" ? <DirectionsWalk /> : leg.mode === "bicycle" ? <DirectionsBike /> : leg.mode === "car" ? <DirectionsCar /> : <TransferWithinAStation />);

export default ({ city, options }: { city: City, options: PlannerOptions }) => {
    const navigate = useNavigate();
    const [results, setResults] = useState<PlannerResult>();

    useEffect(() => {
        setResults(undefined);
        fetch(cities[city].api.planner!, {
            method: "PATCH",
            body: JSON.stringify({
                from: options.from,
                to: options.to,
                transfers: options.transfers,
                facilities: options.facilities,
                type: options.type
            }),
        }).then(res => res.json()).then(res => {
            if (res.error) {
                toast.error(res.error);
                return navigate("../", { replace: true });
            }
            setResults(res);
        }).catch((e) => {
            console.error(e);
            toast.error("Nie możemy się połączyć z serwerem... Spróbuj ponownie za chwilę.");
            navigate("../", { replace: true });
        });
    }, [options]);

    return <>
        <List>
            {results ? results.routes.map<React.ReactNode>(route => <ListItemButton key={route.id}>
                <ListItemText
                    primary={<Box sx={{ display: "inline-flex", alignItems: "center", fontSize: 14 }}>
                        <DetectDevice
                            diff={route.legs.length * 75}
                            desktop={<>{route.legs.map<React.ReactNode>(leg => <Leg leg={leg} />).reduce((prev, curr, i) => [prev, <NavigateNext key={`transdiv-${i}`} />, curr])}</>}
                            mobile={route.legs.length > 5 ? <>{route.legs.slice(0, window.innerWidth / 80).map<React.ReactNode>(leg => <Leg leg={leg} />).reduce((prev, curr, i) => [prev, <NavigateNext key={`transdiv-${i}`} />, curr])}<NavigateNext /> ...</> : <>{route.legs.map<React.ReactNode>(leg => <Leg leg={leg} />).reduce((prev, curr, i) => [prev, <NavigateNext key={`transdiv-${i}`} />, curr])}</>}
                        />
                    </Box>}
                    secondary={<>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <AccessTime sx={{ width: 17, height: 17 }} />
                            <span>{new Date(route.startTime).toLocaleTimeString("pl", { hour12: false, hour: "2-digit", minute: "2-digit" })} – {new Date(route.endTime).toLocaleTimeString("pl", { hour12: false, hour: "2-digit", minute: "2-digit" })} ({Math.round(route.duration / 60)} min)</span>
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={1}>
                            {options.facilities.includes("bike") ? <DirectionsBike sx={{ width: 15, height: 15 }} /> : <DirectionsWalk sx={{ width: 15, height: 15 }} />}
                            <span>{Math.round(route.walkTime / 60)} min</span>
                        </Stack>
                    </>}
                />
            </ListItemButton>).reduce((prev, curr, i) => [prev, <Divider key={`div-${i}`} />, curr]) : "Ładowanie..."}
        </List>
    </>;
};