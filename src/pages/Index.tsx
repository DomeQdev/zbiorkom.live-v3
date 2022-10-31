import { List, ListItemAvatar, ListItemText, Avatar, ListItemButton, Divider, Button } from "@mui/material";
import { Map, DepartureBoard, CalendarMonth, DirectionsBike, LocalParking, Error, Settings, DirectionsBus } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { City } from "../util/typings";
import cities from "../util/cities.json";
import Advertisment from "../components/Advertisment";

export default ({ city }: { city: City }) => {
    const { t } = useTranslation();
    const cityData = cities[city];

    return <div style={{ width: "100%", textAlign: "center" }}>
        <h1 style={{ display: "inline-flex", alignItems: "center" }}><DirectionsBus color="primary" fontSize="large" />&nbsp;{cityData.name}</h1>
        <List>
            <ListItemButton component={Link} to="map" >
                <ListItemAvatar>
                    <Avatar>
                        <Map />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("Map") as string} />
            </ListItemButton>
            {cityData.api.stops && <><Divider />
                <ListItemButton component={Link} to="stops">
                    <ListItemAvatar>
                        <Avatar>
                            <DepartureBoard />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={t("Stop schedule") as string} />
                </ListItemButton>
            </>}
            {cityData.api.brigades && <><Divider />
                <ListItemButton component={Link} to="brigades">
                    <ListItemAvatar>
                        <Avatar>
                            <CalendarMonth />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={t("Brigade schedule") as string} />
                </ListItemButton>
            </>}
            {cityData.api.bikes && <><Divider />
                <ListItemButton component={Link} to="bikes">
                    <ListItemAvatar>
                        <Avatar>
                            <DirectionsBike />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={t("Cycles") as string} />
                </ListItemButton>
            </>}
            {cityData.api.parkings && <><Divider />
                <ListItemButton component={Link} to="parkings">
                    <ListItemAvatar>
                        <Avatar>
                            <LocalParking />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={t("Parkings") as string} />
                </ListItemButton>
            </>}
            {cityData.api.alerts && <><Divider />
                <ListItemButton component={Link} to="alerts">
                    <ListItemAvatar>
                        <Avatar>
                            <Error />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={t("Issues") as string} />
                </ListItemButton>
            </>}
            <Divider />
            <Advertisment width="100%" height={125} />
            <ListItemButton component={Link} to="settings">
                <ListItemAvatar>
                    <Avatar>
                        <Settings />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("Settings") as string} />
            </ListItemButton>
        </List>
        <Button variant="text" href="https://discord.gg/QYRswCH6Gw" target="_blank">Discord</Button>
    </div>;
};