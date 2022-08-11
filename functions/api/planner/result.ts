export const onRequestPatch = async ({ request, env }) => {
    const { key, id }: { key: string, id: number } = await request.json();
    if (!key || (!id && id !== 0)) return new Response(JSON.stringify({ error: "Provide key=string, id=number" }), {
        status: 400,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=31556926"
        }
    });

    let routes = env.ZBIORKOM.get(key);
    return new Response(JSON.stringify({
        key: key,
        id: id,
        routes
    }))
    if (!routes) return new Response(JSON.stringify({ error: "Routes not found" }), { status: 404 });

    routes = JSON.stringify(routes)
    let route = routes[id];
    if (!route) return new Response(JSON.stringify({ error: "Route not found", routes }), { status: 404 });

    return new Response(JSON.stringify(route), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=31556926"
        }
    });
};