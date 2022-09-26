import { List, ListItemAvatar, ListItemText, Avatar, ListItemButton, Divider, Button } from "@mui/material";
import { Map, DepartureBoard, CalendarMonth, DirectionsBike, LocalParking, Error, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { City } from "../util/typings";
import cities from "../util/cities.json";

export default ({ city }: { city: City }) => {
    const navigate = useNavigate();
    const cityData = cities[city];

    return <div style={{ width: "100%", textAlign: "center" }}>
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
            <Divider />
            <ListItemButton onClick={() => navigate("settings")}>
                <ListItemAvatar>
                    <Avatar>
                        <Settings />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Ustawienia" />
            </ListItemButton>
        </List>
        <Button variant="text" href="https://discord.gg/QYRswCH6Gw" target="_blank">Discord</Button>・<Button variant="text" disabled>Instagram 👀</Button>
    </div>;
};