import { Backdrop } from "./components/Suspense";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import cities from "./util/cities.json";
import { City } from "./util/typings";
import App from "./App";

export default () => {
    const [city, setCity] = useState<City>();
    const navigate = useNavigate();

    useEffect(() => {
        const cityFromUrl = window.location.pathname.split("/")[1];
        const cityFromLocalStorage = localStorage.getItem("city");
        const cityFromUrlIsValid = cities[cityFromUrl as City];
        const cityFromLocalStorageIsValid = cities[cityFromLocalStorage as City];
        
        if (cityFromUrlIsValid) {
            setCity(cityFromUrl as City);
        } else if (cityFromLocalStorageIsValid) {
            setCity(cityFromLocalStorage as City);
            navigate(`/${cityFromLocalStorage}`);
        } else {
            setCity("warsaw");
            navigate("/warsaw");
            localStorage.setItem("city", "warsaw");
        }
    }, []);

    return city ? <App city={city} /> : <Backdrop />;
};