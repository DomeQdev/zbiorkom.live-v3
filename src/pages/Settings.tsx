import { List, ListItemButton, ListItemIcon, ListItemText, Divider, Button, Box } from "@mui/material";
import { ArrowBack, DarkMode, LightMode, LocationCity, Map, NavigateNext } from "@mui/icons-material";
import { Link, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { City } from "../util/typings";
import styles from "../util/styles.json";
import isDark from "../util/isDark";
import toast from "react-hot-toast";

export default ({ city }: { city: City }) => {
    const [mapStyle, setMapStyle] = useState(localStorage.getItem("mapstyle") || "ms");
    const darkMode = isDark();

    return <Routes>
        <Route path="map" element={<Box sx={{ textAlign: "center" }}>
            <h1 style={{ fontWeight: "normal" }}>Zmiana stylu mapy</h1>
            <Button variant="outlined" startIcon={<ArrowBack />} component={Link} to=".." replace>Wróć</Button>
            <List sx={{ width: "90%", mx: "auto" }}>
                {Object.values(styles).map(style => <ListItemButton key={style.id} disabled={mapStyle === style.id} onClick={() => {
                    setMapStyle(style.id);
                    toast.success(`Zmieniono styl mapy na ${style.name}!`);
                    localStorage.setItem("mapstyle", style.id);
                }}>
                    <ListItemIcon><Map /></ListItemIcon>
                    <ListItemText primary={style.name} />
                    <NavigateNext />
                </ListItemButton>)}
            </List>
        </Box>} />
        <Route path="*" element={<>
            <h1 style={{ fontWeight: "normal", textAlign: "center" }}>Ustawienia</h1>
            <List sx={{ width: "90%", mx: "auto" }}>
                <ListItemButton onClick={() => {
                    localStorage.setItem("theme", darkMode ? "light" : "dark");
                    window.location.reload();
                }}>
                    <ListItemIcon>{darkMode ? <LightMode /> : <DarkMode />}</ListItemIcon>
                    <ListItemText primary={`Zmień motyw na ${darkMode ? "jasny" : "ciemny"}`} />
                    <NavigateNext />
                </ListItemButton>
                <Divider />
                <ListItemButton component={Link} to="/city">
                    <ListItemIcon><LocationCity /></ListItemIcon>
                    <ListItemText primary="Zmiana miasta" />
                    <NavigateNext />
                </ListItemButton>
                <Divider />
                <ListItemButton component={Link} to="map">
                    <ListItemIcon><Map /></ListItemIcon>
                    <ListItemText primary="Zmiana stylu mapy" />
                    <NavigateNext />
                </ListItemButton>
            </List>
        </>} />
    </Routes>;
};