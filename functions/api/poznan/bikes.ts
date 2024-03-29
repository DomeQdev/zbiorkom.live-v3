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
    let bikes: NextBike = await fetch("https://nextbike.net/maps/nextbike-official.json?city=192,394,504,620,630", {
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
            [place.free_racks, null, place.bikes_available_to_rent]
        ])))).flat(2).sort((a, b) => (a[1] as string).localeCompare(b[1] as string))
    ), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600"
        }
    });
};