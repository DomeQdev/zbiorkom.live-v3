import { Suspense as SuSpense } from "react";
import { Backdrop as BackDrop, CircularProgress } from "@mui/material";

const Backdrop = () => <BackDrop sx={{ color: '#16D113', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
  <CircularProgress color="inherit" />
</BackDrop>;

const Suspense = ({ children }: { children: React.ReactNode }) => <SuSpense fallback={<Backdrop />}>{children}</SuSpense>;

export { Backdrop, Suspense };