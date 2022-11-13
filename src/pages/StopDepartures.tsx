import { Alert, Box, Chip, Fab, Menu, MenuItem, Skeleton, Typography } from "@mui/material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Map, MoreVert, Star } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { City, StopDepartures } from "../util/typings";
import { getData } from "../util/api";
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
        <Chip
            label={stopDepartures ? <Typography noWrap>{stopDepartures.name} {stopDepartures.code}</Typography> : <Skeleton variant="text" width={150} />}
            color="primary"
            sx={{ position: "fixed", top: 20, left: "50%", transform: "translate(-50%, 0)" }}
        />

        <Fab
            size="small"
            color="primary"
            sx={{ position: "fixed", zIndex: 30000, top: 16, right: 16 }}
            onClick={({ currentTarget }: { currentTarget: HTMLElement }) => setAnchorEl(anchorEl ? undefined : currentTarget)}
        >
            <MoreVert />
        </Fab>
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
            <MenuItem component={Link} to={`..?stop=${stopId}`}><Map style={{ width: 20, height: 20 }} color="primary" />&nbsp;Pokaż na mapie</MenuItem>
        </Menu>

        <Box sx={{ marginTop: 7 }}>
            {stopDepartures?.alert && <Alert severity={stopDepartures.alert.type} sx={{ cursor: stopDepartures.alert.link ? "pointer" : "" }} onClick={() => stopDepartures.alert?.link ? window.open(stopDepartures.alert!.link, "_blank") : null}>{stopDepartures.alert.text}</Alert>}
            <Departures departures={stopDepartures} city={city} onClick={(departure) => navigate(`../trip?trip=${departure.trip}&back=true`)} ads />
        </Box>
    </>;
};