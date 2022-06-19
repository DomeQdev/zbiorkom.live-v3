import { SvgIcon } from "@mui/material";
import { DirectionsBus, Tram, Subway, DirectionsRailway, Train } from "@mui/icons-material";
import { VehicleType } from "../typings";

const Icon = ({ type, style }: { type: VehicleType, style?: React.CSSProperties }) => {
    const icons = {
        bus: <DirectionsBus style={style} />,
        tram: <Tram style={style} />,
        metro: <Subway style={style} />,
        wkd: <DirectionsRailway style={style} />,
        skm: <Train style={style} />,
        km: <Train style={style} />,
        trolley: <SvgIcon style={style}><svg viewBox="0 0 24 24"><path d="M13.853,4.257l1.722-3.302c0.159-0.307,0.041-0.687-0.267-0.847C15-0.051,14.62,0.067,14.46,0.375
            l-2.003,3.847C12.306,4.22,12.153,4.22,12,4.22c-0.194,0-0.386,0-0.575,0.002l1.703-3.267c0.159-0.307,0.04-0.687-0.267-0.847
            c-0.307-0.159-0.687-0.041-0.846,0.267L9.988,4.263C6.354,4.447,3.66,5.289,3.66,8.389v10.424c0,0.916,0.407,1.74,1.042,2.313v1.855
            c0,0.573,0.47,1.043,1.043,1.043h1.042c0.574,0,1.042-0.47,1.042-1.043V21.94h8.339v1.042c0,0.573,0.47,1.043,1.044,1.043h1.041
            c0.574,0,1.042-0.47,1.042-1.043v-1.855c0.637-0.573,1.045-1.397,1.045-2.313V8.389C20.34,5.245,17.567,4.423,13.853,4.257z
            M7.309,19.856c-0.864,0-1.563-0.699-1.563-1.564c0-0.864,0.699-1.563,1.563-1.563c0.865,0,1.563,0.698,1.563,1.563
            C8.872,19.157,8.174,19.856,7.309,19.856z M16.69,19.856c-0.865,0-1.564-0.699-1.564-1.564c0-0.864,0.699-1.563,1.564-1.563
            s1.563,0.698,1.563,1.563C18.253,19.157,17.556,19.856,16.69,19.856z M18.253,13.601H5.745V8.389h12.508V13.601"></path></svg></SvgIcon>
    };

    return icons[type];
};

const Color = (type: VehicleType) => {
    const colors = {
        bus: '#5aa159',
        tram: '#880077',
        metro: '#cf51d4',
        wkd: '#5aa159',
        skm: '#008d50',
        km: '#543ecc',
        trolley: '#059e00'
    };

    return colors[type];
};

export {
    Icon,
    Color
};