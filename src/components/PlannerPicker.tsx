import { Box, Button, Dialog, Fab, Slide, FormControl, FormControlLabel, IconButton, InputAdornment, Radio, RadioGroup, Slider, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { LastPage, Start, ImportExport, DirectionsBike, Accessible, AcUnit, ArrowForward, KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { forwardRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TransitionProps } from "@mui/material/transitions";
import { City, PlannerOptions } from '../util/typings';
import PlaceSearch from "./PlaceSearch";
import TempDrawer from "./TempDrawer";

const Transition = forwardRef((
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>
) => <Slide direction="up" ref={ref} {...props} />);

export default ({ city, options, setOptions }: { city: City, options: PlannerOptions, setOptions: (options: PlannerOptions) => void }) => {
    const { state } = useLocation();
    const navigate = useNavigate();

    return <>
        <Box sx={{
            textAlign: "center",
            marginTop: 3,
            marginLeft: "auto",
            marginRight: "auto",
            ["@media (max-width: 599px)"]: {
                width: "90%"
            },
            ["@media (min-width: 600px)"]: {
                width: "70%"
            }
        }}>
            <Box sx={{ position: "relative" }}>
                <TextField
                    fullWidth
                    autoFocus
                    value={options.fromName}
                    onClick={() => navigate(".", { state: "from" })}
                    onKeyDown={(e) => e.key === "Enter" && navigate(".", { state: "from" })}
                    sx={{ cursor: "pointer" }}
                    InputProps={{
                        readOnly: true,
                        startAdornment: <InputAdornment position="start"><Start /></InputAdornment>
                    }}
                />
                <TextField
                    fullWidth
                    value={options.toName}
                    sx={{ marginTop: 1, cursor: "pointer" }}
                    onClick={() => navigate(".", { state: "to" })}
                    onKeyDown={(e) => e.key === "Enter" && navigate(".", { state: "to" })}
                    InputProps={{
                        readOnly: true,
                        startAdornment: <InputAdornment position="start"><LastPage /></InputAdornment>
                    }}
                />
                <IconButton
                    onClick={() => {
                        setOptions({
                            ...options,
                            from: options.to,
                            to: options.from,
                            fromName: options.toName,
                            toName: options.fromName
                        });
                    }}
                    size="small"
                    sx={{
                        top: "39%",
                        right: "0%",
                        position: "absolute",
                        borderRadius: "0%",
                        borderTopLeftRadius: "40%",
                        borderBottomLeftRadius: "40%",
                        zIndex: 15,
                        padding: "0.2rem 0.3rem 0.2em 0.5em",
                        color: "white",
                        backgroundColor: "rgba(170, 170, 170, 0.9)",
                        ":hover": {
                            backgroundColor: "rgba(170, 170, 170, 1)"
                        }
                    }}
                >
                    <ImportExport fontSize="small" />
                </IconButton>
            </Box>
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
                <Button variant="outlined" size="small" endIcon={<KeyboardArrowDown />} onClick={() => navigate(".", { state: "time" })}>
                    Odjazd o 21:37
                </Button>
                <Button variant="outlined" size="small" endIcon={<KeyboardArrowRight />} onClick={() => setOptions({ ...options, type: options.type === "quick" ? "optimised" : options.type === "optimised" ? "transfers" : "quick" })} sx={{ marginX: 1 }}>
                    {options.type === "quick" ? "Najszybsza trasa" : options.type === "optimised" ? "Zoptymalizowana" : "Mniej przesiadek"}
                </Button>
                <Button variant="outlined" size="small" endIcon={<KeyboardArrowDown />} onClick={() => navigate(".", { state: "options" })}>
                    Opcje
                </Button>
            </Box>
        </Box>

        <Dialog open={state === "from"} fullScreen TransitionComponent={Transition}>
            <PlaceSearch city={city} placeholder="Miejsce początkowe" onData={(name, location) => {
                setOptions({ ...options, from: location, fromName: name });
                navigate(".", { state: options.to ? null : "to", replace: true });
            }} />
        </Dialog>

        <Dialog open={state === "to"} fullScreen TransitionComponent={Transition}>
            <PlaceSearch city={city} placeholder="Miejsce docelowe" onData={(name, location) => {
                setOptions({ ...options, to: location, toName: name });
                navigate(".", { state: null, replace: true });
            }} />
        </Dialog>

        <TempDrawer open={state === "options"} onClose={() => navigate(".", { replace: true })} padding>
            <Typography gutterBottom sx={{ marginBottom: -1 }}>Limit liczby przesiadek</Typography>
            <Slider
                value={options.transfers}
                onChange={(e, v) => setOptions({ ...options, transfers: v as PlannerOptions["transfers"] })}
                valueLabelDisplay="auto"
                step={1}
                min={0}
                max={4}
                marks
            />

            <Typography gutterBottom sx={{ marginTop: 1 }}>Udogodnienia</Typography>
            <ToggleButtonGroup
                value={options.facilities}
                onChange={(e, v) => setOptions({ ...options, facilities: v as PlannerOptions["facilities"] })}
            >
                <ToggleButton value="wheelchair"><Accessible /></ToggleButton>
                <ToggleButton value="ac"><AcUnit /></ToggleButton>
                <ToggleButton value="bike"><DirectionsBike /></ToggleButton>
            </ToggleButtonGroup>

            <Button variant="contained" sx={{ width: "100%", marginTop: 2 }} onClick={() => navigate(".", { replace: true })}>Zapisz</Button>
        </TempDrawer>

        {(options.from && options.to) && <Fab
            sx={{ position: "absolute", bottom: 20, marginLeft: "auto", marginRight: "auto", left: 0, right: 0, zIndex: 0 }}
            color="primary"
            onClick={() => {
                navigate("results", { replace: true, state: options });
            }}
        >
            <ArrowForward />
        </Fab>}
    </>;
};