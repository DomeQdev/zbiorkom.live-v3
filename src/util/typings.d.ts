import { MapboxGeoJSONLineString } from "mapbox-gl";
import cities from "../util/cities.json";

type VehicleType = 0 | 1 | 2 | 3 | 4 | 11;
type City = keyof typeof cities;

interface Vehicle {
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
}

interface Trip {
    error?: string,
    id: string,
    headsign: string,
    shortName?: string,
    shapes: [[number, number]],
    stops: TripStop[]
}

interface TripStop {
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
}

interface Departure {
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
}

interface StopDepartures {
    name: string,
    code: string,
    type?: VehicleType[],
    routes: [string, VehicleType][],
    alert?: {
        type: "error" | "warning" | "info" | "success",
        text: string,
        link?: string
    },
    departures: Departure[]
}

interface RouteType {
    type: VehicleType,
    routes: {
        id: string,
        name: string
    }[]
}

interface Stop {
    id: string,
    bearing: number[],
    location: [number, number],
    type: VehicleType[],
}

interface BrigadeSchedule {
    trip: string,
    headsign: string,
    start: number,
    realStart?: number,
    end: number,
    realEnd?: number,
    firstStop: string
}

interface Alert {
    id: string,
    title: string,
    description?: string,
    url?: string,
    routes?: string[],
    start?: number,
    end?: number,
    impediment: boolean
}

interface BikeStation {
    location: [number, number],
    name: string,
    id: string,
    freeRacks: number,
    bikes: number
}

interface FilterData {
    routes: string[],
    types: VehicleType[],
}

export { VehicleType, City, Trip, TripStop, Vehicle, Departure, StopDepartures, RouteType, Stop, BrigadeSchedule, Trip, Alert, BikeStation, FilterData };