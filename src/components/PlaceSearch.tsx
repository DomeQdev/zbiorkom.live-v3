import { Box, Slide, TextField, Dialog } from "@mui/material";
import { ArrowBack, Search } from "@mui/icons-material";
import { forwardRef, ReactElement, Ref, useState } from "react";
import { Stop } from "../util/typings";
import { TransitionProps } from "@mui/material/transitions";

export default ({ onData }: { onData: (name: string, location: [number, number]) => void }) => {
    const [input, setInput] = useState<string>();
    const [stopResults, setStopResults] = useState<Stop[]>();

    onData("es", [1,2])

    const Transition = forwardRef((
        props: TransitionProps & {
            children: ReactElement
        },
        ref: Ref<unknown>
    ) => <Slide direction="up" ref={ref} {...props} />)

    return <Dialog
        open
        fullWidth
        TransitionComponent={Transition}
    >
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <ArrowBack sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField id="input-with-sx" label="With sx" variant="standard" />
        </Box>
    </Dialog>;
};