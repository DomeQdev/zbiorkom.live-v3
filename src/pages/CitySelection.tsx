import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { LocationCity, NavigateNext } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { City } from "../util/typings";
import cities from "../util/cities.json";

export default () => {
    const { t } = useTranslation("settings");

    return <Box sx={{ textAlign: "center" }}>
        <h1 style={{ fontWeight: "normal" }}>{t("Change city") as string}</h1>
        <List sx={{ width: "90%", mx: "auto" }}>
            {Object.keys(cities).map(city => <ListItemButton key={city} component={Link} to={`/${city}`} onClick={() => {
                localStorage.setItem("city", city);
                window.location.href = `/${city}`;
            }}>
                <ListItemIcon><LocationCity /></ListItemIcon>
                <ListItemText primary={cities[city as City].name} />
                <NavigateNext />
            </ListItemButton>)}
        </List>
    </Box>;
};