import { Badge } from "@mui/material";
import { Bolt, DirectionsBike } from "@mui/icons-material";
import { BikeStation } from "../util/typings";
import { Marker } from "react-map-gl";

export default ({ station, onClick }: { station: BikeStation, onClick?: () => void }) => {
    return <Marker
        latitude={station[2][0]}
        longitude={station[2][1]}
        rotationAlignment="viewport"
        clickTolerance={10}
        style={{ cursor: "pointer", display: "grid", placeItems: "center", zIndex: 5 }}
        onClick={onClick}
    >
        <Badge color="primary" badgeContent={(station[3][0] || 0) + (station[3][1] || 0)} max={50} showZero anchorOrigin={{ vertical: "top", horizontal: "left" }}>
            <DirectionsBike sx={{ color: "#673ab7" }} />
        </Badge>
        {station[3][1] != null && <Bolt sx={{ position: "absolute", marginLeft: 3, marginTop: 2 }} color="primary" />}
    </Marker>;
};