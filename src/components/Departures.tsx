import { BusAlert, Logout } from "@mui/icons-material";
import { Divider, List, ListItem, ListItemButton, ListItemText, Skeleton } from "@mui/material";
import { City, Departure, StopDepartures } from "../util/typings";
import { minutesUntil } from "../pages/Map/Vehicle";
import VehicleHeadsign from "./VehicleHeadsign";
import isDark from "../util/isDark";

export default ({ departures, city, onClick }: { departures?: StopDepartures, city: City, onClick?: (departure: Departure) => void }) => {
    const darkMode = isDark();

    return departures ? departures.departures.length ? <List>
        {departures.departures.map<React.ReactNode>((departure, i) => <div key={i}>
            <ListItemButton onClick={() => onClick?.(departure)}>
                <ListItemText
                    primary={<VehicleHeadsign type={departure.type} route={departure.route} headsign={departure.headsign} city={city} />}
                    secondary={<span style={{ display: "inline-flex", alignItems: "center" }}>
                        {Math.floor(departure.delay / 60000)
                            ? <b style={{ color: darkMode ? "#F26663" : "red" }}>{Math.abs(Math.floor(departure.delay / 60000))} min {departure.delay > 0 ? "opóźnienia" : "przed czasem"}</b>
                            : <b style={{ color: departure.status === "REALTIME" ? darkMode ? "#90EE90" : "green" : "" }}>{departure.status === "REALTIME" ? "Planowo" : "Według rozkładu"}</b>
                        }
                        &nbsp;·&nbsp;
                        {departure.isLastStop ? <span style={{ display: "inline-flex", alignItems: "center" }}><Logout sx={{ width: 18, height: 18 }} />&nbsp;Dla wysiadających</span> : <span style={{ textDecoration: Math.floor(departure.delay / 60000) ? "line-through" : "" }}>{new Date(departure.scheduledTime).toLocaleTimeString("pl", { hour12: false, hour: "2-digit", minute: "2-digit" })}</span>}
                        {departure.platform && <>&nbsp;· Peron&nbsp;<b>{departure.platform}</b></>}
                    </span>}
                />
                <ListItemText
                    sx={{ textAlign: "right" }}
                    primary={<b>{minutesUntil(departure.realTime)}</b>}
                    secondary="min"
                />
            </ListItemButton>
        </div>).reduce((prev, curr, i) => [prev, <Divider key={`divi-${i}`} />, curr])}
    </List> : <div style={{ textAlign: "center" }}>
        <BusAlert color="primary" sx={{ width: 60, height: 60, marginTop: 1 }} /><br />
        <b style={{ fontSize: 17 }}>Brak odjazdów w najbliższym czasie.</b>
    </div> : <List>
        {new Array(7).fill(0).map<React.ReactNode>((_, i) => <ListItem key={i}>
            <ListItemText
                primary={<VehicleHeadsign skeletonWidth={120} />}
                secondary={<Skeleton variant="text" width={120} height={20} />}
            />
        </ListItem>).reduce((prev, curr, i) => [prev, <Divider key={`div-${i}`} />, curr])}
    </List>;
};