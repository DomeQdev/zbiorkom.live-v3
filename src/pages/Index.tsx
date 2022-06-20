import { List, ListItemAvatar, ListItemText, Avatar, Box, ListItemButton, Divider } from "@mui/material";
import { Map, DepartureBoard, CalendarMonth, DirectionsBike, LocalParking, Error } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import cities from "../cities.json";

export default ({ city }: { city: keyof typeof cities }) => {
    const navigate = useNavigate();
    const cityData = cities[city];

    return <div style={{ textAlign: "center", marginTop: 25 }}>
        <img src={cityData.image} width="128" height="128" />
        <h1>{cityData.name}</h1>

        <Box display="flex" justifyContent="center" alignItems="center">
            <List>
                <ListItemButton onClick={() => navigate("map")}>
                    <ListItemAvatar>
                        <Avatar>
                            <Map />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Mapa" />
                </ListItemButton>
                {(cityData.api.stops && cityData.api.stop_departures) && <><Divider />
                <ListItemButton onClick={() => navigate("stops")}>
                    <ListItemAvatar>
                        <Avatar>
                            <DepartureBoard />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Rozkład przystanku" />
                </ListItemButton></>}
                {(cityData.api.brigades && cityData.api.brigade_schedule) && <><Divider />
                <ListItemButton onClick={() => navigate("brigades")}>
                    <ListItemAvatar>
                        <Avatar>
                            <CalendarMonth />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Rozkład brygad" />
                </ListItemButton></>}
                {cityData.api.bikes && <><Divider />
                <ListItemButton onClick={() => navigate("bikes")}>
                    <ListItemAvatar>
                        <Avatar>
                            <DirectionsBike />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Rowery miejskie" />
                </ListItemButton></>}
                {cityData.api.parkings && <><Divider />
                <ListItemButton onClick={() => navigate("parkings")}>
                    <ListItemAvatar>
                        <Avatar>
                            <LocalParking />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Parkingi" />
                </ListItemButton></>}
                {cityData.api.alerts && <><Divider />
                <ListItemButton onClick={() => navigate("alerts")}>
                    <ListItemAvatar>
                        <Avatar>
                            <Error />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Utrudnienia" />
                </ListItemButton></>}
            </List>
        </Box>
        <br />
        {cityData.note}
    </div>;
};