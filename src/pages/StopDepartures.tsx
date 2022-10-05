import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Alert, AppBar, IconButton, Menu, MenuItem, Skeleton, Toolbar, Typography } from "@mui/material";
import { ArrowBack, Map, MoreVert, Star } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { getData } from "../util/api";
import { City, StopDepartures } from "../util/typings";
import Departures from "../components/Departures";

export default ({ city }: { city: City }) => {
    const navigate = useNavigate();
    const { stopId } = useParams();
    const [stopDepartures, setStopDepartures] = useState<StopDepartures>();
    const [anchorEl, setAnchorEl] = useState<HTMLElement>();

    useEffect(() => {
        const fetchDepartures = () => getData("stop", city, {
            stop: stopId
        }).then((res) => {
            if (res.error) {
                toast.error(res.error);
                return navigate("../stops", { replace: true });
            }
            setStopDepartures(res);
        }).catch((e) => {
            console.error(e);
            toast.error("Wystąpił fatalny błąd podczas pobierania danych.");
            navigate("../stops", { replace: true });
        });

        fetchDepartures();
        const int = setInterval(() => document.visibilityState === "visible" && fetchDepartures(), 20000);
        return () => clearInterval(int);
    }, [stopId]);

    return <>
        <AppBar position="sticky">
            <Toolbar>
                <IconButton edge="start" component={Link} to="../stops" replace><ArrowBack /></IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>{stopDepartures ? `${stopDepartures.name} ${stopDepartures.code || ""}` : <Skeleton variant="text" width={150} />}</Typography>
                <IconButton edge="end" onClick={({ currentTarget }: { currentTarget: HTMLElement }) => setAnchorEl(anchorEl ? undefined : currentTarget)}><MoreVert /></IconButton>
            </Toolbar>
        </AppBar>
        <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(undefined)}
            style={{ zIndex: 300000 }}
            PaperProps={{
                style: {
                    maxHeight: 40 * 4.5,
                    minWidth: 30 * 4.5,
                }
            }}
        >
            <MenuItem><Star style={{ width: 20, height: 20 }} color="primary" />&nbsp;Dodaj do ulubionych</MenuItem>
            <MenuItem component={Link} to={`../map?stop=${stopId}`}><Map style={{ width: 20, height: 20 }} color="primary" />&nbsp;Pokaż na mapie</MenuItem>
        </Menu>

        {stopDepartures?.alert && <Alert severity={stopDepartures.alert.type} sx={{ cursor: stopDepartures.alert.link ? "pointer" : "" }} onClick={() => stopDepartures.alert?.link ? window.open(stopDepartures.alert!.link, "_blank") : null}>{stopDepartures.alert.text}</Alert>}
        <Departures departures={stopDepartures} city={city} />
    </>;
};