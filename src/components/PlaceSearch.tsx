import { TextField, AppBar, Toolbar, IconButton, InputAdornment, List, ListItemButton, ListItemAvatar, ListItemText, Avatar, Divider } from "@mui/material";
import { ArrowBack, DirectionsTransit, HighlightOff } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { Stop, City } from "../util/typings";
import { getData } from "../util/api";

export default ({ city, onData }: { city: City, onData: (name: string, location: [number, number]) => void }) => {
    const navigate = useNavigate();
    const [input, setInput] = useState<string>();
    const [stopResults, setStopResults] = useState<Stop[]>();

    const debouncedSearch = useRef(debounce(async (criteria: string) => {
        setStopResults(await getData("findStop", city, {
            name: criteria
        }).catch(() => []));
    }, 750)).current;

    useEffect(() => {
        if (!input || input.length < 3) return setStopResults(undefined);
        debouncedSearch(input);
        return () => debouncedSearch.cancel();
    }, [input]);

    return <>
        <AppBar sx={{ position: "relative" }} color="transparent">
            <Toolbar>
                <TextField
                    placeholder="Wyszukaj tutaj"
                    variant="outlined"
                    fullWidth
                    sx={{
                        marginTop: 1,
                        marginBottom: 1,
                        "& fieldset": {
                            borderRadius: "25px"
                        }
                    }}
                    value={input}
                    onChange={({ target }) => setInput(target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <IconButton color="inherit" onClick={() => navigate("../")}>
                                <ArrowBack />
                            </IconButton>
                        </InputAdornment>,
                        endAdornment: !!input?.length && <InputAdornment position="end">
                            <IconButton color="inherit" onClick={() => setInput(undefined)}>
                                <HighlightOff />
                            </IconButton>
                        </InputAdornment>
                    }}
                />
            </Toolbar>
        </AppBar>
        {stopResults ? stopResults.length ? <List sx={{ width: "100%" }}>
            {stopResults.map<React.ReactNode>((stop) => <ListItemButton key={stop.id}>
                <ListItemAvatar>
                    <Avatar>
                        <DirectionsTransit />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText>
                    {stop.name} {stop.code}
                </ListItemText>
            </ListItemButton>).reduce((prev, curr, i) => [prev, <Divider variant="inset" key={i} />, curr])}
        </List> : "Nie znaleziono wynikow" : "uwu"}
        {stopResults && JSON.stringify(stopResults)}
    </>;
};