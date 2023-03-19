import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, SwipeableDrawer, Typography } from "@mui/material";
import { CalendarMonth, DepartureBoard, DirectionsBike, DirectionsBus, Error, LocalParking, Map, Settings } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import cities from "../util/cities.json";
import { Link } from "react-router-dom";
import { City } from "../util/typings";
import isDark from "../util/isDark";

export default ({ city, open, setOpen }: { city: City, open: boolean, setOpen: (open: boolean) => void }) => {
    const { t } = useTranslation();
    const cityData = cities[city];

    return <SwipeableDrawer
        anchor="left"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        sx={{
            "& .MuiDrawer-paper": {
                minWidth: 270
            },
            zIndex: 10e6
        }}
    >
        <Box sx={{ textAlign: "center", my: 2 }} component={Link} to="/city" onClick={() => setOpen(false)}>
            <Typography variant="h5" sx={{ display: "inline-flex", alignItems: "center", color: isDark() ? "white" : "black" }}>
                <DirectionsBus color="primary" fontSize="large" />&nbsp;zbiorkom.live
            </Typography>
            <br />
            <Typography variant="subtitle2" color="primary">{cityData.name}</Typography>
        </Box>
        <Divider />
        <List>
            <ListItemButton component={Link} to={`/${city}`} onClick={() => setOpen(false)}>
                <ListItemAvatar>
                    <Avatar>
                        <Map />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("Map") as string} />
            </ListItemButton>
            <Divider />
            <ListItemButton component={Link} to={`/${city}/stops`} onClick={() => setOpen(false)}>
                <ListItemAvatar>
                    <Avatar>
                        <DepartureBoard />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("Stop schedule") as string} />
            </ListItemButton>
            {cityData?.api.brigades && <><Divider />
                <ListItemButton component={Link} to={`/${city}/brigades`} onClick={() => setOpen(false)}>
                    <ListItemAvatar>
                        <Avatar>
                            <CalendarMonth />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={t("Brigade schedule") as string} />
                </ListItemButton>
            </>}
            {/* {cityData?.api.bikes && <><Divider />
                <ListItemButton component={Link} to={`/${city}/bikes`} onClick={() => setOpen(false)}>
                    <ListItemAvatar>
                        <Avatar>
                            <DirectionsBike />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={t("Cycles") as string} />
                </ListItemButton>
            </>}
            {cityData?.api.parkings && <><Divider />
                <ListItemButton component={Link} to={`/${city}/parkings`} onClick={() => setOpen(false)}>
                    <ListItemAvatar>
                        <Avatar>
                            <LocalParking />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={t("Parkings") as string} />
                </ListItemButton>
            </>}
            {cityData?.api.alerts && <><Divider />
                <ListItemButton component={Link} to={`/${city}/alerts`} onClick={() => setOpen(false)}>
                    <ListItemAvatar>
                        <Avatar>
                            <Error />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={t("Issues") as string} />
                </ListItemButton>
            </>} */}
            <Divider />
            <ListItemButton component={Link} to={`/${city}/settings`} onClick={() => setOpen(false)}>
                <ListItemAvatar>
                    <Avatar>
                        <Settings />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={t("Settings") as string} />
            </ListItemButton>
            <ListItem>
                <ListItemText
                    secondary={<>Kontakt: admin@zbiorkom.live<br /><a href="https://discord.gg/QYRswCH6Gw" target="_blank">Dołącz do serwera Discord</a></>}
                />
            </ListItem>
        </List>
    </SwipeableDrawer>;
};