import { MapboxGeoJSONLineString } from "mapbox-gl";
import cities from "../util/cities.json";

type VehicleType = 0 | 1 | 2 | 3 | 4 | 5 | 11 | 12;
type City = keyof typeof cities;

interface Vehicle {
    brigade: string,
    deg: number,
    lastPing: number,
    line: string,
    location: [number, number],
    _location: [number, number],
    tab: string,
    trip?: string,
    type: VehicleType,
    headsign?: string,
    delay?: number,
    isSpecial?: string,
    isEco?: boolean,
    isPredicted?: boolean
}

interface Trip {
    color: string,
    text: string,
    headsign: string,
    id: string,
    line: string,
    shapes: MapboxGeoJSONLineString,
    stops: TripStop[],
    error?: string
}

interface TripStop {
    id: string,
    arrival: number,
    realArrival: number,
    departure: number,
    realDeparture: number,
    location: [number, number],
    name: string,
    on_request: boolean,
    distance: number,
    metersToStop: number,
    sequence: number,
    platform?: string
}

interface Departure {
    line: string,
    headsign: string,
    color: string,
    text: string,
    delay: number,
    status: "REALTIME" | "SCHEDULED",
    realTime: number,
    scheduledTime: number,
    platform?: string,
    trip: string,
    type: VehicleType
}

interface StopDepartures {
    name: string,
    code: string,
    type?: VehicleType[],
    location: [number, number],
    lines: {
        line: string,
        color: string,
        text: string
    }[],
    alert?: {
        type: "error" | "warning" | "info" | "success",
        text: string,
        link?: string
    },
    departures: Departure[]
}

interface Route {
    color: string,
    text: string,
    line: string,
    name: string,
    type: VehicleType
}

interface Stop {
    id: string,
    name: string,
    code?: string,
    location: [number, number],
    deg?: number[],
    type: VehicleType[]
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
    routes: {
        route: string,
        type: VehicleType
    }[],
    effect: "IMPEDIMENT" | "CHANGE",
    from?: number,
    to?: number,
    published?: number,
    link?: string,
    body?: string
}

interface BikeStation {
    location: [number, number],
    name: string,
    id: string,
    freeRacks: number,
    bikes: number
}

export { VehicleType, City, Trip, TripStop, Vehicle, Departure, StopDepartures, Route, Stop, BrigadeSchedule, Trip, Alert, BikeStation };