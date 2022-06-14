interface NextBike {
    countries: {
        cities: {
            places: {
                lat: number
                lng: number
                name: string
                number: number
                bike_racks: number
                free_racks: number
                bike_list: {
                    number: string
                    bike_type: number
                }[]
            }[]
        }[]
    }[]
}

export const onRequestGet = async () => {
    let bikes: NextBike = await fetch("https://maps.nextbike.net/maps/nextbike.json?domains=vp").then(res => res.json()).catch(() => null);
    if (!bikes) return new Response(JSON.stringify([]), { status: 404 });

    return new Response(JSON.stringify(
        bikes.countries[0].cities.map(city => city.places.map(place => ({
            location: [place.lat, place.lng],
            name: place.name,
            id: String(place.number),
            racks: place.bike_racks,
            free_racks: place.free_racks,
            bikes: place.bike_list.length
        }))).flat()
    ), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=10575"
        }
    });
};