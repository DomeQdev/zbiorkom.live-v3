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

export const onRequestGet = async ({ request }) => {
    let { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: true }), { status: 404 });

    let alerts: Alerts = await fetch("https://mkuran.pl/gtfs/warsaw/alerts.json", {
        //@ts-ignore
        cf: {
            cacheTtl: 600,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);
    if (!alerts?.alerts) return new Response(JSON.stringify([]), { status: 404 });

    let alert = alerts.alerts.find(alert => alert.id === id);
    if (!alert) return new Response(JSON.stringify({ error: true }), { status: 404 });

    return new Response(JSON.stringify({
        id: alert.id,
        title: alert.title,
        routes: alert.routes,
        effect: alert.effect === "REDUCED_SERVICE" ? "IMPEDIMENT" : "CHANGE",
        link: alert.link,
        body: alert.htmlbody
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=600"
        }
    });
};