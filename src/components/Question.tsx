import { DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Divider } from "@mui/material";
import TempDrawer from "./TempDrawer";

export default ({ title, message, options }: { title: string, message: string, options: { name: string, onClick: () => void }[] }) => {
    return <TempDrawer open>
        <DialogTitle>{title}</DialogTitle>
        <Divider />
        <DialogContent>
            <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
            {options.map(({ name, onClick }) => <Button key={name} onClick={onClick}>{name}</Button>)}
        </DialogActions>
    </TempDrawer>;
};