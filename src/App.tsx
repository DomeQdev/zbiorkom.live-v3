import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { FaDiscord } from "react-icons/fa";
import { IoMdSettings } from 'react-icons/io';
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import cities from "./cities.json";

import Index from "./pages/Index";
import Error from "./pages/Error";
import Map from './components/Map';

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
          <IconButton href="https://discord.gg/QYRswCH6Gw" target="_blank"><FaDiscord style={{ fill: "white" }} /></IconButton>
          <IconButton onClick={() => navigate("/settings")}><IoMdSettings style={{ fill: "white" }} /></IconButton>
        </div>
      </Toolbar>
    </AppBar>
    <Routes>
      {Object.keys(cities).map((city) => {
        let name = city as keyof typeof cities;
        let cityData = cities[name];
        return <Route path={`${city}`} key={city}>
          <Route index element={<Index city={name} />} />
          <Route path="map" element={<Map city={name}></Map>} />
          {(cityData.api.stops && cityData.api.stop_departures) && <>
            <Route path="stops" element={<></>} />
            <Route path="stop/:stop" element={<></>} />
          </>}
          {(cityData.api.brigades && cityData.api.brigade_schedule) && <>
            <Route path="brigades" element={<></>} />
            <Route path="brigade/:line/:brigade" element={<></>} />
          </>}
          {cityData.api.bikes && <>
            <Route path="bikes" element={<></>} />
            <Route path="bike/:station" element={<></>} />
          </>}
          {cityData.api.parkings && <>
            <Route path="parkings" element={<></>} />
            <Route path="parking/:parking" element={<></>} />
          </>}
          {cityData.api.alerts && <>
            <Route path="alerts" element={<></>} />
            <Route path="alert/:alert" element={<></>} />
          </>}
        </Route>
      })}
      <Route path="*" element={<Error text={"404"} message={"Nie znaleziono strony"} />} />
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