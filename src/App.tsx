import { lazy, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, CssBaseline, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DarkMode, DirectionsBus, LightMode, Settings } from "@mui/icons-material";
import toast, { Toaster } from 'react-hot-toast';
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

  useEffect(() => {
    toast.error("Z powodów technicznych, wersja beta została wyłączona do odwołania. Prosimy o korzystanie z zbiorkom.live.", {
      duration: Infinity
    });
  }, []);

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
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
    <div>418: I'm a teapot.</div>
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