import VehicleMarker from "../components/VehicleMarker";
import { Vehicle } from "../typings";

export default ({ vehicle }: { vehicle: Vehicle }) => {
    return <>
        <VehicleMarker vehicle={vehicle} onClick={() => {}} />
    </>;
};