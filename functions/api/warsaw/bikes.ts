interface NextBike {
    countries: {
        cities: {
            places: {
                lat: number,
                lng: number,
                name: string,
                number: number,
                bikes_available_to_rent: number,
                free_racks: number
            }[]
        }[]
    }[]
}

export const onRequestGet = async () => {
    let bikes: NextBike = await fetch("https://nextbike.net/maps/nextbike-official.json?city=210,372,442,461,527,550,551,812", {
        //@ts-ignore
        cf: {
            cacheTtl: 3600,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!bikes) return new Response(JSON.stringify([]), { status: 404 });

    return new Response(JSON.stringify(
        bikes.countries.map(country => country.cities.map(city => city.places.map(place => ([
            String(place.number),
            place.name,
            [place.lat, place.lng],
            [place.name.includes("E-bike") ? null : place.bikes_available_to_rent, place.name.includes("E-bike") ? place.bikes_available_to_rent : null, place.free_racks]
        ])))).flat(2).sort((a, b) => (a[1] as string).localeCompare(b[1] as string))
    ), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600"
        }
    });
};