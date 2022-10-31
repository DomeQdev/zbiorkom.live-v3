import { useEffect } from "react";

const ads = {
    "in-feed": {
        "data-ad-format": "fluid",
        "data-ad-layout-key": "-fv+64+31-d5+c4",
        "data-ad-slot": "6847252094"
    },
    "multiplex": {
        "data-ad-format": "autorelaxed",
        "data-ad-slot": "8102593631"
    }
};

export default ({ width, height, place, before, after }: { width: string | number, height: number, place: string, before?: React.ReactNode, after?: React.ReactNode }) => {
    const places: string[] = JSON.parse(localStorage.getItem("ads_places") || "[]");
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) { }
    }, []);

    return localStorage.getItem("ads") === "true" && (!places.length || places.includes(place)) ? <div style={{ width }}>
        {before}
        <ins
            className="adsbygoogle"
            style={{ display: "block", width, height }}
            data-ad-client="ca-pub-7576926722331812"
            {...ads[height > 160 ? "multiplex" : "in-feed"]}
        />
        {after}
    </div> : <></>;
};