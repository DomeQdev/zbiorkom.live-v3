interface Alerts {
    alerts: {
        id: string,
        title: string,
        routes: string[],
        effect: 'REDUCED_SERVICE' | 'OTHER_EFFECT'
        link: string,
        htmlbody: string
    }[]
}

export const onRequestGet = async () => {
    let alerts: Alerts = await fetch("https://mkuran.pl/gtfs/warsaw/alerts.json", {
        //@ts-ignore
        cf: {
            cacheTtl: 600,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!alerts?.alerts) return new Response(JSON.stringify([]), { status: 404 });

    return new Response(JSON.stringify(
        alerts.alerts.map(alert => ({
            id: alert.id,
            title: alert.title,
            routes: alert.routes,
            reduced: alert.effect === "REDUCED_SERVICE",
            link: alert.link
        }))
    ), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=600"
        }
    });
};