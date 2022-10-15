import { List, ListItemButton, ListItemIcon, ListItemText, Divider, Button, Box } from "@mui/material";
import { AdUnits, Celebration, Cookie, DarkMode, LightMode, LocationCity, Map, MoneyOff, NavigateNext, ThumbDownAlt, ThumbUpAlt } from "@mui/icons-material";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { City } from "../util/typings";
import styles from "../util/styles.json";
import isDark from "../util/isDark";
import toast from "react-hot-toast";

export default ({ city }: { city: City }) => {
    const [mapStyle, setMapStyle] = useState(localStorage.getItem("mapStyle") || "ms");
    const [adsEnabled, setAdsEnabled] = useState(localStorage.getItem("ads") === "true");
    const [canBeEnabled, setCanBeEnabled] = useState<boolean>();
    const { pathname } = useLocation();
    const darkMode = isDark();

    useEffect(() => {
        if (pathname.includes("/ads") && !canBeEnabled) fetch("https://www3.doubleclick.net", {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-store"
        }).then(() => setCanBeEnabled(true)).catch(() => {
            setCanBeEnabled(false);
            setAdsEnabled(false);
            localStorage.setItem("ads", "false");
            toast("Używasz wtyczki która blokuje reklamy.", {
                icon: <MoneyOff color="error" />,
                duration: 4000
            });
        });
    }, [pathname]);

    return <Routes>
        <Route path="map" element={<Box sx={{ textAlign: "center" }}>
            <h1 style={{ fontWeight: "normal" }}>Zmiana stylu mapy</h1>
            <List sx={{ width: "90%", mx: "auto" }}>
                {Object.values(styles).map(style => <ListItemButton key={style.id} disabled={mapStyle === style.id} onClick={() => {
                    setMapStyle(style.id);
                    toast.success(`Zmieniono styl mapy na ${style.name}!`);
                    localStorage.setItem("mapStyle", style.id);
                }}>
                    <ListItemIcon><Map /></ListItemIcon>
                    <ListItemText primary={style.name} />
                    <NavigateNext />
                </ListItemButton>)}
            </List>
        </Box>} />
        <Route path="ads" element={<Box sx={{ textAlign: "center" }}>
            <h1 style={{ fontWeight: "normal" }}>Reklamy</h1>
            <Button
                variant="contained"
                startIcon={adsEnabled ? <ThumbDownAlt /> : <ThumbUpAlt />}
                color={adsEnabled ? "error" : "primary"}
                disabled={!canBeEnabled}
                onClick={() => {
                    setAdsEnabled(!adsEnabled);
                    if (!adsEnabled) toast("Nasza strona używa plików cookies firm trzecich. Jeśli nie chcesz ich używać, wyłącz reklamy.", {
                        icon: <Cookie color="warning" />,
                        duration: 7000
                    });
                    toast(adsEnabled ? "Wyłączono reklamy :(" : "Włączono reklamy! Dzięki :)", {
                        icon: adsEnabled ? <MoneyOff color="error" /> : <Celebration color="primary" />,
                        duration: 4000
                    });
                    localStorage.setItem("ads", (!adsEnabled).toString());
                }}
            >
                W{adsEnabled ? "y" : ""}łącz reklamy
            </Button>
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
                <Divider />
                <ListItemButton component={Link} to="ads">
                    <ListItemIcon><AdUnits /></ListItemIcon>
                    <ListItemText primary="Reklamy" />
                    <NavigateNext />
                </ListItemButton>
            </List>
        </>} />
    </Routes>;
};