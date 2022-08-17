import { lazy, useState } from "react";
import { useMap } from "react-map-gl";
import { Style } from "mapbox-gl";
import { Suspense } from "../components/Suspense";
import { Button, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Box } from "@mui/material";
import mapStyles from "../util/mapStyles.json";
import TempDrawer from "../components/TempDrawer";

const Question = lazy(() => import("../components/Question"));

export default ({ open, onClose }: { open: boolean, onClose: () => void }) => {
    const { current: map } = useMap();
    const [mapStyle, setMapStyle] = useState<keyof typeof mapStyles>(localStorage.getItem("mapstyle") as keyof typeof mapStyles || "ms");
    const [mapNotSupported, setMapNotSupported] = useState<keyof typeof mapStyles | null>();

    return <>
        <TempDrawer
            open={open}
            onClose={onClose}
            padding
        >
            <FormControl>
                <FormLabel sx={{ fontSize: 20 }}>Wybierz styl mapy:</FormLabel>
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
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                <Button variant="contained" sx={{ width: "49%" }} onClick={() => {
                    localStorage.setItem("mapstyle", mapStyle);
                    let style = mapStyles[mapStyle];

                    map?.getMap().setStyle(style.style as string | Style);
                    onClose();
                }}>Zapisz</Button>
                <Button variant="outlined" sx={{ width: "49%" }} color="inherit" onClick={onClose}>Anuluj</Button>
            </Box>
        </TempDrawer>
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
    </>;
};