import { TextField, AppBar, Toolbar, IconButton, InputAdornment, List, ListItemButton, ListItemAvatar, ListItemText, Avatar, Divider, Skeleton, ListItem, ListItemIcon, Box, Button, Dialog, Typography } from "@mui/material";
import { AccountBalance, ArrowBack, Clear, DirectionsTransit, HighlightOff, History, Home, Map, MyLocation, NoTransfer } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Stop, City } from "../util/typings";
import { Transition } from "./PlannerPicker";
import cities from "../util/cities.json";
import { getData } from "../util/api";
import { Color, Icon } from "./Icons";
import isDark from "../util/isDark";
import toast from "react-hot-toast";
import MapPicker from "./MapPicker";
import { debounce } from "lodash";

export default ({ city, placeholder, onData }: { city: City, placeholder: string, onData: (name: string, location: [number, number]) => void }) => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>();
    const [input, setInput] = useState<string>("");
    const [stopResults, setStopResults] = useState<Stop[]>();
    const [mapEnabled, setMapEnabled] = useState<boolean>(false);
    const [lastPlaces, setLastPlaces] = useState<{
        name: string,
        location: [number, number],
        date: number
    }[]>(JSON.parse(localStorage.getItem(`${city}.lastPlaces`) || "[]"));
    const { samplePlace } = cities[city];
    const darkMode = isDark();

    const debouncedSearch = useRef(debounce(async (criteria: string) => {
        setStopResults(await getData("findStop", city, {
            name: criteria
        }).catch(() => []));
    }, 700)).current;

    useEffect(() => {
        setStopResults(undefined);
        if (!input || input.length < 3) return debouncedSearch.cancel();
        debouncedSearch(input);
        return () => debouncedSearch.cancel();
    }, [input]);

    useEffect(() => {
        setInput("");
        setStopResults(undefined);
        debouncedSearch.cancel();
    }, [placeholder]);

    useEffect(() => inputRef.current?.focus(), [inputRef, placeholder]);

    return <>
        <AppBar position="sticky" elevation={0}>
            <Toolbar>
                <TextField
                    placeholder={placeholder}
                    variant="outlined"
                    fullWidth
                    inputRef={inputRef}
                    sx={{
                        marginTop: 1,
                        marginBottom: 1,
                        "& fieldset": {
                            borderRadius: "25px"
                        }
                    }}
                    value={input}
                    onChange={({ target }) => setInput(target.value)}
                    autoComplete="off"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <IconButton color="inherit" onClick={() => navigate("../", { replace: true })}>
                                <ArrowBack />
                            </IconButton>
                        </InputAdornment>,
                        endAdornment: !!input?.length && <InputAdornment position="end">
                            <IconButton color="inherit" onClick={() => setInput("")}>
                                <HighlightOff />
                            </IconButton>
                        </InputAdornment>
                    }}
                />
            </Toolbar>
        </AppBar>
        {stopResults ? stopResults.length ? <List sx={{ width: "100%" }}>
            {stopResults.map<React.ReactNode>((stop) => <ListItemButton
                key={stop.id}
                onClick={() => {
                    onData(`${stop.name}${stop.code ? ` ${stop.code}` : ""}`, stop.location);
                    let lastPlaces = JSON.parse(localStorage.getItem(`${city}.lastPlaces`) || "[]");
                    localStorage.setItem(`${city}.lastPlaces`, JSON.stringify([
                        ...lastPlaces.slice(0, 9),
                        {
                            name: `${stop.name}${stop.code ? ` ${stop.code}` : ""}`,
                            location: stop.location,
                            date: Date.now()
                        }
                    ]));
                }}
            >
                <ListItemAvatar>
                    <Avatar sx={{ color: darkMode ? "white" : Color(stop.type[0], city), bgcolor: darkMode ? Color(stop.type[0], city) : "inherit" }}>
                        {stop.type ? <Icon type={stop.type[0]} /> : <DirectionsTransit />}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={`${stop.name}${stop.code ? ` ${stop.code}` : ""}`}
                />
            </ListItemButton>).reduce((prev, curr, i) => [prev, <Divider variant="inset" key={i} />, curr])}
        </List> : <div style={{ textAlign: "center" }}>
            <NoTransfer color="primary" sx={{ width: 70, height: 70 }} /><br />
            <b style={{ fontSize: 18 }}>Nie znaleziono wyników.</b>
        </div> : input && input.length >= 3 ? new Array(8).fill(null).map<React.ReactNode>((_, i) => <ListItem key={`1-${i}`}>
            <ListItemAvatar>
                <Skeleton variant="circular">
                    <Avatar />
                </Skeleton>
            </ListItemAvatar>
            <ListItemText
                primary={<Skeleton variant="text" width={150} />}
            />
        </ListItem>).reduce((prev, curr, i) => [prev, <Divider variant="inset" key={`1_${i}`} />, curr]) : <List sx={{ width: "95%", marginLeft: "auto", marginRight: "auto" }}>
            <ListItemButton onClick={() => fetchLocation().then(location => onData("Twoja lokalizacja", location)).catch(() => toast.error("Nie mogliśmy pobrać twojej lokalizacji."))}>
                <ListItemIcon sx={{ color: "#5090E4" }}>
                    <MyLocation />
                </ListItemIcon>
                <ListItemText
                    primary="Twoja lokalizacja"
                />
            </ListItemButton>
            <ListItemButton onClick={() => setMapEnabled(true)}>
                <ListItemIcon>
                    <Map />
                </ListItemIcon>
                <ListItemText
                    primary="Wybierz na mapie"
                />
            </ListItemButton>
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    width: "100%",
                    overflowX: "auto",
                    '& hr': {
                        mx: 0.5,
                    },
                    '& .MuiListItemButton-root': {
                        flex: "none"
                    }
                }}
            >
                <ListItemButton disabled>
                    <ListItemIcon>
                        <Home />
                    </ListItemIcon>
                    <ListItemText
                        primary="Dom"
                        secondary="Dworzec Wileński"
                    />
                </ListItemButton>
                <Divider orientation="vertical" variant="middle" flexItem />

            </Box>
            <Divider />
            {lastPlaces.length ? <>
                {lastPlaces.map<React.ReactNode>((place, i) => <ListItemButton key={i} onClick={() => onData(place.name, place.location)}>
                    <ListItemIcon>
                        <History />
                    </ListItemIcon>
                    <ListItemText
                        primary={place.name}
                    />
                </ListItemButton>)}
                <Button startIcon={<Clear />} sx={{ float: "right" }} onClick={() => {
                    localStorage.removeItem(`${city}.lastPlaces`);
                    setLastPlaces([]);
                }}>Wyczyść historię</Button>
            </> : <ListItemButton onClick={() => onData(samplePlace.name, samplePlace.location as [number, number])}>
                <ListItemIcon>
                    <AccountBalance />
                </ListItemIcon>
                <ListItemText
                    primary={samplePlace.name}
                />
            </ListItemButton>}
        </List>}

        <Dialog open={mapEnabled} fullScreen TransitionComponent={Transition}>
            <MapPicker city={city} onData={(name, location) => {
                setMapEnabled(false);
                onData(name, location);
            }} onDismiss={() => setMapEnabled(false)} />
        </Dialog>
    </>;
};

function fetchLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            resolve([coords.latitude, coords.longitude]);
        }, () => reject());
    });
}