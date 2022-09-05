import { SvgIcon } from "@mui/material";
import { DirectionsBus, Tram, Subway, Train, DirectionsBoat, CarCrash, DirectionsRailway } from "@mui/icons-material";
import { City, VehicleType } from "../util/typings";
import cities from "../util/cities.json";

const Icon = ({ type, style }: { type: VehicleType, style?: React.CSSProperties }) => {
    const icons = {
        0: <Tram style={style} />,
        1: <Subway style={style} />,
        2: <Train style={style} />,
        3: <DirectionsBus style={style} />,
        4: <DirectionsBoat style={style} />,
        5: <SvgIcon style={style}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 64c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm-64-8c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32zM32 288c0-35.3 28.7-64 64-64H232V157.5l-203.1 42c-13 2.7-25.7-5.7-28.4-18.6s5.7-25.7 18.6-28.4l232-48 232-48c13-2.7 25.7 5.7 28.4 18.6s-5.7 25.7-18.6 28.4L280 147.5V224H416c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V288zm64 0c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16V304c0-8.8-7.2-16-16-16H96zm112 16v64c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16V304c0-8.8-7.2-16-16-16H224c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16V304c0-8.8-7.2-16-16-16H352z" /></svg></SvgIcon>,
        11: <SvgIcon style={style}><svg viewBox="0 0 24 24"><path d="M13.853,4.257l1.722-3.302c0.159-0.307,0.041-0.687-0.267-0.847C15-0.051,14.62,0.067,14.46,0.375
            l-2.003,3.847C12.306,4.22,12.153,4.22,12,4.22c-0.194,0-0.386,0-0.575,0.002l1.703-3.267c0.159-0.307,0.04-0.687-0.267-0.847
            c-0.307-0.159-0.687-0.041-0.846,0.267L9.988,4.263C6.354,4.447,3.66,5.289,3.66,8.389v10.424c0,0.916,0.407,1.74,1.042,2.313v1.855
            c0,0.573,0.47,1.043,1.043,1.043h1.042c0.574,0,1.042-0.47,1.042-1.043V21.94h8.339v1.042c0,0.573,0.47,1.043,1.044,1.043h1.041
            c0.574,0,1.042-0.47,1.042-1.043v-1.855c0.637-0.573,1.045-1.397,1.045-2.313V8.389C20.34,5.245,17.567,4.423,13.853,4.257z
            M7.309,19.856c-0.864,0-1.563-0.699-1.563-1.564c0-0.864,0.699-1.563,1.563-1.563c0.865,0,1.563,0.698,1.563,1.563
            C8.872,19.157,8.174,19.856,7.309,19.856z M16.69,19.856c-0.865,0-1.564-0.699-1.564-1.564c0-0.864,0.699-1.563,1.564-1.563
            s1.563,0.698,1.563,1.563C18.253,19.157,17.556,19.856,16.69,19.856z M18.253,13.601H5.745V8.389h12.508V13.601"></path></svg></SvgIcon>,
        12: <DirectionsRailway style={style} />
    };

    return icons[type];
};

const Color = (type: VehicleType, city: City) => {
    //@ts-ignore
    return cities[city].colors[type] || "#FF7E00";
};

const Name = (type: VehicleType) => {
    const names = {
        0: "Tramwaj",
        1: "Metro",
        2: "Pociąg",
        3: "Autobus",
        4: "Prom",
        5: "Kolej linowa",
        11: "Trolejbus",
        12: "Kolej jednoszynowa"
    };

    return names[type];
};

export {
    Icon,
    Color,
    Name
};