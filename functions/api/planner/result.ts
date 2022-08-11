export const onRequestPatch = async ({ request, env }) => {
    const { key, id, city, from, to, transfers, type, facilities }: { key: string, id: number, city: "warsaw" | "poznan", from: [number, number], to: [number, number], transfers: number, type: "quick" | "optimised" | "transfers", facilities?: ["wheelchair" | "ac" | "bike"] } = await request.json();
    if (!key || !id || (city !== "warsaw" && city !== "poznan") || (!from || isNaN(from[0]) || isNaN(from[1])) || (!to || isNaN(to[0]) || isNaN(to[1])) || (!transfers || isNaN(transfers)) || (type !== "quick" && type !== "optimised" && type !== "transfers")) return new Response(JSON.stringify({ error: "Provide city='warsaw' | 'poznan', from=[number,number], to=[number,number], transfers=number, type='quick' | 'optimised' | 'transfers', facilities?='wheelchair' | 'ac' | 'bike'[]" }), {
        status: 400,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=31556926"
        }
    });

    let now = Date.now();
    let resp = await fetch(`https://api.zbiorkom.live/${city}/planner?from=${from[0]},${from[1]}&to=${to[0]},${to[1]}&transfers=${transfers}&type=${type}${(facilities && facilities[0]) ? `&facilities=${facilities.join(",")}` : ""}&apikey=${env.ZBIORKOM_PLANNER_API_KEY}&_cf=${key}`, {
        //@ts-ignore
        cf: {
            cacheTtl: 31536000,
            cacheEverything: true
        },
        keepalive: true
    }).then(res => res.json()).catch(() => null);

    if (!resp || resp?.error) return new Response(JSON.stringify({ error: "Server returned error", e: resp?.error }), { status: 419 });

    let route = resp[id];
    if (!route) return new Response(JSON.stringify({ error: "No route found" }), { status: 404 });

    return new Response(route, {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=31556926"
        }
    });
};