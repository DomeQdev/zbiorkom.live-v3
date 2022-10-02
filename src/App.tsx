import { lazy, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, CssBaseline, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DirectionsBus } from "@mui/icons-material";
import { Toaster } from 'react-hot-toast';
import { Suspense } from './components/Suspense';
import { City } from './util/typings';
import cities from "./util/cities.json";
import isDark from './util/isDark';
import ErrorBoundary from './components/ErrorBoundary';

const Alerts = lazy(() => import("./pages/Alerts"));
const Bikes = lazy(() => import("./pages/Bikes"));
const Brigade = lazy(() => import("./pages/Brigade"));
const Brigades = lazy(() => import("./pages/Brigades"));
const CityMap = lazy(() => import("./pages/CityMap"));
const CitySelection = lazy(() => import("./pages/CitySelection"));
const Error = lazy(() => import("./pages/Error"));
const Index = lazy(() => import("./pages/Index"));
const Map = lazy(() => import("./components/Map"));
const StopDepartures = lazy(() => import("./pages/StopDepartures"));
const StopSearch = lazy(() => import("./pages/StopSearch"));
const Settings = lazy(() => import("./pages/Settings"));

export default () => {
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
          {Object.keys(cities).map((city) => <Route key={city} path={`${city}/*`} element={<Typography variant="h6" noWrap sx={{ flexGrow: 1, textDecoration: "none", color: "white" }} component={Link} to={`/${city}`}>{cities[city as City].name}</Typography>} />)}
          <Route path="*" element={<Typography variant="h6" noWrap sx={{ flexGrow: 1, textDecoration: "none", color: "white" }} component={Link} to="/">zbiorkom.live</Typography>} />
        </Routes>
        <Box></Box>
      </Toolbar>
    </AppBar>
    <ErrorBoundary>
      <Routes>
        <Route index element={<CityPicker />} />
        <Route path="city" element={<Suspense><CitySelection /></Suspense>} />
        {Object.keys(cities).map((city) => {
          let name = city as City;
          let cityData = cities[name];

          return <Route path={city} key={city}>
            <Route index element={<Suspense><Index city={name} /></Suspense>} />
            <Route path="map" element={<Suspense><Map city={name} style={{ position: "absolute" }}><CityMap city={name} /></Map></Suspense>} />
            {cityData.api.stops && <>
              <Route path="stops" element={<Suspense><StopSearch city={name} /></Suspense>} />
              <Route path="stop/:stopId" element={<Suspense><StopDepartures city={name} /></Suspense>} />
            </>}
            {cityData.api.brigades && <>
              <Route path="brigades" element={<Suspense><Brigades city={name} /></Suspense>} />
              <Route path="brigade/:line/:brigade" element={<Suspense><Brigade city={name} /></Suspense>} />
            </>}
            {cityData.api.bikes && <Route path="bikes" element={<Suspense><Bikes city={name} /></Suspense>} />}
            {cityData.api.parkings && <Route path="parkings" element={<></>} />}
            {cityData.api.alerts && <>
              <Route path="alerts" element={<Suspense><Alerts city={name} /></Suspense>} />
              <Route path="alert" element={<></>} />
            </>}
            <Route path="settings/*" element={<Suspense><Settings city={name} /></Suspense>} />
          </Route>;
        })}
        <Route path="*" element={<Suspense><Error text={"404"} message={"Nie znaleziono strony"} /></Suspense>} />
      </Routes>
    </ErrorBoundary>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
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
    navigate(`/${ls || "warsaw"}`);
  }, []);

  return null;
}