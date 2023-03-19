import { AdUnits, DarkMode, LightMode, LocationCity, Map, MinorCrash, NavigateNext, Star, Translate } from "@mui/icons-material";
import { List, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { lazy } from "react";
import { City } from "../../util/typings";
import { Suspense } from "../../components/Suspense";
import isDark from "../../util/isDark";

const FavoriteSettings = lazy(() => import("./Favorite"));
const LanguageSettings = lazy(() => import("./Language"));
const MapSettings = lazy(() => import("./Map"));
const MarkersSettings = lazy(() => import("./Markers"));

export default ({ city }: { city: City }) => {
    const { t } = useTranslation("settings");
    const darkMode = isDark();

    return <Routes>
        <Route path="map" element={<Suspense><MapSettings /></Suspense>} />
        <Route path="language" element={<Suspense><LanguageSettings /></Suspense>} />
        <Route path="markers" element={<Suspense><MarkersSettings /></Suspense>} />
        <Route path="favorite" element={<Suspense><FavoriteSettings city={city} /></Suspense>} />

        <Route path="*" element={<>
            <h1 style={{ fontWeight: "normal", textAlign: "center" }}>{t("Settings") as string}</h1>
            <List sx={{ width: "90%", mx: "auto" }}>
                <ListItemButton onClick={() => {
                    localStorage.setItem("theme", darkMode ? "light" : "dark");
                    window.location.reload();
                }}>
                    <ListItemIcon>{darkMode ? <LightMode /> : <DarkMode />}</ListItemIcon>
                    <ListItemText primary={t(`Change theme to ${darkMode ? "light" : "dark"}`) as string} />
                    <NavigateNext />
                </ListItemButton>
                <Divider />
                <ListItemButton component={Link} to="map">
                    <ListItemIcon><Map /></ListItemIcon>
                    <ListItemText primary={t("Change map style") as string} />
                    <NavigateNext />
                </ListItemButton>
                <Divider />
                <ListItemButton component={Link} to="language">
                    <ListItemIcon><Translate /></ListItemIcon>
                    <ListItemText primary={t("Change language") as string} />
                    <NavigateNext />
                </ListItemButton>
                {/* <Divider />
                <ListItemButton component={Link} to="markers">
                    <ListItemIcon><MinorCrash /></ListItemIcon>
                    <ListItemText primary={t("Customize vehicle markers") as string} />
                    <NavigateNext />
                </ListItemButton> */}
            </List>
            <h2 style={{ fontWeight: "normal", textAlign: "center" }}>{t("City settings") as string}</h2>
            <List sx={{ width: "90%", mx: "auto" }}>
                <ListItemButton component={Link} to="/city">
                    <ListItemIcon><LocationCity /></ListItemIcon>
                    <ListItemText primary={t("Change city") as string} />
                    <NavigateNext />
                </ListItemButton>
                {/* <Divider />
                <ListItemButton component={Link} to="favorite">
                    <ListItemIcon><Star /></ListItemIcon>
                    <ListItemText primary={t("Favorite routes") as string} />
                    <NavigateNext />
                </ListItemButton> */}
            </List>
        </>} />
    </Routes>;
};