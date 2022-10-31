import { Divider } from "@mui/material";

export default ({ width }: { width: string | number }) => {
    return localStorage.getItem("ads") === "true" ? <div style={{ width }}>
        <ins
            className="adsbygoogle"
            style={{ display: "block", width: width }}
            data-ad-format="fluid"
            data-ad-layout-key="-ff+5q+5e-d4+4m"
            data-ad-client="ca-pub-7576926722331812"
            data-ad-slot="6847252094"
        />
        <Divider />
    </div> : <></>;
};