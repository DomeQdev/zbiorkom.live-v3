import { ArrowUpward } from "@mui/icons-material";
import { Marker } from "react-map-gl";
import { Color, Icon } from "./Icons";
import { Vehicle, City } from "../util/typings";
import isDark from "../util/isDark";
import styled from "@emotion/styled";

const darkMode = isDark();
const VehicleMarker = styled.span((props: {
    color: string,
    backgroundColor: string,
    opacity: number
}) => ({
    boxShadow: "1px 2px 7px #8a8a8a",
    position: "relative",
    borderRadius: 15,
    display: "flex",
    outline: "none",
    alignItems: "center",
    padding: "0 6px",
    color: props.color,
    border: `2px solid ${props.color}`,
    fill: props.color,
    backgroundColor: props.backgroundColor,
    opacity: props.opacity
}));

export default ({ vehicle, city, mapBearing, onClick }: { vehicle: Vehicle, city: City, mapBearing: number, onClick?: () => void }) => {
    return <Marker
        latitude={vehicle.location[0]}
        longitude={vehicle.location[1]}
        clickTolerance={10}
        style={{ cursor: "pointer", display: "block", zIndex: 10 }}
        onClick={onClick}
    >
        <VehicleMarker color={darkMode ? "white" : Color(vehicle.type, city)} backgroundColor={darkMode ? Color(vehicle.type, city) : "#fff"} opacity={vehicle.isPredicted ? 0.8 : 1}>
            {!!vehicle.bearing && <ArrowUpward style={{ width: 14, height: 14, transform: `rotate(${vehicle.bearing - mapBearing}deg)` }} />}<Icon type={vehicle.type} style={{ width: 17, height: 17 }} />&nbsp;<b style={{ fontWeight: 700, fontSize: 14 }}>{vehicle.route}</b>{vehicle.brigade && <small>/{vehicle.brigade}</small>}
        </VehicleMarker>
    </Marker>;
};