import { lazy, useState } from "react";
import { useMap } from "react-map-gl";
import { Style } from "mapbox-gl";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Button, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import styled from "@emotion/styled";
import mapStyles from "../util/mapStyles.json";
import { Suspense } from "../components/Suspense";

const Question = lazy(() => import("../components/Question"));

const Label = styled(FormLabel)`
    font-size: 1.2rem;
`;

export default ({ onClose }: { onClose: () => void }) => {
    const { current: map } = useMap();
    const [mapStyle, setMapStyle] = useState<keyof typeof mapStyles>(localStorage.getItem("mapstyle") as keyof typeof mapStyles || "ms");
    const [mapNotSupported, setMapNotSupported] = useState<keyof typeof mapStyles | null>();

    return <BottomSheet
        open
        onDismiss={onClose}
        style={{ width: "50%" }}
        snapPoints={({ maxHeight }) => [maxHeight * 0.5]}
        header={<b style={{ fontSize: 25 }}>Ustawienia</b>}
        footer={<div style={{ textAlign: "center" }}><Button variant="contained" onClick={() => {
            localStorage.setItem("mapstyle", mapStyle);
            let style = mapStyles[mapStyle];

            map?.getMap().setStyle(style.style as string | Style);
            onClose();
        }}>Zapisz</Button>&nbsp;<Button variant="outlined" color="inherit" onClick={onClose}>Anuluj</Button></div>}
    >
        <div style={{ textAlign: "center" }}>
            <FormControl>
                <Label>Wybierz styl mapy:</Label>
                <RadioGroup
                    value={mapStyle}
                    onChange={({ target }) => {
                        let val = target.value as keyof typeof mapStyles;
                        let style = mapStyles[val];
                        //@ts-ignore
                        if (style.notMapbox) return setMapNotSupported(val);
                        setMapStyle(val);
                    }}
                >
                    {Object.values(mapStyles).map(({ name, id }) => <FormControlLabel key={id} value={id} control={<Radio />} label={name} />)}
                </RadioGroup>
            </FormControl>
        </div>
        {mapNotSupported && <Suspense><Question 
            title={`Czy na pewno chcesz użyć ${mapStyles[mapNotSupported].name}?`} 
            message={`Jest to nieoficjalna wersja mapy, która nie wspiera obracania i częściowo przybliżania. Przy jej użyciu zalecane jest używanie przycisków kontroli przybliżenia w prawym górnym rogu.`} 
            options={[
                {
                    name: "Tak",
                    onClick: () => {
                        setMapStyle(mapNotSupported);
                        setMapNotSupported(null);
                    }
                },
                {
                    name: "Nie",
                    onClick: () => setMapNotSupported(null)
                }
            ]} 
        /></Suspense>}
    </BottomSheet>
};