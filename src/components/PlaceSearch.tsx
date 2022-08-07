import { TextField, AppBar, Toolbar, IconButton, InputAdornment, List, ListItemButton, ListItemAvatar, ListItemText, Avatar, Divider, ListItem, Skeleton } from "@mui/material";
import { ArrowBack, DirectionsTransit, HighlightOff, NoTransfer } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { Stop, City } from "../util/typings";
import { getData } from "../util/api";

export default ({ city, placeholder, onData }: { city: City, placeholder: string, onData: (name: string, location: [number, number]) => void }) => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>();
    const [input, setInput] = useState<string>();
    const [stopResults, setStopResults] = useState<Stop[]>();

    const debouncedSearch = useRef(debounce(async (criteria: string) => {
        setStopResults(await getData("findStop", city, {
            name: criteria
        }).catch(() => []));
    }, 800)).current;

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
        <AppBar sx={{ position: "relative" }} color="transparent">
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
                onClick={() => onData(`${stop.name}${stop.code ? ` ${stop.code}` : ""}`, stop.location)}
            >
                <ListItemAvatar>
                    <Avatar>
                        <DirectionsTransit />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${stop.name}${stop.code ? ` ${stop.code}` : ""}`} />
            </ListItemButton>).reduce((prev, curr, i) => [prev, <Divider variant="inset" key={i} />, curr])}
        </List> : <div style={{ textAlign: "center" }}>
            <NoTransfer color="primary" sx={{ width: 70, height: 70 }} /><br />
            <b style={{ fontSize: 18 }}>Nie znaleziono wyników.</b>
        </div> : input && input.length >= 3 ? new Array(5).fill(null).map<React.ReactNode>((i) => <ListItem key={`1-${i}`}>
            <ListItemAvatar>
                <Skeleton variant="circular">
                    <Avatar />
                </Skeleton>
            </ListItemAvatar>
            <ListItemText>
                <Skeleton variant="text" width={250} height={24} />
            </ListItemText>
        </ListItem>).reduce((prev, curr, i) => [prev, <Divider variant="inset" key={`1_${i}`} />, curr]) : "not searching mode"}
    </>;
};