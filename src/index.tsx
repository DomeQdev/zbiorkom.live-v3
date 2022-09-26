import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { register } from './util/registerSW';
import App from "./App";

import "./index.css";
import "react-spring-bottom-sheet/dist/style.css";

register();

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);