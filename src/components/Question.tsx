import { DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Divider } from "@mui/material";
import { BottomSheet } from "react-spring-bottom-sheet";

export default ({ title, message, options }: { title: string, message: string, options: { name: string, onClick: () => void }[] }) => {
    return <BottomSheet open>
        <DialogTitle>{title}</DialogTitle>
        <Divider />
        <DialogContent>
            <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
            {options.map(({ name, onClick }) => <Button key={name} onClick={onClick}>{name}</Button>)}
        </DialogActions>
    </BottomSheet>;
};