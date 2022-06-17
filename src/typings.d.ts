type VehicleType = "bus" | "tram" | "metro" | "wkd" | "skm" | "km" | "trolley";

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

export { VehicleType, Vehicle, Departure };