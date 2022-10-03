const ads = {
    "display": {
        "data-ad-slot": "2662354294",
        "data-ad-format": "auto",
        "data-full-width-responsive": "true"
    },
    "in-feed": {
        "data-ad-format": "fluid",
        "data-ad-layout-key": "-fv+64+31-d5+c4",
        "data-ad-slot": "9802477716"
    },
    "in-article": {
        "data-ad-layout": "in-article",
        "data-ad-format": "fluid",
        "data-ad-slot": "3492505641"
    },
    "multiplex": {
        "data-ad-format": "autorelaxed",
        "data-ad-slot": "6190535767"
    }
};

export default ({ style, before, after, type }: { style: React.CSSProperties, before?: React.ReactNode, after?: React.ReactNode, type: "display" | "in-feed" | "in-article" | "multiplex" }) => {
    let adsEnabled = localStorage.getItem("ads") === "true";

    return adsEnabled ? <>
        {before}
        <ins
            className={"adsbygoogle"}
            data-ad-client={"ca-pub-7576926722331812"}
            style={style}
            {...ads[type]}
        />
        {after}
    </> : <></>;
};