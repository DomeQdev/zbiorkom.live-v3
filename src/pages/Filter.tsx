import { ArrowDropDown, Close, RestartAlt, Search } from "@mui/icons-material";
import { IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Skeleton, TextField, ToggleButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Color, Name, Icon } from "../components/Icons";
import { City, FilterData, RouteType } from "../util/typings";
import { getData } from "../util/api";
import toast from "react-hot-toast";

export default ({ city, filter, setFilter, onClose }: { city: City, filter: FilterData, setFilter: (filterData: FilterData) => void, onClose: () => void }) => {
    const [routes, setRoutes] = useState<RouteType[]>();

    useEffect(() => {
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
                sx={{
                    marginTop: 1.2,
                    width: "96%",
                    mx: "2%"
                }}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                }}
            />
            <List>
                {routes.map(type => <ListItem key={type.type} secondaryAction={<IconButton edge="end"><ArrowDropDown /></IconButton>}>
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
                                ...filter,
                                types: filter.types.filter(t => t !== type.type)
                            } : {
                                ...filter,
                                types: [...filter.types, type.type]
                            })}
                        ><Icon type={type.type} /></ToggleButton>
                    </ListItemAvatar>
                    <ListItemText
                        primary={Name(type.type)}
                    />
                </ListItem>)}
            </List>
        </> : <Skeleton variant="rectangular" height={100} />}
    </BottomSheet>;
};