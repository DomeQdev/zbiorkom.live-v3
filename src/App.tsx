import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { lazy, useEffect, useState } from 'react';
import { Suspense } from './components/Suspense';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { City } from './util/typings';
import DocumentMeta from './components/DocumentMeta';
import cities from "./util/cities.json";
import AppBar from "./pages/AppBar";
import isDark from './util/isDark';

const Alerts = lazy(() => import("./pages/Alerts"));
const Alert = lazy(() => import("./pages/Alert"));
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
    const [title, setTitle] = useState<React.ReactNode>();
    const [icon, setIcon] = useState<React.ReactNode>();
    const location = useLocation();
    const navigate = useNavigate();
    const cityData = cities[city];
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


    return <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar city={city} title={title} icon={location.state || location.search ? undefined : (() => navigate(".", { state: "search", relative: "path" }))} iconType="search" />

        <Routes>
            <Route
                path="/"
                element={<Navigate replace to={`/${city}`} />}
            />
            <Route
                path="city"
                element={<DocumentMeta title={`Wybór miasta - zbiorkom.live`}><Suspense><CitySelection /></Suspense></DocumentMeta>}
            />
            <Route path={city}>
                <Route
                    index
                    element={<DocumentMeta title={`${cityData.name} Mapa - zbiorkom.live`} description={`Gdzie jest autobus, tramwaj, pociąg na żywo w mieście ${cityData.name}`}><Suspense><Map location={cityData.location as [number, number]} style={{ position: "absolute" }}><CityMap city={city} setTitle={setTitle} setIcon={setIcon} /></Map></Suspense></DocumentMeta>}
                />
                <Route
                    path="trip"
                    element={<Suspense><Trip city={city} /></Suspense>}
                />
                <Route
                    path="stops"
                    element={<DocumentMeta title={`${cityData.name} Lista przystanków - zbiorkom.live`} description={`Lista wszystkich przystanków w mieście ${cityData.name}`}><Suspense><StopSearch city={city} location={userLocation} /></Suspense></DocumentMeta>}
                />
                <Route
                    path="stops/:stopId"
                    element={<Suspense><StopDepartures city={city} /></Suspense>}
                />
                {cityData.functions.includes("brigades") && <>
                    <Route
                        path="brigades"
                        element={<DocumentMeta title={`${cityData.name} Rozkład brygad - zbiorkom.live`} description={`Rozkład brygad w mieście ${cityData.name}`}><Suspense><Brigades city={city} /></Suspense></DocumentMeta>}
                    />
                    <Route
                        path="brigades/:brigade"
                        element={<Suspense><Brigade city={city} /></Suspense>}
                    />
                </>}
                {cityData.functions.includes("alerts") && <>
                    <Route path="alerts" element={<DocumentMeta title={`${cityData.name} Komunikaty - zbiorkom.live`} description={`Zobacz komunikaty i utrudnienia w komunikacji w mieście ${cityData.name}!`}><Suspense><Alerts city={city} /></Suspense></DocumentMeta>} />
                    <Route path="alert" element={<Suspense><Alert city={city} /></Suspense>} />
                </>}
                <Route path="settings/*" element={<DocumentMeta title={`${cityData.name} Ustawienia - zbiorkom.live`}><Suspense><Settings city={city} /></Suspense></DocumentMeta>} />
            </Route>
            <Route path="*" element={<Suspense><Error text={"404"} message={"Nie znaleziono strony"} /></Suspense>} />
        </Routes>
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