export const onRequestGet = async () => {
    let parkings = await Promise.all([
        fetch("https://www.ztm.poznan.pl/pl/dla-deweloperow/getParkingFile/?file=ZTM_ParkAndRide__biskupinska.csv").then(res => res.text()).then(res => ([
            "1",
            "Biskupińska",
            [52.46074333206008, 16.864879614991207],
            Number(res.split("\n")[1].split(";")[1].replace(/"/g, ""))
        ])).catch(() => null),
        fetch("https://www.ztm.poznan.pl/pl/dla-deweloperow/getParkingFile/?file=ZTM_ParkAndRide__swmichala.csv").then(res => res.text()).then(res => ([
            "2",
            "Św. Michała",
            [52.40870727662397, 16.961623189905747],
            Number(res.split("\n")[1].split(";")[1].replace(/"/g, ""))
        ])).catch(() => null),
        fetch("https://www.ztm.poznan.pl/pl/dla-deweloperow/getParkingFile/?file=ZTM_ParkAndRide__szymanowskiego.csv").then(res => res.text()).then(res => ([
            "3",
            "Szymanowskiego",
            [52.460838218700594, 16.916049963952524],
            Number(res.split("\n")[1].split(";")[1].replace(/"/g, ""))
        ])).catch(() => null),
        fetch("https://www.ztm.poznan.pl/pl/dla-deweloperow/getParkingFile/?file=ZTM_ParkAndRide__rondo_staroleka.csv").then(res => res.text()).then(res => ([
            "4",
            "Rondo Starołęka",
            [52.37915292322815, 16.944271831568148],
            Number(res.split("\n")[1].split(";")[1].replace(/"/g, ""))
        ])).catch(() => null)
    ]).then(x => x.filter(y => y));

    return new Response(JSON.stringify(parkings), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=600"
        }
    });
};