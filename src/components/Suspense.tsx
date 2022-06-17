import { Suspense } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

export default ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    return <Suspense fallback={<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>}>{children}</Suspense>
};