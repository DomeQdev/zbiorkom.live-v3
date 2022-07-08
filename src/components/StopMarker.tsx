import { Tooltip } from "@mui/material";
import { FilterTiltShift, ArrowDropUp } from "@mui/icons-material";
import { Marker } from "react-map-gl";
import { Color } from "./Icons";
import { Stop } from "../util/typings";

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
        {stop.deg !== null && <ArrowDropUp style={{ position: "absolute", transform: "translate(3.25px, -12px)", width: 19, height: 19, color: colors[0] }} />}
        <Tooltip title={stop.name + (stop.code ? ` ${stop.code}` : "")} placement="left" arrow><FilterTiltShift style={{ width: stop.type[0] ===  "train" ? 30 : 25, height: stop.type[0] ===  "train" ? 30 : 25, color: colors[1] || colors[0] }} /></Tooltip>
    </Marker>;
};