import { List, ListItemAvatar, ListItemText, Avatar, ListItemButton, Divider, Button } from "@mui/material";
import { Map, DepartureBoard, CalendarMonth, DirectionsBike, LocalParking, Error, Settings } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { City } from "../util/typings";
import cities from "../util/cities.json";

export default ({ city }: { city: City }) => {
    const cityData = cities[city];

    return <div style={{ width: "100%", textAlign: "center" }}>
        <List>
            <ListItemButton component={Link} to="map" >
                <ListItemAvatar>
                    <Avatar>
                        <Map />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Mapa" />
            </ListItemButton>
            {cityData.api.stops && <><Divider />
                <ListItemButton component={Link} to="stops">
                    <ListItemAvatar>
                        <Avatar>
                            <DepartureBoard />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Rozkład przystanku" />
                </ListItemButton>
            </>}
            {cityData.api.brigades && <><Divider />
                <ListItemButton component={Link} to="brigades">
                    <ListItemAvatar>
                        <Avatar>
                            <CalendarMonth />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Rozkład brygad" />
                </ListItemButton>
            </>}
            {cityData.api.bikes && <><Divider />
                <ListItemButton component={Link} to="bikes">
                    <ListItemAvatar>
                        <Avatar>
                            <DirectionsBike />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Rowery miejskie" />
                </ListItemButton>
            </>}
            {cityData.api.parkings && <><Divider />
                <ListItemButton component={Link} to="parkings">
                    <ListItemAvatar>
                        <Avatar>
                            <LocalParking />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Parkingi" />
                </ListItemButton>
            </>}
            {cityData.api.alerts && <><Divider />
                <ListItemButton component={Link} to="alerts">
                    <ListItemAvatar>
                        <Avatar>
                            <Error />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Utrudnienia" />
                </ListItemButton>
            </>}
            <Divider />
            <ListItemButton component={Link} to="settings">
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