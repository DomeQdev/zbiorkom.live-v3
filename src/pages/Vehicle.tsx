import Shapes from "../components/Shapes";
import VehicleMarker from "../components/VehicleMarker";
import { Vehicle } from "../typings";

export default ({ vehicle, mapBearing }: { vehicle: Vehicle, mapBearing: number }) => {
    return <>
        <VehicleMarker vehicle={vehicle} mapBearing={mapBearing} />
    </>;
};