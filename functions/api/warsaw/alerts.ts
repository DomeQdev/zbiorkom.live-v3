interface Alerts {
    alerts: {
        id: string,
        title: string,
        routes: string[],
        link: string,
        htmlbody: string
    }[]
}

export const onRequestGet = async () => {
    let alerts: Alerts = await fetch("https://mkuran.pl/gtfs/warsaw/alerts.json").then(res => res.json()).catch(() => null);
    if (!alerts?.alerts) return new Response(JSON.stringify([]), { status: 404 });

    return new Response(JSON.stringify(
        alerts.alerts.map(alert => ({
            id: alert.id,
            title: alert.title,
            routes: alert.routes,
            link: alert.link,
            body: alert.htmlbody
        }))
    ), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=10575"
        }
    });
};