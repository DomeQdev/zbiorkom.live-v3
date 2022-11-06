import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Map, NavigateNext } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import styles from "../../util/styles.json";

export default () => {
    const [mapStyle, setMapStyle] = useState<string>(localStorage.getItem("mapStyle") || "ms");
    const { t } = useTranslation("settings");

    return <Box sx={{ textAlign: "center", width: "90%", mx: "auto" }}>
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
    </Box>;
}