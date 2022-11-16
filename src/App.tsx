import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { AppBar, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { lazy, useEffect, useMemo, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { ArrowBack, Menu } from "@mui/icons-material";
import DocumentMeta from './components/DocumentMeta';
import { Suspense } from './components/Suspense';
import { Toaster } from 'react-hot-toast';
import cities from "./util/cities.json";
import SideMenu from "./pages/SideMenu";
import { City } from './util/typings';
import isDark from './util/isDark';

const Alerts = lazy(() => import("./pages/Alerts"));
const Alert = lazy(() => import("./pages/Alert"));
const Bikes = lazy(() => import("./pages/Bikes"));
const Brigade = lazy(() => import("./pages/Brigade"));
const Brigades = lazy(() => import("./pages/Brigades"));
const CityMap = lazy(() => import("./pages/Map/Index"));
const CitySelection = lazy(() => import("./pages/CitySelection"));
const Error = lazy(() => import("./pages/Error"));
const Map = lazy(() => import("./components/Map"));
const Settings = lazy(() => import("./pages/Settings/Index"));
const StopDepartures = lazy(() => import("./pages/StopDepartures"));
const StopSearch = lazy(() => import("./pages/StopSearch"));
const Trip = lazy(() => import("./pages/Trip"));

export default ({ city }: { city: City }) => {
  const [userLocation, setUserLocation] = useState<GeolocationPosition>();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const darkMode = isDark();
  const cityData = cities[city];

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
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: darkMode ? "white" : "black"
          }
        }
      }
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.body.style.setProperty("--rsbs-bg", "#383838");
      document.body.style.setProperty("--rsbs-handle-bg", "rgba(255,255,255,0.3)");
    }

    let id = navigator.geolocation.watchPosition(setUserLocation, console.error, { timeout: 10000 });
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const fab = useMemo(() => {
    let phLength = location.pathname.split("/").filter(x => x).length;

    return {
      menu: phLength <= 2 && !location.state && !location.search
    };
  }, [location]);

  return <ThemeProvider theme={theme}>
    <CssBaseline />

    <SideMenu city={city} open={menuOpen} setOpen={setMenuOpen} />

    <AppBar sx={{
      transform: "translateX(-50%)",
      backgroundColor: "#5aa159",
      width: "calc(100% - 25px)",
      borderRadius: 1,
      left: "50%",
      my: 1
    }}>
      <Toolbar>
        <IconButton
          size="large"
          sx={{ color: "#fff", mr: 2 }}
          onClick={() => {
            if (location.search.includes("back=true")) window.history.back();
            if (fab.menu) setMenuOpen(true);
            else navigate(location.state || location.search ? "." : "../", { state: undefined, relative: "path", replace: true });
          }}
        >
          {fab.menu ? <Menu /> : <ArrowBack />}
        </IconButton>
        <Typography variant="h6" sx={{ color: "#fff", flexGrow: 1, left: "50%", position: "absolute", transform: "translate(-50%, 0)" }}>zbiorkom.live</Typography>
      </Toolbar>
    </AppBar>

    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate replace to={`/${city}`} />} />
        <Route path="city" element={<DocumentMeta title={`Wybór miasta - zbiorkom.live`}><Suspense><CitySelection /></Suspense></DocumentMeta>} />
        <Route path={city} key={city}>
          <Route index element={<DocumentMeta title={`${cityData.name} Mapa - zbiorkom.live`} description={`Gdzie jest autobus, tramwaj, pociąg na żywo w mieście ${cityData.name}`}><Suspense><Map city={city} style={{ position: "absolute" }}><CityMap city={city} /></Map></Suspense></DocumentMeta>} />
          {cityData.api.trip && <Route path="trip" element={<Suspense><Trip city={city} /></Suspense>} />}
          {cityData.api.stops && <>
            <Route path="stops" element={<DocumentMeta title={`${cityData.name} Lista przystanków - zbiorkom.live`} description={`Lista wszystkich przystanków w mieście ${cityData.name}`}><Suspense><StopSearch city={city} location={userLocation} /></Suspense></DocumentMeta>} />
            <Route path="stops/:stopId" element={<Suspense><StopDepartures city={city} /></Suspense>} />
          </>}
          {cityData.api.brigades && <>
            <Route path="brigades" element={<DocumentMeta title={`${cityData.name} Rozkład brygad - zbiorkom.live`} description={`Rozkład brygad w mieście ${cityData.name}`}><Suspense><Brigades city={city} /></Suspense></DocumentMeta>} />
            <Route path="brigades/:brigade" element={<Suspense><Brigade city={city} /></Suspense>} />
          </>}
          {cityData.api.bikes && <Route path="bikes" element={<DocumentMeta title={`${cityData.name} Stacje rowerów miejskich - zbiorkom.live`} description={`Zobacz liczbę rowerów i wolnych stojaków na stacjach rowerowych w mieście ${cityData.name}!`}><Suspense><Bikes city={city} location={userLocation} /></Suspense></DocumentMeta>} />}
          {cityData.api.parkings && <Route path="parkings" element={<DocumentMeta title={`${cityData.name} Parkingi - zbiorkom.live`} description={`Zobacz wolne miejsca parkingowe w mieście ${cityData.name}!`}></DocumentMeta>} />}
          {cityData.api.alerts && <>
            <Route path="alerts" element={<DocumentMeta title={`${cityData.name} Komunikaty - zbiorkom.live`} description={`Zobacz komunikaty i utrudnienia w komunikacji w mieście ${cityData.name}!`}><Suspense><Alerts city={city} /></Suspense></DocumentMeta>} />
            <Route path="alert" element={<Suspense><Alert city={city} /></Suspense>} />
          </>}
          <Route path="settings/*" element={<DocumentMeta title={`${cityData.name} Ustawienia - zbiorkom.live`}><Suspense><Settings city={city} /></Suspense></DocumentMeta>} />
        </Route>
        <Route path="*" element={<Suspense><Error text={"404"} message={"Nie znaleziono strony"} /></Suspense>} />
      </Routes>
    </ErrorBoundary>
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          ...(darkMode ? {
            background: "#363636",
            color: "#fff"
          } : {})
        }
      }}
    />
  </ThemeProvider>;
};