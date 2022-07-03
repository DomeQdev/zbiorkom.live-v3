import styled from "@emotion/styled";
import { ArrowUpward } from "@mui/icons-material";
import { Marker } from "react-map-gl";
import { Vehicle } from "../typings";
import { Color, Icon } from "./Icons";

const VehicleMarker = styled.span((props: {
    color: string,
    backgroundColor: string,
    opacity: number
}) => `
    box-shadow: 1px 2px 7px #8a8a8a;
    position: relative;
    border-radius: 15px;
    display: flex;
    outline: none;
    align-items: center;
    padding: 0 6px;
    color: ${props.color};
    border: 2px solid ${props.color};
    fill: ${props.color};
    background-color: ${props.backgroundColor};
    opacity: ${props.opacity};
`);

export default ({ vehicle, mapBearing, onClick }: { vehicle: Vehicle, mapBearing: number, onClick?: () => void }) => {
    return <Marker
        latitude={vehicle.location[0]}
        longitude={vehicle.location[1]}
        clickTolerance={10}
        style={{ cursor: "pointer", display: "block", zIndex: 5 }}
        onClick={onClick}
    >
        <VehicleMarker color={Color(vehicle.type)} opacity={0.9} backgroundColor={"#fff"}>
            <ArrowUpward style={{ width: 16, height: 16, transform: `rotate(${vehicle.deg - mapBearing}deg)` }} /> <Icon type={vehicle.type} style={{ width: 18, height: 18 }} />&nbsp;<b style={{ fontWeight: 700, fontSize: 15 }}>{vehicle.line}</b>{vehicle.brigade && <small>/{vehicle.brigade}</small>}
        </VehicleMarker>
    </Marker>;
};