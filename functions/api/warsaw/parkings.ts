interface Parkings {
    result: {
        Parks: {
            allowedVehicleType: string,
            free_places_total: {
                disabled: number,
                public: number,
                electric: number
            },
            name: string,
            latitude: string,
            longitude: string,
            managerTelephone: string,
            total_places: {
                disabled: number,
                standard: number,
                electric: number
            }[]
        }[]
    }
}

export const onRequestGet = async ({ env }) => {
    // if you're not banned by um warszawa, remove "env.PROXY + " from the url, else input in variables your own proxy
    let parkings: Parkings = await fetch(env.PROXY + "https://api.um.warszawa.pl/api/action/parking_get_list/?apikey=ee277160-a0e2-407e-bea7-531a8fd8e067", {
        //@ts-ignore
        cf: {
            cacheTtl: 600,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!parkings?.result.Parks) return new Response(JSON.stringify([]), { status: 404 });

    return new Response(JSON.stringify(
        parkings.result.Parks.map((parking, i) => ({
            id: String(i),
            name: parking.name,
            location: [Number(parking.latitude), Number(parking.longitude)],
            totalPlaces: {
                all: parking.total_places.reduce((acc, cur) => acc + cur.disabled, 0) + parking.total_places.reduce((acc, cur) => acc + cur.standard, 0) + parking.total_places.reduce((acc, cur) => acc + cur.electric, 0),
                disabled: parking.total_places.reduce((acc, cur) => acc + cur.disabled, 0),
                standard: parking.total_places.reduce((acc, cur) => acc + cur.standard, 0),
                electric: parking.total_places.reduce((acc, cur) => acc + cur.electric, 0)
            },
            freePlaces: {
                all: parking.free_places_total.disabled + parking.free_places_total.public + parking.free_places_total.electric,
                disabled: parking.free_places_total.disabled,
                standard: parking.free_places_total.public,
                electric: parking.free_places_total.electric
            },
            allowedVehicles: parking.allowedVehicleType.split(", "),
            contact: parking.managerTelephone
        }))
    ), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=600"
        }
    });
};