import { Box, Button, Checkbox, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Celebration, MoneyOff, ThumbDownAlt, ThumbUpAlt } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default () => {
    const [canBeEnabled, setCanBeEnabled] = useState<boolean>();
    const [adsEnabled, setAdsEnabled] = useState<boolean>(localStorage.getItem("ads") === "true");
    const [adsPlaces, setAdsPlaces] = useState<string[]>(JSON.parse(localStorage.getItem("ads_places") || "[]"));
    const { pathname } = useLocation();
    const { t } = useTranslation("settings");

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

    return <Box sx={{ textAlign: "center", width: "90%", mx: "auto" }}>
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

        <p>
            <b>Aż 3 zł dziennie za 3 kliknięcia! 🤑</b> Tyle możesz nam dać pieniędzy za kliknięcie w reklamę z rana 🌄, po południu 🌞 i wieczorem 🌝!<br />
            Dzięki reklamom <b>wszystkie funkcje 🚀</b> są bezpłatne dla Ciebie i tysiąca innych osób. 👀
        </p>

        <Collapse in={adsEnabled}>
            <List>
                <h2 style={{ fontWeight: "normal" }}>Miejsca wyświetlania reklam:</h2>
                {[["index", "Strona główna"], ["alerts", "Lista komunikatów"], ["alert", "Komunikaty"], ["stop", "Rozkład przystanku"]].map(place => <ListItemButton
                    key={place[0]}
                    onClick={() => {
                        if (adsPlaces.includes(place[0])) {
                            setAdsPlaces(adsPlaces.filter(p => p !== place[0]));
                            localStorage.setItem("ads_places", JSON.stringify(adsPlaces.filter(p => p !== place[0])));
                        } else {
                            setAdsPlaces([...adsPlaces, place[0]]);
                            localStorage.setItem("ads_places", JSON.stringify([...adsPlaces, place[0]]));
                        }
                    }}
                >
                    <ListItemIcon>
                        <Checkbox checked={!adsPlaces.length || adsPlaces.includes(place[0])} />
                    </ListItemIcon>
                    <ListItemText primary={place[1]} />
                </ListItemButton>)}
                <i>Nigdy nie wyświetlimy reklam na mapie.</i>
            </List>
        </Collapse>
    </Box>;
};