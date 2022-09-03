import { nearestPointOnLine, point } from "@turf/turf";
import { Trip, TripStop, Vehicle } from "./typings";

type RealTimeResponse = {
    snIndex: number,
    servingIndex: number | null,
    nextStopIndex: number,
    delay: number,
    travelledToNextStop: number,
    stops: TripStop[]
};

const RealTime = ({ trip, location, delay }: {
    trip: Trip,
    location: Vehicle["_location"],
    delay?: number
}): RealTimeResponse => {
    let vehicleDistance = nearestPointOnLine(trip.shapes, point(location), { units: 'meters' }).properties.location || 0;
    let stops = trip.stops.map(stop => ({
        ...stop,
        metersToStop: nearestPointOnLine(trip.shapes, point([stop.location[1], stop.location[0]]), { units: 'meters' }).properties.location! - vehicleDistance
    }));

    let tripStart = Date.now() - stops[0].arrival;
    let serving = stops.find(stop => stop.metersToStop < 50 && stop.metersToStop > -50);
    let servingIndex = stops.findIndex(stop => stop.metersToStop < 50 && stop.metersToStop > -50);
    let nextStop = stops.find(stop => stop?.metersToStop > 50) || stops[stops.length - 1];
    let nextStopIndex = stops.findIndex(stop => stop?.metersToStop > 50) || stops.length - 1;
    let snIndex = tripStart > 0 ? (servingIndex === -1 ? nextStopIndex : servingIndex) : 0;
    let lastStop = stops[snIndex - 1];

    let cur = serving || lastStop;
    let travelledToNextStop = percentTravelled(cur, nextStop);
    let realtime = ((nextStop.arrival - cur.departure) * travelledToNextStop) - (nextStop.arrival - Date.now());
    let _delay = tripStart > 0 ? delay == null ? realtime : delay : 0;

    return {
        snIndex,
        servingIndex: tripStart > 0 ? (servingIndex === -1 ? null : servingIndex) : 0,
        nextStopIndex: tripStart > 0 ? nextStopIndex : 1,
        stops: stops.map(stop => ({
            ...stop,
            realArrival: stop.arrival + _delay,
            realDeparture: stop.departure + _delay
        })),
        delay: Math.floor(_delay),
        travelledToNextStop
    };
};

export type { RealTimeResponse }
export { RealTime };

function percentTravelled(stop1: TripStop, stop2: TripStop) {
    let res = stop1.metersToStop / (stop1.metersToStop - stop2.metersToStop);
    return (res >= 1 || res === -Infinity) ? 0 : (1 - res);
}