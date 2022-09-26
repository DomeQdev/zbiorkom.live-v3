import { List, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { City } from "../util/typings";
import { Route, Routes, useNavigate } from "react-router-dom";
import { DarkMode, LightMode, LocationCity, Map, NavigateNext } from "@mui/icons-material";
import isDark from "../util/isDark";

export default ({ city }: { city: City }) => {
    const navigate = useNavigate();
    const darkMode = isDark();

    return <Routes>
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