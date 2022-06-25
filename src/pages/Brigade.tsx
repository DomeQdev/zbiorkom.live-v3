import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { List, ListItemButton, ListItemText, Divider, Button, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { BrigadeSchedule, City } from "../typings";
import { toast } from "react-toastify";
import { Backdrop } from "../components/Suspense";
import cities from "../cities.json";

export default ({ city }: { city: City }) => {
    const cityData = cities[city];
    const navigate = useNavigate();
    const { line, brigade } = useParams();
    const [schedule, setSchedule] = useState<BrigadeSchedule[]>();

    useEffect(() => {
        fetch(cityData.api.brigade_schedule!.replace("{{line}}", line!).replace("{{brigade}}", brigade!)).then(res => res.json()).then(setSchedule).catch(() => {
            toast.error("Nie mogliśmy pobrać rozkładu brygad...");
            return navigate("/");
        });
    }, [line, brigade]);

    return <div style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto", width: "80%" }} className="brigade_schedule">
        <h1 style={{ fontWeight: "normal" }}>Rozkład brygady <b>{line}</b>/{brigade}</h1>

        <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => window.history.back()}>Wróć</Button>

        {schedule ? (schedule.length ? <List>{schedule.map<React.ReactNode>(sched => <ListItemButton>
            <ListItemText primary={<Typography noWrap>{sched.headsign}</Typography>} secondary={<>z przystanku {sched.firstStop}</>} />
            <span>{timeString(sched.start)} - {timeString(sched.end)}</span>
        </ListItemButton>).reduce((prev, curr, i) => [prev, <Divider key={i} textAlign="left" style={{ color: "#9ba1ab", fontSize: 14 }}>{(schedule[i].start - schedule[i - 1]!.end) / 60000 < 60 ? `Postój ${(schedule[i].start - schedule[i - 1]!.end) / 60000} min` : null}</Divider>, curr])}</List> : <h4>Nie mogliśmy znaleźć rozkładu dla tej brygady...</h4>) : <Backdrop />}
    </div>;
};

function timeString(timestamp: number) {
    let date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
}