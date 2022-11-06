import { Avatar, Dialog, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Close, ElectricBike, LockOpen, PedalBike } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { BikeStation } from "../../util/typings";

export default ({ station }: { station: BikeStation }) => {
    const navigate = useNavigate();

    return <Dialog
        open
        fullWidth
        onClose={() => navigate(".", { replace: true })}
        sx={{ maxHeight: "80%", my: "auto" }}
    >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>{station[1]}<IconButton onClick={() => navigate(".", { replace: true })}><Close /></IconButton></DialogTitle>
        <List>
            {station[3][0] != null && <ListItem>
                <ListItemAvatar><Avatar><PedalBike /></Avatar></ListItemAvatar>
                <ListItemText primary={station[3][0]} secondary="Zwykłe rowery" />
            </ListItem>}
            {station[3][1] != null && <ListItem>
                <ListItemAvatar><Avatar><ElectricBike /></Avatar></ListItemAvatar>
                <ListItemText primary={station[3][1]} secondary="Elektryczne rowery" />
            </ListItem>}
            <ListItem>
                <ListItemAvatar><Avatar><LockOpen /></Avatar></ListItemAvatar>
                <ListItemText primary={station[3][2]} secondary="Wolne stojaki" />
            </ListItem>
        </List>
    </Dialog>;
};