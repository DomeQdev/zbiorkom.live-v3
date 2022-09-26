export const onRequestGet = async () => {
    let parkings = await Promise.all([
        fetch("https://www.ztm.poznan.pl/pl/dla-deweloperow/getParkingFile/?file=ZTM_ParkAndRide__biskupinska.csv").then(res => res.text()).then(res => ({
            id: "1",
            name: "Biskupińska",
            location: [52.46074333206008, 16.864879614991207],
            freePlaces: Number(res.split("\n")[1].split(";")[1].replace(/"/g, ""))

        })).catch(() => null),
        fetch("https://www.ztm.poznan.pl/pl/dla-deweloperow/getParkingFile/?file=ZTM_ParkAndRide__swmichala.csv").then(res => res.text()).then(res => ({
            id: "2",
            name: "Św. Michała",
            location: [52.40870727662397, 16.961623189905747],
            freePlaces: Number(res.split("\n")[1].split(";")[1].replace(/"/g, ""))
        })).catch(() => null),
        fetch("https://www.ztm.poznan.pl/pl/dla-deweloperow/getParkingFile/?file=ZTM_ParkAndRide__szymanowskiego.csv").then(res => res.text()).then(res => ({
            id: "3",
            name: "Szymanowskiego",
            location: [52.460838218700594, 16.916049963952524],
            freePlaces: Number(res.split("\n")[1].split(";")[1].replace(/"/g, ""))
        })).catch(() => null),
        fetch("https://www.ztm.poznan.pl/pl/dla-deweloperow/getParkingFile/?file=ZTM_ParkAndRide__rondo_staroleka.csv").then(res => res.text()).then(res => ({
            id: "4",
            name: "Rondo Starołęka",
            location: [52.37915292322815, 16.944271831568148],
            freePlaces: Number(res.split("\n")[1].split(";")[1].replace(/"/g, ""))
        })).catch(() => null)
    ]).then(x => x.filter(y => y));

    return new Response(JSON.stringify(parkings), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=600"
        }
    });
};