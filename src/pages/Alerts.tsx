import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { List, Divider, ListItem, ListItemButton, ListItemText, Skeleton, Box, Badge } from "@mui/material";
import { NavigateNext, TaskAlt } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { Alert, City } from "../util/typings";
import { getData } from "../util/api";

export default ({ city }: { city: City }) => {
    const [alerts, setAlerts] = useState<Alert[]>();

    const AlertCard = ({ alert }: { alert: Alert }) => <ListItemButton component={Link} to={`../alert?alert=${alert.id}`}>
        <ListItemText
            primary={<>{alert.impediment ? <Badge color="primary" badgeContent=" " variant="dot" sx={{ "& .MuiBadge-badge": { backgroundColor: "red" } }} anchorOrigin={{
                vertical: 'top',
                horizontal: 'left'
            }}>{alert.title}</Badge> : alert.title}</>}
            secondary={<>
                {alert.routes && <>Dotyczy linii: {alert.routes?.join(", ")}<br /></>}
                {alert.start && <>Od {new Date(alert.start).toLocaleString()}</>}
                {alert.end && <> do {new Date(alert.end).toLocaleString()}<br /></>}
            </>} />
        <NavigateNext />
    </ListItemButton>;

    const AlertCardSkeleton = () => <ListItem>
        <ListItemText
            primary={<Skeleton variant="text" width={300} height={24} />}
            secondary={<>
                <Skeleton variant="text" width={200} height={20} />
                <Skeleton variant="text" width={200} height={20} />
                <Skeleton variant="text" width={200} height={20} />
            </>}
        />
        <Skeleton variant="circular" width={24} height={24} />
    </ListItem>;

    useEffect(() => {
        getData("alerts", city).then(setAlerts).catch(() => {
            toast.error("Nie mogliśmy pobrać utrudnień...");
            setAlerts([]);
        });
    }, []);

    return <Box sx={{ textAlign: "center" }}>
        <h1 style={{ fontWeight: "normal" }}>Komunikaty</h1>
        <List>
            {alerts ? <List>
                {alerts.length ? <>
                    {alerts.sort((a, b) => (a.impediment === b.impediment) ? 0 : a.impediment ? -1 : 1).map<React.ReactNode>(alert => <AlertCard alert={alert} key={alert.id} />).reduce((prev, curr, i) => [prev, <Divider key={i} />, curr])}
                </> : <>
                    <TaskAlt color="primary" sx={{ width: 60, height: 60 }} /><br />
                    <b style={{ fontSize: 17 }}>Brak komunikatów.</b>
                </>}
            </List> : <>
                <AlertCardSkeleton />
                <Divider />
                <AlertCardSkeleton />
            </>}
        </List>
    </Box>;
};