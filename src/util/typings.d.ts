import { MapboxGeoJSONLineString } from "mapbox-gl";
import cities from "../util/cities.json";

type VehicleType = "bus" | "tram" | "metro" | "skm" | "km" | "train" | "ferry" | "trolley" | "unknown";
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

interface PlannerOptions {
    from: [number, number] | undefined,
    fromName: string,
    to: [number, number] | undefined,
    toName: string,
    transfers: number,
    facilities: "wheelchair" | "ac" | "bike"[],
    type: "quick" | "optimised" | "transfers"
}

interface PlannerLeg {
    mode: "walk" | "bicycle" | "car" | "transit" | "transfer",
    duration: number,
    color?: string,
    textColor?: string,
    line?: string,
    type?: VehicleType
}

interface PlannerResult {
    key: string,
    routes: {
        id: number,
        startTime: number,
        endTime: number,
        duration: number,
        walkTime: number,
        legs: PlannerLeg[]
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

export { VehicleType, City, Trip, TripStop, Vehicle, Departure, StopDepartures, Route, Stop, BrigadeSchedule, Trip, Alert, PlannerOptions, PlannerLeg, PlannerResult, PlannerRoute };