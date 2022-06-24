import { FilterTiltShift, ArrowDropUp } from "@mui/icons-material";
import { Marker } from "react-map-gl";
import { Color } from "./Icons";
import { Stop } from "../typings";

export default ({ stop, onClick }: { stop: Stop, onClick: () => void }) => {
    return <Marker
        latitude={stop.location[0]}
        longitude={stop.location[1]}
        rotation={stop.deg}
        rotationAlignment="map"
        clickTolerance={10}
        style={{ cursor: "pointer", color: Color(stop.type || "bus") }}
        anchor="center"
        offset={[0, 0]}
        onClick={onClick}
    >
        {stop.deg !== undefined && <ArrowDropUp style={{ position: "absolute", transform: "translateY(-16px)" }} />}
        <FilterTiltShift style={{ position: "absolute" }} />
    </Marker>;
};