import { lazy, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DirectionsBus, Settings } from "@mui/icons-material";
import { Toaster } from 'react-hot-toast';
import { Suspense } from './components/Suspense';
import { City } from './util/typings';
import cities from "./cities.json";

const IndexMobile = lazy(() => import("./pages/IndexMobile"));
const IndexDesktop = lazy(() => import("./pages/IndexDesktop"));
const CityMap = lazy(() => import("./pages/CityMap"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Brigades = lazy(() => import("./pages/Brigades"));
const Brigade = lazy(() => import("./pages/Brigade"));
const Planner = lazy(() => import("./pages/Planner"));
const Error = lazy(() => import("./pages/Error"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const Map = lazy(() => import("./components/Map"));
const DetectDevice = lazy(() => import("./components/DetectDevice"));

export default () => {
  const navigate = useNavigate();
  const [settingsActive, setSettingsActive] = useState(false);

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
        <Typography variant="h6" noWrap component="div" onClick={() => navigate("/")} sx={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
          <DirectionsBus />&nbsp;<Routes>{Object.keys(cities).map((city) => <Route path={`${city}/*`} element={<>{cities[city as City].name}</>} key={city} />)}<Route path="*" element={<>zbiorkom.live</>} /></Routes>
        </Typography>
        <div>
          <IconButton href="https://discord.gg/QYRswCH6Gw" target="_blank"><img src="/img/discord.png" alt="discord logo" width="24" height="18" /></IconButton>
          <IconButton onClick={() => setSettingsActive(true)}><Settings style={{ fill: "white" }} /></IconButton>
        </div>
      </Toolbar>
    </AppBar>
    <Routes>
      {Object.keys(cities).map((city) => {
        let name = city as City;
        let cityData = cities[name];

        return <Route path={city} key={city}>
          <Route index element={<Suspense><DetectDevice desktop={<IndexDesktop city={name} />} mobile={<IndexMobile city={name} />} /></Suspense>} />
          <Route path="map" element={<Suspense><Map city={name}><CityMap city={name} /></Map></Suspense>} />
          {cityData.api.planner && <Route path="planner/*" element={<Suspense><Planner /></Suspense>} />}
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
            <Route path="alerts" element={<Suspense><Alerts city={name} /></Suspense>} />
            <Route path="alert/:alertId" element={<></>} />
          </>}
        </Route>
      })}
      <Route path="*" element={<Suspense><Error text={"404"} message={"Nie znaleziono strony (lub jeste?? na stronie g????wnej :o)"} /></Suspense>} />
    </Routes>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
    {settingsActive && <Suspense><SettingsPage onClose={() => setSettingsActive(false)} /></Suspense>}
  </ThemeProvider>;
};