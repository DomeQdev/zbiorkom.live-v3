import { lazy, useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from "react-router-dom";
import { CssBaseline, Dialog, DialogTitle, DialogActions, Button, DialogContent, Fab, Slide } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ArrowBack } from "@mui/icons-material";
import { Toaster } from 'react-hot-toast';
import { Suspense } from './components/Suspense';
import { City } from './util/typings';
import cities from "./util/cities.json";
import isDark from './util/isDark';
import ErrorBoundary from './components/ErrorBoundary';

const Alerts = lazy(() => import("./pages/Alerts"));
const Alert = lazy(() => import("./pages/Alert"));
const Bikes = lazy(() => import("./pages/Bikes"));
const Brigade = lazy(() => import("./pages/Brigade"));
const Brigades = lazy(() => import("./pages/Brigades"));
const CityMap = lazy(() => import("./pages/CityMap"));
const CitySelection = lazy(() => import("./pages/CitySelection"));
const Error = lazy(() => import("./pages/Error"));
const Index = lazy(() => import("./pages/Index"));
const Map = lazy(() => import("./components/Map"));
const Settings = lazy(() => import("./pages/Settings"));
const StopDepartures = lazy(() => import("./pages/StopDepartures"));
const StopSearch = lazy(() => import("./pages/StopSearch"));
const Trip = lazy(() => import("./pages/Trip"));

export default () => {
  const [userLocation, setUserLocation] = useState<GeolocationPosition>();
  const location = useLocation();
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

  useEffect(() => {
    if (darkMode) {
      document.body.style.setProperty("--rsbs-bg", "#383838");
      document.body.style.setProperty("--rsbs-handle-bg", "rgba(255,255,255,0.3)");
    }
    if (localStorage.getItem("ads") === "true") {
      const script = document.createElement('script');
      script.setAttribute("src", "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7576926722331812");
      script.setAttribute('async', '');
      script.onload = () => console.log("Ads loaded");
      document.head.appendChild(script);
    }

    let id = navigator.geolocation.watchPosition(setUserLocation, console.error, { timeout: 10000 });
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const fab = useMemo(() => {
    let phLength = location.pathname.split("/").filter(x => x).length;

    return {
      show: phLength > 1,
      link: location.pathname.includes("stop") || location.pathname.includes("trip") || location.pathname.includes("brigade") || location.pathname.includes("alert") ? "back" : (location.search || location.state ? location.pathname : "../")
    };
  }, [location]);

  return <ThemeProvider theme={theme}>
    <CssBaseline />

    <Slide in={fab.show}>
      <Fab
        size="small"
        color="primary"
        sx={{ position: "fixed", zIndex: 30000, top: 16, left: 16 }}
        component={Link}
        to={fab.link}
        state=""
        relative="path"
        replace
        onClick={(e) => {
          if (fab.link === "back") {
            e.preventDefault();
            window.history.back();
          }
        }}
      >
        <ArrowBack />
      </Fab>
    </Slide>

    <Dialog open={!localStorage.getItem("seen_movement")}>
      <DialogTitle>Nowa wersja aplikacji.</DialogTitle>
      <DialogContent>Właśnie widzisz nową wersję aplikacji. Ta wersja ma większość funkcji starej wersji z wyjątkiem: dokładnych informacji o pojeździe, filtrowania po modelu pojazdu i zajezdni oraz oznaczeń specjalnych i ekologicznych pojazdów.<h3>Chcę używac:</h3></DialogContent>
      <DialogActions>
        <Button onClick={() => {
          localStorage.setItem("seen_movement", "1");
          window.location.reload();
        }} variant="outlined">Nowej wersji (nie pokazuj ponownie)</Button>
        <Button href="https://old.transitapi.me" onClick={() => alert("Jeśli nadal chcesz używać starej wersji, pamiętaj, że adres został zmieniony. Nowy adres starej wersji to 🔗 https://old.transitapi.me. Zostaniesz do niej teraz przekierowany.")}>Starej wersji (Nowy adres: old.transitapi.me)</Button>
      </DialogActions>
    </Dialog>

    <ErrorBoundary>
      <Routes>
        <Route index element={<CityPicker />} />
        <Route path="city" element={<Suspense><CitySelection /></Suspense>} />
        {Object.keys(cities).map((city) => {
          let name = city as City;
          let cityData = cities[name];

          return <Route path={city} key={city}>
            <Route index element={<Suspense><Index city={name} /></Suspense>} />
            <Route path="map" element={<Suspense><Map city={name} userLocation={userLocation} style={{ position: "absolute" }}><CityMap city={name} /></Map></Suspense>} />
            {cityData.api.trip && <Route path="trip" element={<Suspense><Trip city={name} /></Suspense>} />}
            {cityData.api.stops && <>
              <Route path="stops" element={<Suspense><StopSearch city={name} location={userLocation} /></Suspense>} />
              <Route path="stop/:stopId" element={<Suspense><StopDepartures city={name} /></Suspense>} />
            </>}
            {cityData.api.brigades && <>
              <Route path="brigades" element={<Suspense><Brigades city={name} /></Suspense>} />
              <Route path="brigade/:line/:brigade" element={<Suspense><Brigade city={name} /></Suspense>} />
            </>}
            {cityData.api.bikes && <Route path="bikes" element={<Suspense><Bikes city={name} location={userLocation} /></Suspense>} />}
            {cityData.api.parkings && <Route path="parkings" element={<></>} />}
            {cityData.api.alerts && <>
              <Route path="alerts" element={<Suspense><Alerts city={name} /></Suspense>} />
              <Route path="alert" element={<Suspense><Alert city={name} /></Suspense>} />
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
      toastOptions={{
        style: darkMode ? {
          background: "#363636",
          color: "#fff"
        } : {}
      }}
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