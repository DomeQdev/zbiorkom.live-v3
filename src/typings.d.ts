type VehicleType = "bus" | "tram" | "metro" | "skm" | "km" | "train" | "trolley";

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
    type?: VehicleType[]
}

interface BrigadeSchedule {
    trip: string,
    headsign: string,
    start: number,
    end: number,
    firstStop: string
}

declare global {
    interface Window {
      socket: any
    }
}

export { VehicleType, Vehicle, Departure, Route, Stop, BrigadeSchedule };