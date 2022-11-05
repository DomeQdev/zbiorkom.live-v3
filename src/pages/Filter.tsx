import { ArrowDropDown, ArrowDropUp, Close, NavigateNext, NoTransfer, RestartAlt, Search } from "@mui/icons-material";
import { Badge, Box, Collapse, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, TextField, ToggleButton, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Color, Name, Icon } from "../components/Icons";
import { City, FilterData, RouteType, VehicleType } from "../util/typings";
import { getData } from "../util/api";
import toast from "react-hot-toast";

export default ({ city, filter, setFilter, onClose }: { city: City, filter: FilterData, setFilter: (filterData: FilterData) => void, onClose: () => void }) => {
    const [routes, setRoutes] = useState<RouteType[]>();
    const [selectedType, setSelectedType] = useState<VehicleType>();
    const [search, setSearch] = useState<string>("");
    const searchResults = useMemo(() => routes?.map(r => r.routes.map(route => ({ ...route, type: r.type }))).flat().filter(route => route.name.replace(/[^\w]/gi, "").toLowerCase().includes(search.replace(/[^\w]/gi, "").toLowerCase())), [search]);

    useEffect(() => {
        setSearch("");
        setSelectedType(undefined);
        getData("routes", city).then(setRoutes).catch(() => {
            toast.error("Nie mogliśmy pobrać linii...");
            return onClose();
        });
    }, []);

    return <BottomSheet
        open
        onDismiss={onClose}
        style={{ zIndex: 1200, position: "absolute" }}
        skipInitialTransition
        snapPoints={({ maxHeight }) => [maxHeight / 2.2]}
        header={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <IconButton onClick={onClose} style={{ height: 40 }}><Close /></IconButton>
            <Typography variant="h6" gutterBottom>Filtrowanie pojazdów</Typography>
            <IconButton disabled={!filter.routes?.length && !filter.types?.length} onClick={() => setFilter({
                routes: [],
                types: []
            })} style={{ height: 40 }}><RestartAlt /></IconButton>
        </div>}
    >
        {routes ? <>
            <TextField
                variant="outlined"
                size="small"
                placeholder="Wyszukaj linie..."
                autoComplete="off"
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ marginTop: 1.2, width: "96%", mx: "2%" }}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                }}
            />
            {search ? searchResults?.length ? <Box sx={{ marginTop: 1.2, width: "96%", mx: "2%", textAlign: "center" }}>
                {searchResults.map(result => <ToggleButton
                    value={result.id}
                    key={result.id}
                    selected={!filter.routes.length || filter.routes.includes(result.id)}
                    onClick={() => setFilter({
                        routes: filter.routes.includes(result.id) ? filter.routes.filter(r => r !== result.id) : [...filter.routes, result.id],
                        types: filter.routes.includes(result.id) ? [...new Set(filter.routes.filter(r => r !== result.id).map(r => searchResults.find(d => d.id === r)!.type))] : [...new Set([...filter.types, result.type])]
                    })}
                    sx={{
                        borderRadius: 15,
                        padding: "0 10px",
                        margin: 0.3,
                        color: Color(result.type, city),
                        border: `2px solid ${Color(result.type, city)}`,
                        fill: Color(result.type, city),
                        backgroundColor: "white",
                        ":hover": {
                            backgroundColor: "white",
                            color: Color(result.type, city),
                            fill: Color(result.type, city),
                        },
                        "&.Mui-selected": {
                            backgroundColor: Color(result.type, city),
                            color: "white",
                            fill: "white"
                        },
                        "&.Mui-selected:hover": {
                            backgroundColor: Color(result.type, city),
                            color: "white",
                            fill: "white"
                        }
                    }}
                >
                    <Icon type={result.type} />&nbsp;{result.name}
                </ToggleButton>)}
            </Box> : <div style={{ textAlign: "center" }}>
                <NoTransfer color="primary" sx={{ width: 60, height: 60, marginTop: 1 }} /><br />
                <b style={{ fontSize: 17 }}>Nie znaleziono żadnych wyników.</b>
            </div> : <List>
                {routes.map(type => <div key={type.type}>
                    <ListItem
                        secondaryAction={<IconButton edge="end" onClick={() => setSelectedType(selectedType === type.type ? undefined : type.type)}>
                            <Badge variant="dot" color="primary" invisible={!routes.find(r => r.type === type.type)?.routes.find(r => filter.routes.includes(r.id))}>
                                {selectedType === type.type ? <ArrowDropUp /> : <ArrowDropDown />}
                            </Badge>
                        </IconButton>}
                    >
                        <ListItemAvatar>
                            <ToggleButton
                                size="small"
                                selected={!filter.types?.length || filter.types.includes(type.type)}
                                value={type.type}
                                sx={{
                                    "&.Mui-selected": {
                                        backgroundColor: Color(type.type, city),
                                        color: "white"
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: Color(type.type, city),
                                        color: "white"
                                    }
                                }}
                                onClick={() => setFilter(filter.types?.includes(type.type) ? {
                                    routes: [...new Set(filter.routes.filter(r => searchResults?.find(d => d.id === r)!.type !== type.type))],
                                    types: filter.types.filter(t => t !== type.type)
                                } : {
                                    routes: [...new Set(filter.routes.filter(r => searchResults?.find(d => d.id === r)!.type !== type.type))],
                                    types: [...filter.types, type.type]
                                })}
                            ><Icon type={type.type} /></ToggleButton>
                        </ListItemAvatar>
                        <ListItemText
                            primary={Name(type.type)}
                            sx={{ cursor: "pointer" }}
                            onClick={() => setSelectedType(selectedType === type.type ? undefined : type.type)}
                        />
                    </ListItem>
                    <Collapse in={selectedType === type.type}>
                        <ListItem>
                            <Box sx={{ width: "96%", mx: "2%", textAlign: "center" }}>
                                {type.routes.map(result => <ToggleButton
                                    value={result.id}
                                    key={result.id}
                                    selected={!filter.routes.length || filter.routes.includes(result.id)}
                                    onClick={() => setFilter({
                                        routes: filter.routes.includes(result.id) ? filter.routes.filter(r => r !== result.id) : [...filter.routes, result.id],
                                        types: filter.routes.includes(result.id) ? [...new Set(filter.routes.filter(r => r !== result.id).map(r => type.type))] : [...new Set([...filter.types, type.type])]
                                    })}
                                    sx={{
                                        borderRadius: 15,
                                        padding: "0 10px",
                                        margin: 0.3,
                                        color: Color(type.type, city),
                                        border: `2px solid ${Color(type.type, city)}`,
                                        fill: Color(type.type, city),
                                        backgroundColor: "white",
                                        ":hover": {
                                            backgroundColor: "white",
                                            color: Color(type.type, city),
                                            fill: Color(type.type, city),
                                        },
                                        "&.Mui-selected": {
                                            backgroundColor: Color(type.type, city),
                                            color: "white",
                                            fill: "white"
                                        },
                                        "&.Mui-selected:hover": {
                                            backgroundColor: Color(type.type, city),
                                            color: "white",
                                            fill: "white"
                                        }
                                    }}
                                >
                                    <Icon type={type.type} />&nbsp;{result.name}
                                </ToggleButton>)}
                            </Box>
                        </ListItem>
                    </Collapse>
                </div>)}
                <ListItemButton disabled>
                    <ListItemText primary="Filtrowanie po modelu pojazdu" />
                    <NavigateNext />
                </ListItemButton>
            </List>}
        </> : <>
            <Skeleton variant="rectangular" height={40} sx={{ width: "96%", mx: "2%", marginTop: 1.2, borderRadius: 1 }} />
            <List>
                {[1, 2, 3, 4].map(i => <ListItem key={i} secondaryAction={<Skeleton variant="circular" width={24} height={24} />}>
                    <ListItemAvatar>
                        <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={<Skeleton variant="text" width={100} />}
                    />
                </ListItem>)}
            </List>
        </>}
    </BottomSheet>;
};