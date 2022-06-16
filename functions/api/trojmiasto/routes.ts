import routes from "./util/routes.json";

export const onRequestGet = async () => {
    return new Response(JSON.stringify(Object.values(routes).filter(x => x.showFilter)), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=42300"
        }
    });
}