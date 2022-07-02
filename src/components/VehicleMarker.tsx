import { Marker } from "react-map-gl";
import { Vehicle } from "../typings";

export default ({ vehicle, onClick }: { vehicle: Vehicle, onClick?: () => void }) => {
    return <Marker
        latitude={vehicle.location[0]}
        longitude={vehicle.location[1]}
        rotation={vehicle.deg}
        rotationAlignment="map"
        clickTolerance={10}
        style={{ cursor: "pointer", display: "block", zIndex: 5 }}
        onClick={onClick}
    >
        {vehicle.line}/{vehicle.brigade}
    </Marker>;
};