import { Tooltip } from "@mui/material";
import { ArrowDropUp } from "@mui/icons-material";
import { Marker } from "react-map-gl";
import { Color } from "./Icons";
import { Stop } from "../util/typings";
import styled from "@emotion/styled";

const StopMarker = styled.div((props: {
    colors: string[]
}) => ({
    width: 18,
    height: 18,
    background: props.colors.length === 1 ? props.colors[0] : `linear-gradient(-45deg,${props.colors[0]} 50%,${props.colors[1]} 0)`,
    border: "solid white", 
    borderRadius: 18,
}));

const Arrow = styled(ArrowDropUp)((props: { arrowcolor: string }) => ({
    width: 27,
    height: 27,
    color: props.arrowcolor,
    stroke: "white",
    transform: "translateY(-18px)"
}));

export default ({ stop, onClick }: { stop: Stop, onClick: () => void }) => {
    let colors = stop.type?.map(type => Color(type)) || [Color("bus")];

    return <Marker
        latitude={stop.location[0]}
        longitude={stop.location[1]}
        rotationAlignment="map"
        clickTolerance={10}
        style={{ cursor: "pointer", zIndex: 1 }}
        onClick={onClick}
    >
        {stop.deg?.map((deg, i) => <div style={{ transform: `rotate(${deg}deg)`, display: "flex", position: "absolute" }} key={stop.id + i}><Arrow arrowcolor={colors[0]} /></div>)}
        <Tooltip title={stop.name + (stop.code ? ` ${stop.code}` : "")} placement="left" arrow><StopMarker colors={colors} /></Tooltip>
    </Marker>;
};