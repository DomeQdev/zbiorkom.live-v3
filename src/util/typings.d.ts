import { MapboxGeoJSONLineString } from "mapbox-gl";
import cities from "../cities.json";

type VehicleType = "bus" | "tram" | "metro" | "skm" | "km" | "train" | "ferry" | "trolley" | "unknown";
type City = keyof typeof cities;

interface Vehicle {
    brigade: string,
    deg: number,
    lastPing: number,
    line: string,
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
    departure: number,
    location: [number, number],
    name: string,
    on_request: boolean,
    distance: number,
    metersToStop: number,
    sequence: number
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

interface PlannerResult {
    key: string,
    routes: {
        id: number,
        startTime: number,
        endTime: number,
        duration: number,
        walkTime: number,
        legs: {
            mode: "walk" | "bike" | "car" | "transit",
            duration: number,
            color?: string,
            textColor?: string,
            line?: string,
            type?: VehicleType
        }[]
    }[]
}

interface PlannerRoute {
    startTime: number,
    endTime: number,
    duration: number,
    walkTime: number,
    legs: {
        startTime: number,
        endTime: number,
        duration: number,
        mode: "walk" | "bike" | "car" | "transit",
        distance: number,
        line?: string,
        headsign?: string,
        color?: string,
        textColor?: string,
        type?: VehicleType,
        from: {
            name: string,
            id?: string,
            location: [number, number]
            arrival?: number,
            departure?: number
        },
        to: {
            name: string,
            id?: string,
            location: [number, number]
            arrival?: number,
            departure?: number
        },
        shape: [number, number][],
        stops?: {
            name: string,
            id: string,
            location: [number, number],
            arrival: number,
            departure: number
        }[]
    }[]
}

export { VehicleType, City, Trip, TripStop, Vehicle, Departure, Route, Stop, BrigadeSchedule, Trip, Alert, PlannerResult, PlannerRoute };