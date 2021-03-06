import { List, ListItemAvatar, ListItemText, Avatar, Box, ListItemButton, Divider } from "@mui/material";
import { Map, DepartureBoard, CalendarMonth, DirectionsBike, LocalParking, Error } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { City } from "../util/typings";
import cities from "../cities.json";

export default ({ city }: { city: City }) => {
    const navigate = useNavigate();
    const cityData = cities[city];

    return <div style={{ width: "100%", textAlign: "center" }}>
        // widok na urządzenia {">600px"}, kiedyś to będzie lepiej wyglądać
        <List>
            <ListItemButton onClick={() => navigate("map")}>
                <ListItemAvatar>
                    <Avatar>
                        <Map />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Mapa" />
            </ListItemButton>
            {cityData.api.stops && <><Divider />
                <ListItemButton onClick={() => navigate("stops")}>
                    <ListItemAvatar>
                        <Avatar>
                            <DepartureBoard />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Rozkład przystanku" />
                </ListItemButton></>}
            {cityData.api.brigades && <><Divider />
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
        <p>{cityData.note}</p>
    </div>;
};