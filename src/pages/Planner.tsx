import { LastPage, Start, GpsFixed, ImportExport, Balance, DirectionsWalk, DirectionsBike, Accessible, AcUnit, ArrowForward, SelfImprovement, KeyboardArrowDown } from "@mui/icons-material";
import { Box, Button, Dialog, Fab, Fade, FormControl, FormControlLabel, IconButton, InputAdornment, Radio, RadioGroup, Slider, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";
import PlaceSearch from "../components/PlaceSearch";
import toast from "react-hot-toast";
import styled from "@emotion/styled";

const SizedDiv = styled.div`
text-align: center;
margin-top: 15px;
margin-left: auto;
margin-right: auto;
@media (max-width: 599px) {
    width: 90%;
}
@media (min-width: 600px) {
    width: 70%;
}
`;

export default () => {
    const navigate = useNavigate();

    const [from, setFrom] = useState<[number, number]>();
    const [to, setTo] = useState<[number, number]>();
    const [fromName, setFromName] = useState<string>("Przystanek początkowy");
    const [toName, setToName] = useState<string>("Przystanek końcowy");
    const [transfers, setTransfers] = useState<number>(2);
    const [facilities, setFacilities] = useState<"wheelchair" | "ac" | "bike"[]>();
    const [type, setType] = useState<"quick" | "optimised" | "transfers">("optimised");

    return <>
        <SizedDiv style={{ marginTop: 30 }}>
            <TextField
                label="Start"
                fullWidth
                autoFocus
                value={fromName}
                onClick={({ target }) => (target as HTMLElement).tagName === "INPUT" && navigate("from")}
                InputProps={{
                    readOnly: true,
                    startAdornment: <InputAdornment position="start"><Start /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">
                        <IconButton onClick={async () => {
                            setFromName("Pobieranie lokalizacji...");
                            const location = await fetchLocation();
                            if (!location) {
                                toast.error("Nie udało się pobrać twojej lokalizacji.");
                                return setFromName(fromName);
                            }
                            setFrom(location);
                            setFromName("Twoja lokalizacja");
                        }}>
                            <GpsFixed />
                        </IconButton>
                    </InputAdornment>
                }}
            />
            <TextField
                label="Cel podróży"
                fullWidth
                value={toName}
                sx={{ marginTop: 2 }}
                onClick={({ target }) => (target as HTMLElement).tagName === "INPUT" && navigate("to")}
                InputProps={{
                    readOnly: true,
                    startAdornment: <InputAdornment position="start"><LastPage /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">
                        <IconButton onClick={() => {
                            setFrom(to);
                            setFromName(toName);
                            setTo(from);
                            setToName(fromName);
                        }}>
                            <ImportExport />
                        </IconButton>
                    </InputAdornment>
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 2,
                    width: "100%",
                    overflowX: "auto",
                    button: {
                        flex: "none"
                    }
                }}
            >
                <Button variant="outlined" size="small" endIcon={<KeyboardArrowDown />} onClick={() => navigate("time")}>
                    Odjazd o 21:37
                </Button>
                <Button variant="outlined" size="small" endIcon={<KeyboardArrowDown />} onClick={() => navigate("type")} sx={{ marginX: 1 }}>
                    {type === "quick" ? "Najszybsza trasa" : type === "optimised" ? "Najlepsza trasa" : "Mniej przesiadek"}
                </Button>
                <Button variant="outlined" size="small" endIcon={<KeyboardArrowDown />} onClick={() => navigate("options")}>
                    Opcje
                </Button>
            </Box>
        </SizedDiv>

        <Routes>
            <Route path="options" element={<BottomSheet
                open
                onDismiss={() => navigate("./")}
                header={<Typography variant="h6">Opcje</Typography>}
                footer={<Button variant="contained" sx={{ width: "100%" }} onClick={() => navigate("./")} autoFocus>Zapisz</Button>}
                style={{ textAlign: "center" }}
            >
                <Box sx={{ width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: 2, marginBottom: 2 }}>
                    <Typography gutterBottom sx={{ marginBottom: -1 }}>Maks liczba przesiadek</Typography>
                    <Slider
                        value={transfers}
                        onChange={(e, v) => setTransfers(v as number)}
                        valueLabelDisplay="auto"
                        step={1}
                        min={0}
                        max={4}
                        marks={[<SelfImprovement />, null, <Balance />, null, <DirectionsWalk />].map((icon, i) => ({ value: i, label: icon }))}
                    />

                    <Typography gutterBottom sx={{ marginTop: 3 }}>Udogodnienia</Typography>
                    <ToggleButtonGroup
                        value={facilities}
                        onChange={(e, v) => setFacilities(v as "wheelchair" | "ac" | "bike"[])}
                    >
                        <ToggleButton value="wheelchair"><Accessible /></ToggleButton>
                        <ToggleButton value="ac" disabled><AcUnit /></ToggleButton>
                        <ToggleButton value="bike"><DirectionsBike /></ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </BottomSheet>} />

            <Route path="type" element={<BottomSheet
                open
                onDismiss={() => navigate("./")}
                header={<Typography variant="h6">Typ trasy</Typography>}
                footer={<Button variant="contained" sx={{ width: "100%" }} onClick={() => navigate("./")} autoFocus>Zapisz</Button>}
                style={{ textAlign: "center" }}
            >
                <div style={{ width: "90%", marginLeft: "auto", marginRight: "auto", marginBottom: 15 }}>
                    <FormControl>
                        <RadioGroup
                            value={type}
                            onChange={(e, v) => setType(v as "quick" | "optimised" | "transfers")}
                        >
                            <FormControlLabel value="quick" control={<Radio />} label="Najszybsza trasa" />
                            <FormControlLabel value="optimised" control={<Radio />} label="Najlepsza trasa" />
                            <FormControlLabel value="transfers" control={<Radio />} label="Mniej przesiadek" />
                        </RadioGroup>
                    </FormControl>
                </div>
            </BottomSheet>} />

            <Route path="from" element={<PlaceSearch onData={(name, location) => {
                
            }} />} />
        </Routes>

        <Fade in={!!(from && to)}>
            <Fab
                sx={{ position: "absolute", bottom: 20, marginLeft: "auto", marginRight: "auto", left: 0, right: 0, zIndex: 0 }}
                color="primary"
                onClick={() => navigate(`./results?from=${from}&fromName=${fromName}&to=${to}&toName=${toName}&transfers=${transfers}&facilities=${facilities || ""}&type=${type}`)}
            >
                <ArrowForward />
            </Fab>
        </Fade>
    </>;
};

function fetchLocation(): Promise<[number, number] | null> {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            resolve([coords.latitude, coords.longitude]);
        }, () => resolve(null));
    });
}