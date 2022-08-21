import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { ArrowBack, Done } from "@mui/icons-material";
import { City } from "../util/typings";
import { useMap } from "react-map-gl";
import { useEffect, useState } from "react";
import Map from "./Map";

export default ({ city, onData, onDismiss }: { city: City, onData: (name: string, location: [number, number]) => void, onDismiss: () => void }) => {
    const [center, setCenter] = useState<[number, number]>();

    return <>
        <AppBar position="sticky" sx={{ bgcolor: "#5aa159" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ flex: "none" }}>
                    <Typography variant="h6" color="inherit">
                        <IconButton edge="start" color="inherit" onClick={onDismiss}><ArrowBack /></IconButton> Wybierz lokalizację
                    </Typography>
                </Box>
                <IconButton edge="end" color="inherit" onClick={() => onData("Punkt na mapie", center!)} disabled={!center}>
                    <Done />
                </IconButton>
            </Toolbar>
        </AppBar>
        <Map city={city}>
            <UseMap onCenter={setCenter} />
            <Box sx={{ position: "absolute", left: "50%", bottom: "50%", pointerEvents: "none" }}>
                <svg display="block" height="41px" width="27px" viewBox="0 0 27 41"><defs><radialGradient id="shadowGradient"><stop offset="10%" stopOpacity="0.4"></stop><stop offset="100%" stopOpacity="0.05"></stop></radialGradient></defs><ellipse cx="13.5" cy="34.8" rx="10.5" ry="5.25" fill="url(#shadowGradient)"></ellipse><path fill="#3FB1CE" d="M27,13.5C27,19.07 20.25,27 14.75,34.5C14.02,35.5 12.98,35.5 12.25,34.5C6.75,27 0,19.22 0,13.5C0,6.04 6.04,0 13.5,0C20.96,0 27,6.04 27,13.5Z"></path><path opacity="0.25" d="M13.5,0C6.04,0 0,6.04 0,13.5C0,19.22 6.75,27 12.25,34.5C13,35.52 14.02,35.5 14.75,34.5C20.25,27 27,19.07 27,13.5C27,6.04 20.96,0 13.5,0ZM13.5,1C20.42,1 26,6.58 26,13.5C26,15.9 24.5,19.18 22.22,22.74C19.95,26.3 16.71,30.14 13.94,33.91C13.74,34.18 13.61,34.32 13.5,34.44C13.39,34.32 13.26,34.18 13.06,33.91C10.28,30.13 7.41,26.31 5.02,22.77C2.62,19.23 1,15.95 1,13.5C1,6.58 6.58,1 13.5,1Z"></path><circle fill="white" cx="13.5" cy="13.5" r="5.5"></circle></svg>
            </Box>
        </Map>
    </>;
};

function UseMap({ onCenter }: { onCenter: (location: [number, number]) => void }) {
    const { current: map } = useMap();
    
    useEffect(() => {
        map?.on("moveend", () => onCenter(map.getCenter().toArray() as [number, number]));
    }, []);

    return <></>;
}