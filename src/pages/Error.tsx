import { Button } from "@mui/material";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default ({ text, message }: { text: string, message?: string }) => {
    const navigate = useNavigate();
    return <div style={{ textAlign: "center", marginTop: 50 }}>
        <img src="/img/logo192.png" width="128" height="128" />
        <h1>{text}</h1>
        <p>{message}</p>
        <Button variant="contained" startIcon={<FaHome />} onClick={() => navigate("/")}>Strona główna</Button>
    </div>;
};