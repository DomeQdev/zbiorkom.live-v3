import { Drawer, Box } from "@mui/material";

export default ({ open, onClose, padding, children }: { open: boolean, onClose?: () => void, padding?: boolean, children: React.ReactElement | React.ReactElement[] }) => {
    return <Drawer
        open={open}
        onClose={onClose || (() => {})}
        anchor="bottom"
        variant="temporary"
        PaperProps={{
            sx: {
                marginLeft: "auto",
                marginRight: "auto",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                ["@media (max-width: 699px)"]: {
                    width: "100%"
                },
                ["@media (min-width: 700px)"]: {
                    width: "700px"
                },
                maxHeight: "50vh"
            }
        }}
    >
        {padding ? <Box sx={{ width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: 2, marginBottom: 2, textAlign: "center" }}>{children}</Box> : children}
    </Drawer>
};