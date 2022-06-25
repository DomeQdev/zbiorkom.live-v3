import { FilterTiltShift, ArrowDropUp } from "@mui/icons-material";
import { Marker } from "react-map-gl";
import { Color } from "./Icons";
import { Stop } from "../typings";
import { Tooltip } from "@mui/material";

export default ({ stop, onClick }: { stop: Stop, onClick: () => void }) => {
    let colors = stop.type?.map(type => Color(type)) || [Color("bus")];

    return <Marker
        latitude={stop.location[0]}
        longitude={stop.location[1]}
        rotation={stop.deg}
        rotationAlignment="map"
        clickTolerance={10}
        style={{ cursor: "pointer", display: "block", zIndex: 1 }}
        onClick={onClick}
    >
        {stop.deg !== undefined && <ArrowDropUp style={{ position: "absolute", transform: "translate(3.25px, -12px)", width: 19, height: 19, color: colors[0] }} />}
        <Tooltip title={stop.name + (stop.code ? ` ${stop.code}` : "")} placement="left" arrow><FilterTiltShift style={{ width: 25, height: 25, color: colors[1] || colors[0] }} /></Tooltip>
    </Marker>;
};