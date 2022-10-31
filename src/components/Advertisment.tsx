import { Divider } from "@mui/material";
import { useEffect } from "react";

export default ({ width, height }: { width: string | number, height?: string | number }) => {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    return localStorage.getItem("ads") === "true" ? <div style={{ width }}>
        <ins
            className="adsbygoogle"
            style={{ display: "block", width, height }}
            data-ad-format="fluid"
            data-ad-layout-key="-fv+64+31-d5+c4"
            data-ad-client="ca-pub-7576926722331812"
            data-ad-slot="6847252094"
        />
        <Divider />
    </div> : <></>;
};