export const onRequestPatch = async ({ request, env }) => {
    const city = new URL(request.url).searchParams.get("city");
    const { from, to, transfers, type, facilities }: { from: [number, number], to: [number, number], transfers: number, type: "quick" | "optimised" | "transfers", facilities?: ["wheelchair" | "ac" | "bike"] } = await request.json();
    if ((city !== "warsaw" && city !== "poznan") || (!from || isNaN(from[0]) || isNaN(from[1])) || (!to || isNaN(to[0]) || isNaN(to[1])) || ((!transfers && transfers !== 0) || isNaN(transfers)) || (type !== "quick" && type !== "optimised" && type !== "transfers")) return new Response(JSON.stringify({ error: "Provide city='warsaw' | 'poznan', from=[number,number], to=[number,number], transfers=number, type='quick' | 'optimised' | 'transfers', facilities?='wheelchair' | 'ac' | 'bike'[]" }), {
        status: 400,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=31556926"
        }
    });

    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();

    let res = await fetch(`https://api.zbiorkom.live/${city}/planner?from=${from[0]},${from[1]}&to=${to[0]},${to[1]}&transfers=${transfers}&type=${type}${(facilities && facilities[0]) ? `&facilities=${facilities.join(",")}` : ""}&apikey=${env.ZBIORKOM_PLANNER_API_KEY}&_cf=${uuid}`, {
        //@ts-ignore
        cf: {
            cacheTtl: 31536000,
            cacheEverything: true
        },
        keepalive: true
    }).catch(() => null);
    if (!res) return new Response(JSON.stringify({ error: "Server returned unexpected error" }), { status: 419 });

    let resp = await res.json();
    if (resp.error) return new Response(JSON.stringify({ error: resp.error }), { status: 419 });

    if (resp[0]) await env.ZBIORKOM?.put(uuid, JSON.stringify(resp), { expirationTtl: 86400 });

    return new Response(JSON.stringify({
        key: uuid,
        routes: resp.map((route, i: number) => ({
            id: i,
            startTime: route.startTime,
            endTime: route.endTime,
            duration: route.duration,
            walkTime: route.walkTime,
            legs: route.legs.map((leg, j) => ({
                mode: leg.mode === "transit" ? leg.mode : (leg.duration > 60 ? leg.mode : "transfer"),
                duration: leg.duration,
                color: leg.color,
                textColor: leg.textColor,
                line: leg.line,
                type: leg.type
            }))
        }))
    }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=900"
        }
    });
};