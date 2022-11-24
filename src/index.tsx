import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { register } from './util/registerSW';
import cities from "./util/cities.json";
import { City } from './util/typings';
import App from './App';

import './util/i18n';
import './index.css';
import 'react-spring-bottom-sheet/dist/style.css';

register();
const cityFromUrl = window.location.pathname.split("/")[1];
const cityFromLocalStorage = localStorage.getItem("city");
const cityFromUrlIsValid = cities[cityFromUrl as City];
const cityFromLocalStorageIsValid = cities[cityFromLocalStorage as City];

createRoot(document.getElementById('root')!).render(<ErrorBoundary>
    <BrowserRouter>
        <App city={(cityFromUrlIsValid ? cityFromUrl : (cityFromLocalStorageIsValid ? cityFromLocalStorage : "warsaw")) as City} />
    </BrowserRouter>
</ErrorBoundary>);