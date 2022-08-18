import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, ToggleButton, IconButton, Slide, Skeleton, Grid } from "@mui/material";
import { Close } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { City, Route } from "../util/typings";
import { getData } from "../util/api";
import { Icon } from "../components/Icons";
import styled from "@emotion/styled";
import isDark from "../util/isDark";

const darkMode = isDark();
const Line = styled(ToggleButton)((props: {
    textcolor: string,
    backgroundcolor: string
}) => ({
    width: 100,
    height: 40,
    fontSize: 20,
    margin: 5,
    borderRadius: 25,
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

    return <div style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto", width: "90%" }}>
        <h1>Rozkład brygad</h1>
        <p>Wybierz linię:</p>
        {routes?.length ? routes.map(route => <Line
            value={route.line}
            key={route.line}
            textcolor={route.text === route.color ? "#fff" : route.text}
            backgroundcolor={route.color}
            onClick={() => {
                setSelectedBrigades(null);
                navigate(".", { state: route.line });
            }}
        >
            <Icon type={route.type} style={{ width: 21, height: 21 }} />&nbsp;{route.line}
        </Line>) : <Grid container justifyContent="center">{new Array(30).fill(null).map((_, i) => <Skeleton key={`1_${i}`} variant="rounded" width={100} height={40} sx={{ margin: "5px", borderRadius: "15px" }} />)}</Grid>}

        <Dialog
            open={!!state}
            onClose={() => navigate(".", { state: null, replace: true })}
            scroll="paper"
            fullWidth
            TransitionComponent={Slide}
        >
            <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Wybierz brygadę dla linii <b>{state as string}</b></span><IconButton onClick={() => navigate(".", { state: null, replace: true })}><Close /></IconButton></DialogTitle>
            <DialogContent dividers>
                <div style={{ textAlign: "center" }}>
                    {selectedBrigades ? selectedBrigades.length ? selectedBrigades.map(brigade => <ToggleButton
                        value={brigade}
                        key={brigade}
                        onClick={() => navigate(`../brigade/${state}/${brigade}`)}
                        sx={{ width: 70, height: 40, fontSize: 18, margin: 0.5 }}
                    >{brigade}</ToggleButton>) : <h4>Nie mogliśmy znaleźć rozkładu dla tej linii...</h4> : <Grid container justifyContent="center">{new Array(20).fill(null).map((_, i) => <Skeleton key={`1_${i}`} variant="rounded" width={70} height={40} sx={{ margin: 0.5 }} />)}</Grid>}
                </div>
            </DialogContent>
        </Dialog>
    </div>;
};