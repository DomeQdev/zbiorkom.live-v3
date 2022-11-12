import { AppBar, IconButton, InputAdornment, List, ListItemButton, ListItemText, ListSubheader, Skeleton, TextField, Toolbar, Typography, Slide, Collapse, Dialog, ListItem, ListItemAvatar, Avatar, DialogTitle } from "@mui/material";
import { ArrowUpward, ElectricBike, HighlightOff, LockOpen, Map, PedalBike, TravelExplore } from "@mui/icons-material";
import { TransitionGroup } from "react-transition-group";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { BikeStation, City } from "../util/typings";
import { getData } from "../util/api";
import toast from "react-hot-toast";

export default ({ city, location }: { city: City, location?: GeolocationPosition }) => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [input, setInput] = useState("");
    const [bikeStations, setBikeStations] = useState<BikeStation[]>();
    const [nearestStations, setNearestStations] = useState<{
        id: string,
        name: string,
        location: [number, number],
        racks: [number | null, number | null, number],
        distance?: number,
        bearing?: number
    }[]>();
    const [search, setSearch] = useState<BikeStation[]>();

    const bikeStation = bikeStations?.find(x => x[0] === state);

    useEffect(() => {
        getData("bikes", city).then(setBikeStations).catch(() => {
            toast.error(`Nie mogliśmy załadować stacji rowerowych.`);
        });
    }, []);

    useEffect(() => {
        if (!location || !bikeStations?.length) return;
        let filtered = bikeStations.filter(station => !input || station[1].toLowerCase().replace(/[^\w]/gi, "").includes(input.toLowerCase().replace(/[^\w]/gi, "")));
        setNearestStations(filtered.map(station => ({
            id: station[0],
            name: station[1],
            location: station[2],
            racks: station[3],
            distance: Math.sqrt(
                Math.pow(station[2][0] - location.coords.latitude, 2) +
                Math.pow(station[2][1] - location.coords.longitude, 2)
            ) * 111000,
            bearing: calcBearing(station[2], [location.coords.latitude, location.coords.longitude])
        })).filter(x => x.distance < 2000).sort((a, b) => a.distance - b.distance) || []);
    }, [location, bikeStations, input]);

    useEffect(() => {
        if (!input || !bikeStations?.length) return setSearch(undefined);
        let filtered = bikeStations.filter(station => station[1].toLowerCase().replace(/[^\w]/gi, "").includes(input.toLowerCase().replace(/[^\w]/gi, "")));
        setSearch(filtered);
    }, [input]);

    return bikeStations ? <>
        <AppBar position="sticky" elevation={0}>
            <Toolbar>
                <TextField
                    placeholder="Wyszukaj stację..."
                    variant="outlined"
                    fullWidth
                    autoFocus
                    sx={{
                        my: 1,
                        marginLeft: 6,
                        "& fieldset": {
                            borderRadius: "15px"
                        }
                    }}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    autoComplete="off"
                    InputProps={{
                        endAdornment: !!input.length && <InputAdornment position="end">
                            <IconButton color="inherit" onClick={() => setInput("")}>
                                <HighlightOff />
                            </IconButton>
                        </InputAdornment>
                    }}
                />
            </Toolbar>
        </AppBar>

        {!input && !nearestStations?.length && <div style={{ textAlign: "center" }}>
            <TravelExplore color="primary" sx={{ width: 60, height: 60, marginTop: 1 }} /><br />
            <b style={{ fontSize: 17 }}>Czas żeby coś wyszukać...</b>
        </div>}

        <Slide direction="down" in={!!nearestStations?.length} mountOnEnter unmountOnExit>
            <List subheader={<ListSubheader disableSticky>Najbliższe stacje</ListSubheader>}>
                <TransitionGroup>
                    {nearestStations?.slice(0, 15).map((station) => <Collapse key={`0-${station.id}`}>
                        <ListItemButton component={Link} to="." state={station.id} disableRipple>
                            <ListItemText primary={station.name} />
                            <Typography sx={{ alignItems: "center", display: "flex" }} variant="body2">
                                {Math.round(station.distance || 0)} m
                                <ArrowUpward sx={{ transform: `rotate(${station.bearing}deg)`, marginLeft: 0.5 }} color="primary" />
                            </Typography>
                        </ListItemButton>
                    </Collapse>)}
                </TransitionGroup>
            </List>
        </Slide>

        <Slide direction="up" in={!!search} mountOnEnter unmountOnExit>
            <List subheader={<ListSubheader disableSticky>Wyniki wyszukiwania</ListSubheader>}>
                {search?.length ? <TransitionGroup>
                    {search.slice(0, 100).map(station => <Collapse key={`1-${station[0]}`}>
                        <ListItemButton component={Link} to="." state={station[0]} disableRipple>
                            <ListItemText primary={station[1]} />
                        </ListItemButton>
                    </Collapse>)}
                </TransitionGroup> : <ListItem>Nie znaleziono takiej stacji</ListItem>}
            </List>
        </Slide>

        <Dialog
            open={!!bikeStation}
            fullWidth
            onClose={() => navigate("", { state: undefined, replace: true })}
            sx={{ maxHeight: "80%", my: "auto" }}
        >
            {bikeStation && <>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>{bikeStation[1]}<IconButton component={Link} to={`../map?bike=${bikeStation[0]}`}><Map /></IconButton></DialogTitle>
                <List>
                    {bikeStation[3][0] != null && <ListItem>
                        <ListItemAvatar><Avatar><PedalBike /></Avatar></ListItemAvatar>
                        <ListItemText primary={bikeStation[3][0]} secondary="Zwykłe rowery" />
                    </ListItem>}
                    {bikeStation[3][1] != null && <ListItem>
                        <ListItemAvatar><Avatar><ElectricBike /></Avatar></ListItemAvatar>
                        <ListItemText primary={bikeStation[3][1]} secondary="Elektryczne rowery" />
                    </ListItem>}
                    <ListItem>
                        <ListItemAvatar><Avatar><LockOpen /></Avatar></ListItemAvatar>
                        <ListItemText primary={bikeStation[3][2]} secondary="Wolne stojaki" />
                    </ListItem>
                </List>
            </>}
        </Dialog>
    </> : <>
        <Skeleton
            variant="rectangular"
            height={56}
            sx={{
                my: 1,
                marginLeft: 8,
                marginRight: 2,
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
    return deg + 180;
}