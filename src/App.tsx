import { lazy, useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from "react-router-dom";
import { CssBaseline, Fab, Slide } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ArrowBack } from "@mui/icons-material";
import { Toaster } from 'react-hot-toast';
import { Suspense } from './components/Suspense';
import { City } from './util/typings';
import cities from "./util/cities.json";
import isDark from './util/isDark';
import ErrorBoundary from './components/ErrorBoundary';
import DocumentMeta from './components/DocumentMeta';

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

    <ErrorBoundary>
      <Routes>
        <Route index element={<CityPicker />} />
        <Route path="city" element={<DocumentMeta title={`Wybór miasta - zbiorkom.live`}><Suspense><CitySelection /></Suspense></DocumentMeta>} />
        {Object.keys(cities).map((city) => {
          let name = city as City;
          let cityData = cities[name];

          return <Route path={city} key={city}>
            <Route index element={<DocumentMeta title={`${cityData.name} - zbiorkom.live`} description={`Autobusy, tramwaje i pociągi na żywo w mieście ${cityData.name}. Komunikaty, utrudnienia i odjazdy z przystanków`}><Suspense><Index city={name} /></Suspense></DocumentMeta>} />
            <Route path="map" element={<DocumentMeta title={`${cityData.name} Mapa - zbiorkom.live`} description={`Gdzie jest autobus, tramwaj, pociąg na żywo w mieście ${cityData.name}`}><Suspense><Map city={name} userLocation={userLocation} style={{ position: "absolute" }}><CityMap city={name} /></Map></Suspense></DocumentMeta>} />
            {cityData.api.trip && <Route path="trip" element={<Suspense><Trip city={name} /></Suspense>} />}
            {cityData.api.stops && <>
              <Route path="stops" element={<DocumentMeta title={`${cityData.name} Lista przystanków - zbiorkom.live`} description={`Lista wszystkich przystanków w mieście ${cityData.name}`}><Suspense><StopSearch city={name} location={userLocation} /></Suspense></DocumentMeta>} />
              <Route path="stop/:stopId" element={<Suspense><StopDepartures city={name} /></Suspense>} />
            </>}
            {cityData.api.brigades && <>
              <Route path="brigades" element={<DocumentMeta title={`${cityData.name} Rozkład brygad - zbiorkom.live`} description={`Rozkład brygad w mieście ${cityData.name}`}><Suspense><Brigades city={name} /></Suspense></DocumentMeta>} />
              <Route path="brigade/:line/:brigade" element={<Suspense><Brigade city={name} /></Suspense>} />
            </>}
            {cityData.api.bikes && <Route path="bikes" element={<DocumentMeta title={`${cityData.name} Stacje rowerów miejskich - zbiorkom.live`} description={`Zobacz liczbę rowerów i wolnych stojaków na stacjach rowerowych w mieście ${cityData.name}!`}><Suspense><Bikes city={name} location={userLocation} /></Suspense></DocumentMeta>} />}
            {cityData.api.parkings && <Route path="parkings" element={<DocumentMeta title={`${cityData.name} Parkingi - zbiorkom.live`} description={`Zobacz wolne miejsca parkingowe w mieście ${cityData.name}!`}></DocumentMeta>} />}
            {cityData.api.alerts && <>
              <Route path="alerts" element={<DocumentMeta title={`${cityData.name} Komunikaty - zbiorkom.live`} description={`Zobacz komunikaty i utrudnienia w komunikacji w mieście ${cityData.name}!`}><Suspense><Alerts city={name} /></Suspense></DocumentMeta>} />
              <Route path="alert" element={<Suspense><Alert city={name} /></Suspense>} />
            </>}
            <Route path="settings/*" element={<DocumentMeta title={`${cityData.name} Ustawienia - zbiorkom.live`}><Suspense><Settings city={name} /></Suspense></DocumentMeta>} />
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