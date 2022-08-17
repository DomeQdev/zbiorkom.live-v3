import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, ToggleButton, IconButton, Slide } from "@mui/material";
import { Close } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { City, Route } from "../util/typings";
import { getData } from "../util/api";
import { Backdrop } from "../components/Suspense";
import { Icon } from "../components/Icons";
import styled from "@emotion/styled";
import isDark from "../util/isDark";

const darkMode = isDark();
const Line = styled(ToggleButton)((props: {
    textcolor: string,
    backgroundcolor: string
}) => ({
    width: 110,
    height: 50,
    fontSize: 20,
    margin: 5,
    borderRadius: 15,
    color: darkMode ? props.textcolor : props.backgroundcolor,
    backgroundColor: darkMode ? props.backgroundcolor : props.textcolor,
    borderColor: darkMode ? props.textcolor : props.backgroundcolor,
    "&:hover": {
        color: darkMode ? props.backgroundcolor : props.textcolor,
        backgroundColor: darkMode ? props.textcolor : props.backgroundcolor,
        borderColor: darkMode ? props.backgroundcolor : props.textcolor
    }
}));

export default ({ city }: { city: City }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [routes, setRoutes] = useState<Route[]>();
    const [selectedBrigades, setSelectedBrigades] = useState<string[] | null>();

    useEffect(() => {
        getData("routes", city, "?brigade=1").then(setRoutes).catch(() => {
            toast.error("Nie mogliśmy pobrać linii...");
            return navigate("../", { replace: true });
        });
    }, []);

    useEffect(() => {
        if (!state) return setSelectedBrigades(null);
        getData("brigades", city, {
            line: state
        }).then(setSelectedBrigades).catch(() => {
            toast.error("Nie mogliśmy pobrać brygad...");
            navigate(".", { state: null, replace: true });
        });
    }, [state]);

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
                navigate(".", { state: route.line });
            }}
        >
            <Icon type={route.type} style={{ width: 21, height: 21 }} />&nbsp;{route.line.replace("-", "")}
        </Line>)}

        <Dialog
            open={!!state}
            onClose={() => navigate(".", { state: null, replace: true })}
            scroll="paper"
            fullWidth
            TransitionComponent={Slide}
        >
            <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Wybierz brygadę dla linii <b>{state as string}</b></span><IconButton onClick={() => navigate(".", { state: null, replace: true })}><Close /></IconButton></DialogTitle>
            <DialogContent dividers>
                {selectedBrigades ? <div style={{ textAlign: "center" }}>
                    {selectedBrigades.length ? selectedBrigades.map(brigade => <ToggleButton
                        value={brigade}
                        key={brigade}
                        onClick={() => navigate(`../brigade/${state}/${brigade}`)}
                        sx={{ width: 70, height: 40, fontSize: 18, margin: 0.5 }}
                    >{brigade}</ToggleButton>) : <h4>Nie mogliśmy znaleźć rozkładu dla tej linii...</h4>}
                </div> : <Backdrop />}
            </DialogContent>
        </Dialog>
    </div> : <Backdrop />;
};