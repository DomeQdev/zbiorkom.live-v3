interface Alerts {
    alerts: {
        id: string,
        title: string,
        routes: string[],
        effect: 'REDUCED_SERVICE' | 'OTHER_EFFECT'
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
            effect: alert.effect === "REDUCED_SERVICE" ? "IMPEDIMENT" : "CHANGE"
        }))
    ), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=600"
        }
    });
};