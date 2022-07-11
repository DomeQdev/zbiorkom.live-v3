import { BottomSheet } from "react-spring-bottom-sheet";
import { Button, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import styled from "@emotion/styled";

const Label = styled(FormLabel)`
    font-size: 1.2rem;
`;

export default ({ onClose }: { onClose: () => void }) => {
    return <BottomSheet
        open
        onDismiss={onClose}
        style={{ width: "50%" }}
        header={<b style={{ fontSize: 25 }}>Ustawienia</b>}
        footer={<div style={{ textAlign: "center" }}><Button variant="contained">Zapisz</Button>&nbsp;<Button variant="outlined" color="inherit" onClick={onClose}>Anuluj</Button></div>}
    >
        <div style={{ textAlign: "center" }}>
            <FormControl>
                <Label>Wybierz styl mapy:</Label>
                <RadioGroup>
                    <FormControlLabel value="mapbox" control={<Radio />} label="Mapbox" />
                    <FormControlLabel value="google" control={<Radio />} label="Google" />

                </RadioGroup>
            </FormControl>
        </div>
    </BottomSheet>
};