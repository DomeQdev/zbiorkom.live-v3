import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, List, Divider, ListItem, ListItemButton, ListItemText, Skeleton } from "@mui/material";
import { Error, NavigateNext, ReportProblem, TaskAlt } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { Alert, City } from "../util/typings";
import { getData } from "../util/api";

export default ({ city }: { city: City }) => {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [tab, setTab] = useState<0 | 1>(0);

    const AlertCard = ({ alert }: { alert: Alert }) => <ListItemButton onClick={() => navigate(`../alert/${alert.id}`)}>
        <ListItemText
            primary={alert.title}
            secondary={<>
                uwu
                owo
                <br />
                wee
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

    const NoAlerts = ({ type }: { type: "IMPEDIMENT" | "CHANGE" }) => <>
        <TaskAlt color="primary" sx={{ width: 70, height: 70 }} /><br />
        <b style={{ fontSize: 18 }}>Brak {type === "IMPEDIMENT" ? "utrudnień" : "komunikatów"}.</b>
    </>;

    useEffect(() => {
        getData("alerts", city).then(setAlerts).catch(() => {
            toast.error("Nie mogliśmy pobrać utrudnień...");
            setAlerts([]);
        });
    }, []);

    const impediment = alerts.filter(a => a.effect === "IMPEDIMENT");
    const change = alerts.filter(a => a.effect === "CHANGE");

    return <div style={{ textAlign: "center" }}>
        <h1>Utrudnienia</h1>
        <p>Utrudnienia w kursowaniu pojazdów komunikacji miejskiej</p>
        <Tabs centered sx={{ borderBottom: 1, borderColor: "divider" }} value={tab} onChange={() => setTab(tab === 0 ? 1 : 0)}>
            <Tab icon={<Error />} label="Utrudnienia" />
            <Tab icon={<ReportProblem />} label="Komunikaty" />
        </Tabs>
        <List>
            {alerts.length ? <>
                {tab === 0 && <>
                    {impediment.length
                        ? impediment.map<React.ReactNode>(alert => <AlertCard alert={alert} key={alert.id} />).reduce((prev, curr, i) => [prev, <Divider key={i} />, curr])
                        : <NoAlerts type="IMPEDIMENT" />}
                </>}
                {tab === 1 && <>
                    {change.length
                        ? change.map<React.ReactNode>(alert => <AlertCard alert={alert} key={alert.id} />).reduce((prev, curr, i) => [prev, <Divider key={i} />, curr])
                        : <NoAlerts type="CHANGE" />}
                </>}
            </> : <>
                <AlertCardSkeleton />
                <Divider />
                <AlertCardSkeleton />
            </>}
        </List>
    </div>;
};