import { Backdrop as BackDrop, CircularProgress } from "@mui/material";
import { Suspense as SuSpense } from "react";
const { version } = require("../../package.json");

const Backdrop = () => <BackDrop sx={{ color: "#5aa159", zIndex: 10e10, flexDirection: "column" }} open>
  <CircularProgress color="inherit" />
  <h2 style={{ bottom: 25, position: "absolute" }}>{version}</h2>
</BackDrop>;

const Suspense = ({ children }: { children: React.ReactNode }) => <SuSpense fallback={<Backdrop />}>{children}</SuSpense>;

export { Backdrop, Suspense };