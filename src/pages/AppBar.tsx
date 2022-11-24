import { AppBar, Avatar, Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, SwipeableDrawer, Toolbar, Typography, Zoom } from "@mui/material";
import { ArrowBack, CalendarMonth, DepartureBoard, DirectionsBus, Error, Map, Menu, MoreVert, Search, Settings } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { City } from "../util/typings";
import { useMemo, useState } from "react";
import cities from "../util/cities.json";

export default ({ city, title, icon, iconType }: { city: City, title?: React.ReactNode, icon?: (target: EventTarget) => any, iconType?: "moreVert" | "search" }) => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const cityData = cities[city];

    const menu = useMemo(() => location.pathname.split("/").filter(x => x).length <= 2 && !location.state && !location.search, [location]);

    return <>
        <AppBar sx={{
            transform: "translateX(-50%)",
            backgroundColor: "#5aa159",
            width: "calc(100% - 25px)",
            left: "50%",
            borderRadius: 3,
            my: 1
        }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton
                    size="large"
                    sx={{ color: "#fff" }}
                    onClick={() => {
                        if (location.search.includes("back=true")) window.history.back();
                        if (menu) setOpen(true);
                        else navigate(location.state || location.search ? "." : "../", { state: undefined, relative: "path", replace: true });
                    }}
                >
                    {menu ? <Menu /> : <ArrowBack />}
                </IconButton>
                <Typography
                    variant="h6"
                    component={Link}
                    to={`/${city}`}
                    sx={{ color: "#fff", flexGrow: 1, left: "50%", position: "absolute", transform: "translate(-50%, 0)", display: "inline-flex", alignItems: "center" }}
                >
                    {title || <><DirectionsBus />&nbsp;{title || "zbiorkom.live"}</>}
                </Typography>
                <Zoom in={!!icon}>
                    <IconButton
                        size="large"
                        sx={{ color: "#fff", float: "right", border: "1px solid white" }}
                        onClick={e => icon?.(e.currentTarget)}
                    >
                        {iconType === "moreVert" ? <MoreVert /> : <Search />}
                    </IconButton>
                </Zoom>
            </Toolbar>
        </AppBar>
        <SwipeableDrawer
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
                <Typography variant="h5" sx={{ display: "inline-flex", alignItems: "center" }} color="primary">
                    <DirectionsBus color="primary" fontSize="large" />&nbsp;zbiorkom.live
                </Typography>
                <br />
                <Typography variant="subtitle2">{cityData.name}</Typography>
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
                {cityData.functions.includes("brigades") && <><Divider />
                    <ListItemButton component={Link} to={`/${city}/brigades`} onClick={() => setOpen(false)}>
                        <ListItemAvatar>
                            <Avatar>
                                <CalendarMonth />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={t("Brigade schedule") as string} />
                    </ListItemButton>
                </>}
                {cityData.functions.includes("alerts") && <><Divider />
                    <ListItemButton component={Link} to={`/${city}/alerts`} onClick={() => setOpen(false)}>
                        <ListItemAvatar>
                            <Avatar>
                                <Error />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={t("Issues") as string} />
                    </ListItemButton>
                </>}
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
                        secondary={<>Made with ❤️ by DomeQ<br />&copy; zbiorkom.live 2020 - 2022</>}
                    />
                </ListItem>
            </List>
        </SwipeableDrawer></>;
};