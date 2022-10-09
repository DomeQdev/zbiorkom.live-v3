import { Close, OpenInNew, Share } from "@mui/icons-material";
import { Box, Card, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getData } from "../util/api";
import { Alert, City } from "../util/typings";
import toast from "react-hot-toast";

export default ({ city }: { city: City }) => {
    const [alert, setAlert] = useState<Alert>();
    const [searchParams] = useSearchParams();
    const alertId = searchParams.get("alert");

    useEffect(() => {
        if (!alertId) return;
        getData("alert", city, {
            id: alertId
        }).then(setAlert).catch(() => toast.error("Fatalny błąd"));
    }, [alertId]);

    return <Box sx={{ width: "90%", mx: "auto", marginTop: 5 }}>
        {alert ? <>
            <Card variant="outlined" sx={{ bgcolor: "transparent", px: 3 }}>
                <h3 style={{ paddingBottom: 0, display: "flex", justifyContent: "space-between" }}>{alert.title}<IconButton component={Link} to="../alerts" sx={{ width: 40, height: 40 }}><Close /></IconButton></h3>
                <p>{!!alert.routes?.length && <><b>Dotyczy linii:</b> {alert.routes.join(", ")}<br /></>}
                {alert.start && <><b>Od:</b> {new Date(alert.start).toLocaleString()}<br /></>}
                {alert.end && <><b>Do:</b> {new Date(alert.end).toLocaleString()}</>}
                {alert.url && <IconButton href={alert.url} target="_blank"><OpenInNew /></IconButton>} <IconButton onClick={() => navigator.share({ url: window.location.href })}><Share /></IconButton></p>
            </Card>
            <div dangerouslySetInnerHTML={{ __html: alert.description! }} />
        </> : <>
        </>}
    </Box>;
};