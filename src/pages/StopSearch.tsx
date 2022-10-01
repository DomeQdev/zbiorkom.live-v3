import { AppBar, IconButton, InputAdornment, List, ListItemButton, ListItemText, ListSubheader, Skeleton, TextField, Toolbar, Typography, Slide, Collapse, Dialog, ListItem, ListItemAvatar, Avatar } from "@mui/material";
import { ArrowBack, ArrowUpward, HighlightOff } from "@mui/icons-material";
import { TransitionGroup } from "react-transition-group";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { City, StopGroup, StopInGroup } from "../util/typings";
import { Color, Icon } from "../components/Icons";
import { getData } from "../util/api";
import toast from "react-hot-toast";

export default ({ city }: { city: City }) => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [input, setInput] = useState("");
    const [stopGroups, setStopGroups] = useState<StopGroup[]>();
    const [nearestGroups, setNearestGroups] = useState<StopGroup[]>();
    const [userLocation, setUserLocation] = useState<GeolocationPosition>();
    const [groupStops, setGroupStops] = useState<StopInGroup[]>();
    const [search, setSearch] = useState<StopGroup[]>();

    useEffect(() => {
        getData("stopGroups", city).then(setStopGroups).catch(() => {
            navigate("../", { replace: true });
            toast.error(`Nie mogliśmy załadować przystanków.`);
        });

        let id = navigator.geolocation.watchPosition(setUserLocation, console.error, { timeout: 10000 });
        return () => navigator.geolocation.clearWatch(id);
    }, []);

    useEffect(() => {
        if (!state || !stopGroups?.length) return navigate("", { state: undefined, replace: true });
        getData("stopGroup", city, { name: state }).then(data => {
            if (!data.length) {
                navigate(".", { state: undefined, replace: true });
                return toast.error(`Nie mogliśmy załadować przystanków w tej grupie.`);
            };
            if (data.length === 1) return navigate(`../stop/${data[0].id}`);
            setGroupStops(data);
        }).catch(() => {
            navigate("", { state: undefined, replace: true });
            toast.error(`Błąd.`);
        });
    }, [state]);

    useEffect(() => {
        if (!userLocation || !stopGroups?.length) return;
        let filtered = stopGroups.filter(group => !input || group.name.toLowerCase().replace(/[^\w]/gi, "").includes(input.toLowerCase().replace(/[^\w]/gi, "")));
        setNearestGroups(filtered.map(group => ({
            ...group,
            distance: Math.sqrt(
                Math.pow(group.location[0] - userLocation.coords.latitude, 2) +
                Math.pow(group.location[1] - userLocation.coords.longitude, 2)
            ) * 111000,
            bearing: calcBearing(group.location, [userLocation.coords.latitude, userLocation.coords.longitude])
        })).filter(x => x.distance < 2000).sort((a, b) => a.distance - b.distance));
    }, [userLocation, input]);

    useEffect(() => {
        if (!input || !stopGroups?.length) return setSearch(undefined);
        let filtered = stopGroups.filter(group => group.name.toLowerCase().replace(/[^\w]/gi, "").includes(input.toLowerCase().replace(/[^\w]/gi, "")));
        setSearch(filtered);
    }, [input]);

    return stopGroups ? <>
        <AppBar position="sticky" elevation={0}>
            <Toolbar>
                <TextField
                    placeholder="Wyszukaj przystanek..."
                    variant="outlined"
                    fullWidth
                    autoFocus
                    sx={{
                        my: 1,
                        "& fieldset": {
                            borderRadius: "15px"
                        }
                    }}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    autoComplete="off"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <IconButton color="inherit" component={Link} to="../" replace>
                                <ArrowBack />
                            </IconButton>
                        </InputAdornment>,
                        endAdornment: !!input.length && <InputAdornment position="end">
                            <IconButton color="inherit" onClick={() => setInput("")}>
                                <HighlightOff />
                            </IconButton>
                        </InputAdornment>
                    }}
                />
            </Toolbar>
        </AppBar>

        <Slide direction="down" in={!!nearestGroups?.length} mountOnEnter unmountOnExit>
            <List subheader={<ListSubheader disableSticky>Najbliższe przystanki</ListSubheader>}>
                <TransitionGroup>
                    {nearestGroups?.slice(0, 15).map((group) => <Collapse key={`0-${group.name}`}>
                        <ListItemButton component={Link} to="." state={group.name} disableRipple>
                            <ListItemText primary={group.name} />
                            <Typography sx={{ alignItems: "center", display: "flex", color: "#cfd8dc" }} variant="body2">
                                {Math.round(group.distance || 0)} m
                                <ArrowUpward sx={{ transform: `rotate(${group.bearing}deg)`, marginLeft: 0.5 }} color="primary" />
                            </Typography>
                        </ListItemButton>
                    </Collapse>)}
                </TransitionGroup>
            </List>
        </Slide>

        <Slide direction="up" in={!!search} mountOnEnter unmountOnExit>
            <List subheader={<ListSubheader disableSticky>Wyniki wyszukiwania</ListSubheader>}>
                {search?.length ? <TransitionGroup>
                    {search.slice(0, 100).map((group) => <Collapse key={`1-${group.name}`}>
                        <ListItemButton component={Link} to="." state={group.name} disableRipple>
                            <ListItemText primary={group.name} />
                        </ListItemButton>
                    </Collapse>)}
                </TransitionGroup> : <ListItem>Nie znaleziono takiego przystanku</ListItem>}
            </List>
        </Slide>

        <Dialog
            open={!!state}
            fullWidth
            onClose={() => {
                navigate("", { state: undefined, replace: true });
                setGroupStops(undefined);
            }}
            sx={{ maxHeight: "80%", my: "auto" }}
        >
            {groupStops ? <List>
                {groupStops.map(stop => <ListItemButton key={stop.id} component={Link} to={`../stop/${stop.id}`}>
                    <ListItemAvatar><Avatar sx={{ bgcolor: Color(stop.type[0], city) }}><Icon type={stop.type[0]} /></Avatar></ListItemAvatar>
                    <ListItemText
                        primary={stop.name}
                        secondary={`${stop.routes.slice(0, 7).join(", ")}${stop.routes.length > 7 ? ", ..." : ""}`}
                    />
                </ListItemButton>)}
            </List> : <>
                {[0, 1, 2, 3].map(i => <ListItem key={i}>
                    <ListItemAvatar><Skeleton variant="circular" width={40} height={40} /></ListItemAvatar>
                    <ListItemText
                        primary={<Skeleton width={150} />}
                        secondary={<Skeleton width={200} />}
                    />
                </ListItem>)}
            </>}
        </Dialog>
    </> : <>
        <Skeleton
            variant="rectangular"
            height={56}
            sx={{
                my: 1,
                mx: 3,
                borderRadius: "15px"
            }}
        />

        {new Array(10).fill(null).map((_, i) => <ListItem key={`s-${i}`}>
            <ListItemText
                primary={<Skeleton width={150} />}
            />
        </ListItem>)}
    </>;
};

const calcBearing = (point1: [number, number], point2: [number, number]) => {
    if (!point1 || !point2) return undefined;
    let deg = (Math.atan2(point2[1] - point1[1], point2[0] - point1[0]) * 180) / Math.PI;
    return Math.floor(deg < 0 ? deg + 360 : deg);
}