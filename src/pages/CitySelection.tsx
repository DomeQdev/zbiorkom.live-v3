import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { LocationCity, NavigateNext } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { City } from "../util/typings";
import cities from "../util/cities.json";
import toast from "react-hot-toast";

export default () => {
    return <Box sx={{ textAlign: "center" }}>
        <h1 style={{ fontWeight: "normal" }}>Zmiana miasta</h1>
        <List sx={{ width: "90%", mx: "auto" }}>
            {Object.keys(cities).map(city => <ListItemButton key={city} component={Link} to={`/${city}`} onClick={(e) => {
                toast.success(`Zmieniono miasto na ${cities[city as City].name}.`);
                if (!e.shiftKey) localStorage.setItem("city", city)
            }}>
                <ListItemIcon><LocationCity /></ListItemIcon>
                <ListItemText primary={cities[city as City].name} />
                <NavigateNext />
            </ListItemButton>)}
        </List>
    </Box>;
};