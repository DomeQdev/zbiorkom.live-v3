import styled from "@emotion/styled";
import { ArrowUpward } from "@mui/icons-material";
import { Marker } from "react-map-gl";
import { Vehicle } from "../util/typings";
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
        longitude={vehicle._location[0]}
        latitude={vehicle._location[1]}
        clickTolerance={10}
        style={{ cursor: "pointer", display: "block", zIndex: 5, transition: "linear .1s" }}
        onClick={onClick}
    >
        <VehicleMarker color={Color(vehicle.type)} opacity={vehicle.isPredicted ? 0.8 : 1} backgroundColor={vehicle.isSpecial ? "#F5CF4B" : (vehicle.isEco ? "#83F493" : "#FFF")}>
            {!!vehicle.deg && <ArrowUpward style={{ width: 14, height: 14, transform: `rotate(${vehicle.deg - mapBearing}deg)` }} />}<Icon type={vehicle.type} style={{ width: 17, height: 17 }} />&nbsp;<b style={{ fontWeight: 700, fontSize: 14 }}>{vehicle.line}</b>{vehicle.brigade && <small>/{vehicle.brigade}</small>}
        </VehicleMarker>
    </Marker>;
};