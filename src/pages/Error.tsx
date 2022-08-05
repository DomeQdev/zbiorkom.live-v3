import { Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DirectionsBus } from "@mui/icons-material";

export default ({ text, message }: { text: string, message?: string }) => {
    const navigate = useNavigate();
    
    return <div style={{ textAlign: "center", marginTop: 50 }}>
        <DirectionsBus style={{ fontSize: 128 }}/>
        <h1>{text}</h1>
        <p>{message}</p>
        <Button variant="contained" startIcon={<Home />} onClick={() => navigate("/")}>Strona główna</Button>
    </div>;
};
