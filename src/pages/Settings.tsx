import { useState } from "react";
import { useMap } from "react-map-gl";
import { Style } from "mapbox-gl";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Button, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import styled from "@emotion/styled";
import mapStyles from "../mapStyles.json";

const Label = styled(FormLabel)`
    font-size: 1.2rem;
`;

export default ({ onClose }: { onClose: () => void }) => {
    const { current: map } = useMap();
    const [mapStyle, setMapStyle] = useState<keyof typeof mapStyles>(localStorage.getItem("mapstyle") as keyof typeof mapStyles || "ms");

    return <BottomSheet
        open
        onDismiss={onClose}
        style={{ width: "50%" }}
        snapPoints={({ maxHeight }) => [maxHeight * 0.5]}
        header={<b style={{ fontSize: 25 }}>Ustawienia</b>}
        footer={<div style={{ textAlign: "center" }}><Button variant="contained" onClick={() => {
            localStorage.setItem("mapstyle", mapStyle);
            map?.getMap().setStyle(mapStyles[mapStyle].style as string | Style);
            onClose();
        }}>Zapisz</Button>&nbsp;<Button variant="outlined" color="inherit" onClick={onClose}>Anuluj</Button></div>}
    >
        <div style={{ textAlign: "center" }}>
            <FormControl>
                <Label>Wybierz styl mapy:</Label>
                <RadioGroup
                    value={mapStyle}
                    onChange={({ target }) => setMapStyle(target.value as keyof typeof mapStyles)}
                >
                    {Object.values(mapStyles).map(({ name, id }) => <FormControlLabel key={id} value={id} control={<Radio />} label={name} />)}
                </RadioGroup>
            </FormControl>
        </div>
    </BottomSheet>
};