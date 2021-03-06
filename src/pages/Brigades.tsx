import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, ToggleButton, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { City, Route } from "../util/typings";
import { getData } from "../util/api";
import { Backdrop } from "../components/Suspense";
import { Icon } from "../components/Icons";
import styled from "@emotion/styled";

const Line = styled(ToggleButton)((props: {
    textcolor: string,
    backgroundcolor: string
}) => `
width: 110px;
height: 50px;
font-size: 20px;
margin: 5px;
border-radius: 15px;
color: ${props.backgroundcolor};
background-color: ${props.textcolor};
border-color: ${props.backgroundcolor};
:hover {
    color: ${props.textcolor};
    background-color: ${props.backgroundcolor};
    border-color: ${props.textcolor};
}
`);

export default ({ city }: { city: City }) => {
    const navigate = useNavigate();
    const [routes, setRoutes] = useState<Route[]>();
    const [selected, setSelected] = useState<Route | null>();
    const [selectedBrigades, setSelectedBrigades] = useState<string[] | null>();

    useEffect(() => {
        getData("routes", city, "?brigade=1").then(setRoutes).catch(() => {
            toast.error("Nie mogliśmy pobrać linii...");
            return navigate("../");
        });
    }, []);

    return routes?.length ? <div style={{ textAlign: "center" }}>
        <h1>Rozkład brygad</h1>
        <p>Wybierz linię:</p>
        {routes?.map(route => <Line
            value={route.line}
            key={route.line}
            textcolor={route.text === route.color ? "#fff" : route.text}
            backgroundcolor={route.color}
            onClick={() => {
                setSelectedBrigades(null);
                setSelected(route);
                getData("brigades", city, {
                    line: route.line
                }).then(setSelectedBrigades).catch(() => {
                    toast.error("Nie mogliśmy pobrać brygad...");
                    setSelected(null);
                });
            }}
        >
            <Icon type={route.type} style={{ width: 21, height: 21 }} />&nbsp;{route.line.replace("-", "")}
        </Line>)}

        {selected && <Dialog
            open
            onClose={() => setSelected(null)}
            scroll="paper"
            fullWidth
        >
            <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Wybierz brygadę dla linii <b>{selected.line}</b></span><IconButton onClick={() => setSelected(null)}><Close /></IconButton></DialogTitle>
            <DialogContent dividers>
                {selectedBrigades ? <div style={{ textAlign: "center" }}>
                    {selectedBrigades.length ? selectedBrigades.map(brigade => <ToggleButton
                        value={brigade}
                        key={brigade}
                        onClick={() => navigate(`../brigade/${selected.line}/${brigade}`)}
                        style={{ width: 70, height: 50, fontSize: 20, margin: 3, color: selected.color, borderColor: selected.color }}
                    >{brigade}</ToggleButton>) : <h4>Nie mogliśmy znaleźć rozkładu dla tej linii...</h4>}
                </div> : <Backdrop />}
            </DialogContent>
        </Dialog>}
    </div> : <Backdrop />;
};