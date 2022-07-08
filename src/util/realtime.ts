import { nearestPointOnLine, point } from "@turf/turf";
import { Trip, TripStop, Vehicle } from "./typings";

const realtime = ({ trip, location, delay }: {
    trip: Trip,
    location: Vehicle["_location"],
    delay?: number
}) => {
    let vehicleDistance = nearestPointOnLine(trip.shapes, point(location), { units: 'meters' }).properties.location || 0;
    let stops = trip.stops.map(stop => ({
        ...stop,
        metersToStop: stop.distance - vehicleDistance
    }));

    let tripStart = Date.now() - stops[0].arrival;
    let lastStop = stops.filter(stop => stop.metersToStop < -50).pop() || stops[0];
    let serving = stops.find(stop => stop.metersToStop < 50 && stop.metersToStop > -50);
    let servingIndex = stops.findIndex(stop => stop.metersToStop < 50 && stop.metersToStop > -50);
    let nextStop = stops.find(stop => stop?.metersToStop > 50) || stops[stops.length - 1];
    let nextStopIndex = stops.findIndex(stop => stop?.metersToStop > 50) || stops.length - 1;

    let cur = serving || lastStop;
    let realtime = ((nextStop.arrival - cur.departure) * percentTravelled(cur, nextStop)) - (nextStop.arrival - Date.now());
    let _delay = delay || (tripStart > 0 ? realtime : 0);

    return {
        lastStop,
        serving,
        nextStop,
        servingIndex: tripStart > 0 ? (servingIndex === -1 ? null : servingIndex) : 0,
        nextStopIndex: tripStart > 0 ? nextStopIndex : 1,
        delay: Math.floor(_delay)
    };
};

export {
    realtime
};

function percentTravelled(stop1: TripStop, stop2: TripStop) {
    let res = stop1.metersToStop / (stop1.metersToStop - stop2.metersToStop);
    return (res >= 1 || res === -Infinity) ? 0 : (1 - res);
}