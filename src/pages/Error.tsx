import { Button } from "@mui/material";
import { Home, Refresh } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default ({ text, message, error }: { text: string, message?: string, error?: Error }) => {
    return <div style={{ textAlign: "center", marginTop: 50 }}>
        <img src="/img/logo192.png" width="128" height="128" />
        <h1>{text}</h1>
        <p>{message}</p>
        {error ? <Button variant="contained" startIcon={<Refresh />} onClick={() => window.location.reload()}>Odśwież</Button> : <Button variant="contained" startIcon={<Home />} component={Link} to="/">Strona główna</Button>}
    </div>;
};