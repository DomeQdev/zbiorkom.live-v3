import { lazy, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, CssBaseline, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DarkMode, DirectionsBus, LightMode, Settings } from "@mui/icons-material";
import { Toaster } from 'react-hot-toast';
import { Suspense } from './components/Suspense';
import { City } from './util/typings';
import cities from "./util/cities.json";
import isDark from './util/isDark';

const IndexMobile = lazy(() => import("./pages/IndexMobile"));
const IndexDesktop = lazy(() => import("./pages/IndexDesktop"));
const CityMap = lazy(() => import("./pages/CityMap"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Brigades = lazy(() => import("./pages/Brigades"));
const Brigade = lazy(() => import("./pages/Brigade"));
const StopDepartures = lazy(() => import("./pages/StopDepartures"));
const Error = lazy(() => import("./pages/Error"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const Map = lazy(() => import("./components/Map"));
const DetectDevice = lazy(() => import("./components/DetectDevice"));

export default () => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const darkMode = isDark();

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#383838" : "#fff"
      },
      primary: {
        main: "#5aa159",
        contrastText: "#fff"
      }
    },
    components: {
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: "#5aa159",
            color: "#fff"
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: darkMode ? "#383838" : "#fff",
            color: darkMode ? "white" : "black"
          }
        }
      }
    }
  });

  if (darkMode) {
    document.body.style.setProperty("--rsbs-bg", "#383838");
    document.body.style.setProperty("--rsbs-handle-bg", "rgba(255,255,255,0.3)");
  }

  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppBar position="sticky" sx={{ bgcolor: "#5aa159", color: "white" }}>
      <Toolbar>
        <IconButton edge="start" sx={{ color: "white", pointerEvents: "none" }}><DirectionsBus /></IconButton>
        <Routes>
          {Object.keys(cities).map((city) => <Route key={city} path={`${city}/*`} element={<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate(`/${city}`)}>{cities[city as City].name}</Typography>} />)}
          <Route path="*" element={<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>zbiorkom.live</Typography>} />
        </Routes>
        <Box>
          <IconButton href="https://discord.gg/QYRswCH6Gw" target="_blank"><img src="/img/discord.png" alt="discord logo" width="24" height="18" /></IconButton>
          <IconButton onClick={() => {
            localStorage.setItem("theme", darkMode ? "light" : "dark");
            window.location.reload();
          }}>{darkMode ? <LightMode sx={{ fill: "white" }} /> : <DarkMode sx={{ fill: "white" }} />}</IconButton>
          <IconButton edge="end" onClick={() => navigate(pathname, { state: "settings" })}><Settings sx={{ fill: "white" }} /></IconButton>
        </Box>
      </Toolbar>
    </AppBar>
    <Routes>
      <Route index element={<CityPicker />} />
      {Object.keys(cities).map((city) => {
        let name = city as City;
        let cityData = cities[name];

        return <Route path={city} key={city}>
          <Route index element={<Suspense><DetectDevice desktop={<IndexDesktop city={name} />} mobile={<IndexMobile city={name} />} /></Suspense>} />
          <Route path="map" element={<Suspense><Map city={name} style={{ position: "absolute" }}><CityMap city={name} /></Map></Suspense>} />
          {cityData.api.stops && <>
            <Route path="stops" element={<></>} />
            <Route path="stop/:stopId" element={<Suspense><StopDepartures city={name} /></Suspense>} />
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
      <Route path="*" element={<Suspense><Error text={"404"} message={"Nie znaleziono strony"} /></Suspense>} />
    </Routes>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
    <Suspense><SettingsPage open={state === "settings"} onClose={() => navigate(pathname, { state: null, replace: true })} /></Suspense>
  </ThemeProvider>;
};

function CityPicker() {
  const navigate = useNavigate();
  useEffect(() => {
    let ls = localStorage.getItem("city") as City;
    if (!ls || !cities[ls]) {
      localStorage.setItem("city", "warsaw");
      navigate("/warsaw");
    }
    navigate(`/${ls}`);
  }, []);

  return null;
}