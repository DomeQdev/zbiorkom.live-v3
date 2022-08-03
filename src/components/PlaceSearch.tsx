import { Slide, TextField, Dialog, AppBar, Toolbar, IconButton, InputAdornment } from "@mui/material";
import { ArrowBack, HighlightOff } from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, ReactElement, Ref, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stop } from "../util/typings";

export default ({ onData }: { onData: (name: string, location: [number, number]) => void }) => {
    const navigate = useNavigate();
    const [input, setInput] = useState<string>();
    const [stopResults, setStopResults] = useState<Stop[]>();

    return <>
        <AppBar sx={{ position: "relative" }} color="transparent">
            <Toolbar>
                <TextField
                    placeholder="Wyszukaj tutaj"
                    variant="outlined"
                    fullWidth
                    sx={{
                        marginTop: 1,
                        marginBottom: 1,
                        "& fieldset": {
                            borderRadius: "25px"
                        }
                    }}
                    value={input}
                    onChange={({ target }) => setInput(target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <IconButton color="inherit" onClick={() => navigate("../")}>
                                <ArrowBack />
                            </IconButton>
                        </InputAdornment>,
                        endAdornment: !!input?.length && <InputAdornment position="end">
                            <IconButton color="inherit" onClick={() => setInput(undefined)}>
                                <HighlightOff />
                            </IconButton>
                        </InputAdornment>
                    }}
                />
            </Toolbar>
        </AppBar>
    </>;
};