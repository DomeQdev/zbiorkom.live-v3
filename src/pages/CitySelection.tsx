import { Box, Button, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ArrowBack, LocationCity, NavigateNext } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { City } from "../util/typings";
import cities from "../util/cities.json";

export default () => {
    const navigate = useNavigate();

    return <Box sx={{ textAlign: "center" }}>
        <h1 style={{ fontWeight: "normal" }}>Zmiana miasta</h1>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/", { replace: true })}>Wróć</Button>
        <List sx={{ width: "90%", mx: "auto" }}>
            {Object.keys(cities).map(city => <ListItemButton key={city} onClick={(e) => {
                navigate(`/${city}`);
                if (!e.shiftKey) localStorage.setItem("city", city);
            }}>
                <ListItemIcon><LocationCity /></ListItemIcon>
                <ListItemText primary={cities[city as City].name} />
                <NavigateNext />
            </ListItemButton>)}
        </List>
    </Box>;
};