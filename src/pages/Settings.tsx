import { List, ListItemButton, ListItemIcon, ListItemText, Divider, Button, Box, ListItemAvatar, Avatar, FormGroup, FormControlLabel, Switch, FormHelperText } from "@mui/material";
import { AdUnits, Celebration, DarkMode, LightMode, LocationCity, Map, MinorCrash, MoneyOff, NavigateNext, ThumbDownAlt, ThumbUpAlt, Translate } from "@mui/icons-material";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { City } from "../util/typings";
import isDark from "../util/isDark";
import toast from "react-hot-toast";
import styles from "../util/styles.json";
import translations from "../util/translations.json";

export default ({ city }: { city: City }) => {
    const [mapStyle, setMapStyle] = useState(localStorage.getItem("mapStyle") || "ms");
    const [adsEnabled, setAdsEnabled] = useState(localStorage.getItem("ads") === "true");
    const [canBeEnabled, setCanBeEnabled] = useState<boolean>();
    const { pathname } = useLocation();
    const { i18n, t } = useTranslation("settings");
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
            toast(t("Adblock alert") as string, {
                icon: <MoneyOff color="error" />,
                duration: 4000
            });
        });
    }, [pathname]);

    return <Routes>
        <Route path="map" element={<Box sx={{ textAlign: "center", width: "90%", mx: "auto" }}>
            <h1 style={{ fontWeight: "normal" }}>{t("Change map style") as string}</h1>
            <List>
                {Object.values(styles).map(style => <ListItemButton key={style.id} disabled={mapStyle === style.id} onClick={() => {
                    setMapStyle(style.id);
                    localStorage.setItem("mapStyle", style.id);
                }}>
                    <ListItemIcon><Map /></ListItemIcon>
                    <ListItemText primary={style.name} />
                    <NavigateNext />
                </ListItemButton>)}
            </List>
        </Box>} />

        <Route path="language" element={<Box sx={{ textAlign: "center", width: "90%", mx: "auto" }}>
            <h1 style={{ fontWeight: "normal" }}>{t("Change language") as string}</h1>
            <List>
                {Object.values(translations).map(lang => <ListItemButton key={lang.info.code} disabled={localStorage.getItem("lang") === lang.info.code} onClick={() => {
                    i18n.changeLanguage(lang.info.code);
                    localStorage.setItem("lang", lang.info.code);
                }}>
                    <ListItemAvatar><Avatar sx={{ width: 30, height: 30 }} src={lang.info.img} /></ListItemAvatar>
                    <ListItemText primary={lang.info.name} />
                    <NavigateNext />
                </ListItemButton>)}
            </List>
            <Button variant="text" href="https://github.com/DomeQdev/zbiorkom.live-v3/blob/main/src/util/translations.json" target="_blank">{t("Contribute lang") as string}</Button>
        </Box>} />

        <Route path="markers" element={<Box sx={{ textAlign: "center", width: "90%", mx: "auto" }}>
            <h1 style={{ fontWeight: "normal" }}>{t("Customize vehicle markers") as string}</h1>
            <FormGroup>
                <FormControlLabel control={<Switch />} label={t("Show brigade") as string} />
                <FormHelperText>{t("Brigade explanation") as string}</FormHelperText>
                <FormControlLabel control={<Switch />} label={t("Show vehicle number") as string} />

                <FormHelperText>{t("Vehicle number explanation") as string}</FormHelperText>
            </FormGroup>
            <Divider />
            <i>*to jeszcze nie działa*</i>
        </Box>} />

        <Route path="ads" element={<Box sx={{ textAlign: "center", width: "90%", mx: "auto" }}>
            <h1 style={{ fontWeight: "normal" }}>{t("Ads settings") as string}</h1>
            <Button
                variant="contained"
                startIcon={adsEnabled ? <ThumbDownAlt /> : <ThumbUpAlt />}
                color={adsEnabled ? "error" : "primary"}
                disabled={!canBeEnabled}
                onClick={() => {
                    setAdsEnabled(!adsEnabled);
                    toast(t(adsEnabled ? "Ads disabled" : "Ads enabled") as string, {
                        icon: adsEnabled ? <MoneyOff color="error" /> : <Celebration color="primary" />,
                        duration: 4000
                    });
                    localStorage.setItem("ads", (!adsEnabled).toString());
                }}
            >
                {t(`${adsEnabled ? "Disable" : "Enable"} ads`) as string}
            </Button>
        </Box>} />

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
                <ListItemButton component={Link} to="/city">
                    <ListItemIcon><LocationCity /></ListItemIcon>
                    <ListItemText primary={t("Change city") as string} />
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
                <Divider />
                <ListItemButton component={Link} to="markers">
                    <ListItemIcon><MinorCrash /></ListItemIcon>
                    <ListItemText primary={t("Customize vehicle markers") as string} />
                    <NavigateNext />
                </ListItemButton>
                <Divider />
                <ListItemButton component={Link} to="ads">
                    <ListItemIcon><AdUnits /></ListItemIcon>
                    <ListItemText primary={t("Ads settings") as string} />
                    <NavigateNext />
                </ListItemButton>
            </List>
        </>} />
    </Routes>;
};