import { lazy } from 'react';
import { Suspense } from './components/Suspense';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Settings } from "@mui/icons-material";
import { City } from './util/typings';
import cities from "./cities.json";

const Index = lazy(() => import("./pages/Index"));
const CityMap = lazy(() => import("./pages/CityMap"));
const Brigades = lazy(() => import("./pages/Brigades"));
const Brigade = lazy(() => import("./pages/Brigade"));
const Error = lazy(() => import("./pages/Error"));

const Map = lazy(() => import("./components/Map"));

export default () => {
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#5aa159",
        contrastText: "#fff"
      }
    },
    components: {
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: "#5aa159"
          }
        }
      }
    }
  });

  return <ThemeProvider theme={theme}>
    <AppBar position="sticky">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap component="div" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
          zbiorkom.live
        </Typography>
        <div>
          <IconButton href="https://discord.gg/QYRswCH6Gw" target="_blank"><img src="/img/discord.png" alt="discord logo" width="24" height="18" /></IconButton>
          <IconButton onClick={() => navigate("/settings")}><Settings style={{ fill: "white" }} /></IconButton>
        </div>
      </Toolbar>
    </AppBar>
    <Routes>
      {Object.keys(cities).map((city) => {
        let name = city as City;
        let cityData = cities[name];

        return <Route path={city} key={city}>
          <Route index element={<Suspense><Index city={name} /></Suspense>} />
          <Route path="map" element={<Suspense><Map city={name}><CityMap city={name} /></Map></Suspense>} />
          {cityData.api.stops && <>
            <Route path="stops" element={<></>} />
            <Route path="stop/:stopId" element={<></>} />
          </>}
          {cityData.api.brigades && <>
            <Route path="brigades" element={<Suspense><Brigades city={name} /></Suspense>} />
            <Route path="brigade/:line/:brigade" element={<Suspense><Brigade city={name} /></Suspense>} />
          </>}
          {cityData.api.bikes && <>
            <Route path="bikes" element={<></>} />
            <Route path="bike/:stationId" element={<></>} />
          </>}
          {cityData.api.parkings && <>
            <Route path="parkings" element={<></>} />
            <Route path="parking/:parkingId" element={<></>} />
          </>}
          {cityData.api.alerts && <>
            <Route path="alerts" element={<></>} />
            <Route path="alert/:alertId" element={<></>} />
          </>}
        </Route>
      })}
      <Route path="*" element={<Suspense><Error text={"404"} message={"Nie znaleziono strony"} /></Suspense>} />
    </Routes>
    <ToastContainer
      position="top-left"
      autoClose={7500}
      newestOnTop
      theme="dark"
      pauseOnFocusLoss={false}
      limit={5}
      pauseOnHover
    />
  </ThemeProvider>;
};