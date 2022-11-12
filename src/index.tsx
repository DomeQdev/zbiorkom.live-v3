import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { register } from './util/registerSW';
import CityPicker from './CityPicker';

import "./util/i18n";
import "./index.css";
import "react-spring-bottom-sheet/dist/style.css";

register();

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CityPicker />
  </BrowserRouter>
);