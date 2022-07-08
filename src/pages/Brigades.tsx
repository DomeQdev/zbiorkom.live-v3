import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, ToggleButton, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { toast } from "react-toastify";
import { Backdrop } from "../components/Suspense";
import { City, Route } from "../util/typings";
import { Icon } from "../components/Icons";
import cities from "../cities.json";

export default ({ city }: { city: City }) => {
    const navigate = useNavigate();
    const cityData = cities[city];
    const [routes, setRoutes] = useState<Route[]>();
    const [selected, setSelected] = useState<Route | null>();
    const [selectedBrigades, setSelectedBrigades] = useState<string[] | null>();

    useEffect(() => {
        fetch(cityData.api.routes).then(res => res.json()).then(setRoutes).catch(() => {
            toast.error("Nie mogliśmy pobrać linii...");
            return navigate("../");
        });
    }, []);

    return routes?.length ? <div style={{ textAlign: "center", width: "90%", marginLeft: "auto", marginRight: "auto" }}>
        <h1>Rozkład brygad</h1>
        <p>Wybierz linię:</p>
        {routes?.map(route => <ToggleButton
            value={route.line}
            key={route.line}
            onClick={() => {
                setSelectedBrigades(null);
                setSelected(route);
                fetch(cityData.api.brigades!.replace("{{line}}", route.line)).then(res => res.json()).then(setSelectedBrigades).catch(() => {
                    toast.error("Nie mogliśmy pobrać brygad...");
                    return navigate("../");
                });
            }}
            style={{ width: 100, height: 50, fontSize: 20, margin: 5, color: route.color, borderColor: route.color }}
            title={`${route.line} - ${route.name}`}
        >
            <Icon type={route.type} style={{ width: 21, height: 21 }} />&nbsp;{route.line.replace("-", "")}
        </ToggleButton>)}

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
                        style={{ width: 80, height: 50, fontSize: 20, margin: 3, color: selected.color, borderColor: selected.color }}
                    >{brigade}</ToggleButton>) : <h4>Nie mogliśmy znaleźć rozkładu dla tej linii...</h4>}
                </div> : <Backdrop />}
            </DialogContent>
        </Dialog>}
    </div> : <Backdrop />;
};