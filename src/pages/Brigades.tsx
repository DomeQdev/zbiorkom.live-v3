import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, IconButton, Slide, Skeleton, Grid, Box, Divider, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { City, RouteType } from "../util/typings";
import { Color, Name } from "../components/Icons";
import { getData } from "../util/api";

export default ({ city }: { city: City }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [routes, setRoutes] = useState<RouteType[]>();
    const [selectedBrigades, setSelectedBrigades] = useState<string[] | null>();

    useEffect(() => {
        getData("routes", city, "?brigade=1").then(setRoutes).catch(() => {
            toast.error("Nie mogliśmy pobrać linii...");
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

    return <Box sx={{
        textAlign: "center",
        mx: "auto",
        width: "90%"
    }}>
        <h1 style={{ fontWeight: "normal" }}>Rozkład brygad</h1>
        {routes ? routes.map((type) => <Box key={type.type}>
            <h2 style={{ fontWeight: "normal", marginBottom: 0 }}>{Name(type.type)}</h2>
            <Divider />
            {type.routes.map((route, i) => <Button
                key={`b-${i}`}
                sx={{
                    height: 30,
                    fontSize: 16,
                    margin: 0.6,
                    borderRadius: 25,
                    color: "white",
                    backgroundColor: Color(type.type, city),
                    ":hover": {
                        color: "white",
                        backgroundColor: Color(type.type, city)
                    }
                }}
                component={Link}
                to="."
                state={route.id}
            >{route.name}</Button>)}
        </Box>) : <Grid container justifyContent="center">{new Array(30).fill(null).map((_, i) => <Skeleton key={`1_${i}`} variant="rounded" width={64} height={30} sx={{ margin: "4.8px", borderRadius: "15px" }} />)}</Grid>}

        <Dialog
            open={!!state}
            onClose={() => navigate(".", { state: null, replace: true })}
            scroll="paper"
            fullWidth
            TransitionComponent={Slide}
        >
            <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Wybierz brygadę dla linii <b>{state as string}</b></span><IconButton onClick={() => navigate(".", { state: null, replace: true })}><Close /></IconButton></DialogTitle>
            <DialogContent dividers>
                <Box sx={{ textAlign: "center" }}>
                    {selectedBrigades ? selectedBrigades.length ? selectedBrigades.map(brigade => <Button
                        key={brigade}
                        component={Link}
                        variant="outlined"
                        to={`../brigade/${state}/${brigade}`}
                        sx={{ width: 70, height: 40, fontSize: 18, margin: 0.5 }}
                    >{brigade}</Button>) : <h4>Nie mogliśmy znaleźć rozkładu dla tej linii...</h4> : <Grid container justifyContent="center">{new Array(20).fill(null).map((_, i) => <Skeleton key={`1_${i}`} variant="rounded" width={70} height={40} sx={{ margin: 0.5 }} />)}</Grid>}
                </Box>
            </DialogContent>
        </Dialog>
    </Box>;
};