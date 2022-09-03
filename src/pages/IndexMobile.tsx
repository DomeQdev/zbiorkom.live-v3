import { List, ListItemAvatar, ListItemText, Avatar, ListItemButton, Divider } from "@mui/material";
import { Map, DepartureBoard, CalendarMonth, DirectionsBike, LocalParking, Error, Directions } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { City } from "../util/typings";
import cities from "../util/cities.json";

export default ({ city }: { city: City }) => {
    const navigate = useNavigate();
    const cityData = cities[city];

    return <div style={{ width: "100%", textAlign: "center" }}>
        <img src={cityData.image} width="100" height="100" style={{ marginTop: 15 }} />
        <h1>{cityData.name}</h1>
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
                </ListItemButton>
            </>}
            {cityData.api.brigades && <><Divider />
                <ListItemButton onClick={() => navigate("brigades")}>
                    <ListItemAvatar>
                        <Avatar>
                            <CalendarMonth />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Rozkład brygad" />
                </ListItemButton>
            </>}
            {cityData.api.bikes && <><Divider />
                <ListItemButton onClick={() => navigate("bikes")}>
                    <ListItemAvatar>
                        <Avatar>
                            <DirectionsBike />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Rowery miejskie" />
                </ListItemButton>
            </>}
            {cityData.api.parkings && <><Divider />
                <ListItemButton onClick={() => navigate("parkings")}>
                    <ListItemAvatar>
                        <Avatar>
                            <LocalParking />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Parkingi" />
                </ListItemButton>
            </>}
            {cityData.api.alerts && <><Divider />
                <ListItemButton onClick={() => navigate("alerts")}>
                    <ListItemAvatar>
                        <Avatar>
                            <Error />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Utrudnienia" />
                </ListItemButton>
            </>}
        </List>
        <p>{cityData.note}</p>
    </div>;
};