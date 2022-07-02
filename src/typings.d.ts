import { MapboxGeoJSONLineString } from "mapbox-gl";
import cities from "./cities.json";

type VehicleType = "bus" | "tram" | "metro" | "skm" | "km" | "train" | "trolley";
type City = keyof typeof cities;

interface Vehicle {
    brigade: string,
    deg: number,
    lastPing: number,
    line: string,
    location: [number, number],
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
    headsign: string,
    id: string,
    line: string,
    shapes: MapboxGeoJSONLineString,
    stops: TripStop[]
}

interface TripStop {
    id: string,
    arrival: number,
    departure: number,
    location: [number, number],
    name: string,
    on_request: boolean,
    distance: number,
    time: number
}

interface Departure {
    line: string,
    type: VehicleType,
    color: string,
    brigade: string,
    headsign: string,
    delay: number,
    status: "REALTIME" | "SCHEDULED",
    realTime: number,
    scheduledTime: number,
    vehicle?: Vehicle,
    trip: string,
    platform?: string
}

interface Route {
    color: string,
    line: string,
    name: string,
    type: VehicleType
}

interface Stop {
    id: string,
    name: string,
    code?: string,
    location: [number, number],
    deg?: number,
    type: VehicleType[]
}

interface BrigadeSchedule {
    trip: string,
    headsign: string,
    start: number,
    end: number,
    firstStop: string
}

export { VehicleType, City, Trip, TripStop, Vehicle, Departure, Route, Stop, BrigadeSchedule, Trip };