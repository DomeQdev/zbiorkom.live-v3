import { List, ListItemButton, ListItemIcon, ListItemText, Divider, Button, Box } from "@mui/material";
import { ArrowBack, DarkMode, LightMode, LocationCity, Map, NavigateNext } from "@mui/icons-material";
import { Route, Routes, useNavigate } from "react-router-dom";
import { City } from "../util/typings";
import isDark from "../util/isDark";
import styles from "../util/styles.json";
import toast from "react-hot-toast";
import { useState } from "react";

export default ({ city }: { city: City }) => {
    const [mapStyle, setMapStyle] = useState(localStorage.getItem("mapstyle") || "ms");
    const navigate = useNavigate();
    const darkMode = isDark();

    return <Routes>
        <Route path="map" element={<Box sx={{ textAlign: "center" }}>
            <h1 style={{ fontWeight: "normal" }}>Zmiana stylu mapy</h1>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(".", { replace: true })}>Wróć</Button>
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
                <ListItemButton onClick={() => navigate("/city")}>
                    <ListItemIcon><LocationCity /></ListItemIcon>
                    <ListItemText primary="Zmiana miasta" />
                    <NavigateNext />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={() => navigate("map")}>
                    <ListItemIcon><Map /></ListItemIcon>
                    <ListItemText primary="Styl mapy" />
                    <NavigateNext />
                </ListItemButton>
            </List>
        </>} />
    </Routes>;
};