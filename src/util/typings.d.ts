import { MapboxGeoJSONLineString } from "mapbox-gl";
import cities from "../util/cities.json";

type VehicleType = 0 | 1 | 2 | 3 | 4 | 11;
type City = keyof typeof cities;

type Vehicle = {
    route: string,
    id: string,
    type: VehicleType,
    location: [number, number],
    brigade: string,
    lastPing: number,
    bearing: number,
    trip: string,
    delay?: number,
    isPredicted?: boolean
};

type Trip = {
    error?: string,
    id: string,
    type: VehicleType,
    route: string,
    headsign: string,
    shortName?: string,
    shapes: [number, number][],
    stops: TripStop[]
};

type TripStop = {
    id: string,
    arrival: number,
    departure: number,
    metersToStop: number,
    location: [number, number],
    name: string,
    on_request: boolean,
    distance: number,
    index: number,
    sequence: number,
    platform?: string
};

type Departure = {
    route: string,
    type: VehicleType,
    headsign: string,
    delay: number,
    status: "REALTIME" | "SCHEDULED" | "CANCELLED",
    isLastStop?: boolean,
    realTime: number,
    scheduledTime: number,
    platform?: string,
    trip: string
};

type StopDepartures = {
    name: string,
    code: string,
    type?: VehicleType[],
    alert?: {
        type: "error" | "warning" | "info" | "success",
        text: string,
        link?: string
    },
    departures: Departure[]
};

type RouteType = {
    type: VehicleType,
    routes: {
        id: string,
        name: string
    }[]
};

type Stop = {
    id: string,
    bearing: number[],
    location: [number, number],
    type: VehicleType[],
};

type StopGroup = {
    name: string,
    location: [number, number],
    distance?: number,
    bearing?: number
};

type StopInGroup = {
    id: string,
    name: string,
    type: VehicleType[],
    routes: string[]
};

type BrigadeSchedule = {
    trip: string,
    headsign: string,
    start: number,
    realStart?: number,
    end: number,
    realEnd?: number,
    firstStop: string
};

type Alert = {
    id: string,
    title: string,
    description?: string,
    url?: string,
    routes?: string[],
    start?: number,
    end?: number,
    impediment: boolean
};

type FilterData = {
    routes: string[],
    types: VehicleType[],
};

type BikeStation = [
    id: string,
    name: string,
    location: [number, number],
    racks: [number | null, number | null, number],
    distance?: number,
    bearing?: number
];

type Parking = [
    id: string,
    name: string,
    location: [number, number],
    spots: number
];

export {
    VehicleType,
    City,
    Trip,
    TripStop,
    Vehicle,
    Departure,
    StopDepartures,
    RouteType,
    Stop,
    StopGroup,
    StopInGroup,
    BrigadeSchedule,
    Trip,
    Alert,
    FilterData,
    BikeStation,
    Parking
};