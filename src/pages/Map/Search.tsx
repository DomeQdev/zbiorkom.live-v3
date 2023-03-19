import { Avatar, Divider, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, TextField, Typography } from "@mui/material";
import { Close, Hail, Search } from "@mui/icons-material";
import { BottomSheet } from "react-spring-bottom-sheet";
import { City, VehicleType } from "../../util/typings";
import { Color, Icon } from "../../components/Icons";
import { useDebouncedCallback } from "use-debounce";
import { getData } from "../../util/api";
import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default ({ city, onClose }: { city: City, onClose: () => void }) => {
    const [searchResults, setSearchResults] = useState<{
        type: "stop" | VehicleType,
        name?: string,
        brigade?: string,
        route?: string,
        id?: string,
        headsign?: string,
        model?: string
    }[]>();
    const [search, setSearch] = useState<string>("");

    const debounce = useDebouncedCallback((value) => {
        if (value.trim().length < 3) return;
        getData("search", city, { search: value }).then(setSearchResults).catch(() => toast.error("Nie udało się pobrać wyników wyszukiwania."));
    }, 700);

    return <BottomSheet
        open
        onDismiss={onClose}
        style={{ zIndex: 1200, position: "absolute" }}
        skipInitialTransition
        snapPoints={({ maxHeight }) => [maxHeight / 2.2]}
        header={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <IconButton onClick={onClose} style={{ height: 40 }}><Close /></IconButton>
            <Typography variant="h6" gutterBottom>Wyszukiwarka</Typography>
            <IconButton sx={{ visibility: "hidden" }}><Search /></IconButton>
        </div>}
    >
        <TextField
            variant="outlined"
            size="small"
            placeholder="Wyszukaj..."
            autoComplete="off"
            autoFocus
            value={search}
            onChange={({ target }) => {
                setSearchResults(undefined);
                setSearch(target.value);
                debounce(target.value);
            }}
            sx={{ marginTop: 1.2, width: "96%", mx: "2%" }}
            InputProps={{
                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
            }}
        />
        {search.trim().length >= 3 ? <>
            {searchResults ? <List sx={{ my: 0.5 }}>
                {searchResults.length ? searchResults.map<React.ReactNode>(result => <ListItemButton key={result.id || result.name} component={Link} to={result.type === "stop" ? `?stop=${result.id}` : `?vehicle=${result.type}/${result.id}`} state={undefined}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: result.type === "stop" ? "primary" : Color(result.type, city) }}>
                            {result.type === "stop" ? <Hail /> : <Icon type={result.type} />}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={result.name || <><b>{result.route}</b>{result.brigade && <small>/{result.brigade}</small>} {result.headsign}</>}
                        secondary={result.type === "stop" ? "Zespół przystankowy" : `${result.id}${result.model ? `, ${result.model}` : ""}`}
                    />
                </ListItemButton>).reduce((prev, curr, i) => [prev, <Divider key={`div-${i}`} />, curr]) : <div style={{ textAlign: "center" }}>
                    <Search color="primary" sx={{ width: 60, height: 60, marginTop: 1 }} /><br />
                    <b style={{ fontSize: 17 }}>Nie znaleziono żadnych wyników.</b>
                </div>}
            </List> : <List sx={{ my: 0.5 }}>
                {new Array(3).fill(0).map<React.ReactNode>((_, i) => <ListItem key={i}>
                    <ListItemAvatar>
                        <Skeleton variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={<Skeleton width={200} />}
                        secondary={<Skeleton width={100} />}
                    />
                </ListItem>).reduce((prev, curr, i) => [prev, <Divider key={`divs-${i}`} />, curr])}
            </List>}
        </> : <div style={{ textAlign: "center" }}>
            <Search color="primary" sx={{ width: 60, height: 60, marginTop: 1 }} /><br />
            <b style={{ fontSize: 17 }}>Wyszukaj coś...</b>
        </div>}
    </BottomSheet>;
};