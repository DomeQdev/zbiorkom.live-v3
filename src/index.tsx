import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { register } from './registerSW';
import App from "./App";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

console.log('%czbiorkom.live', 'color: #5aa159;font-size:50px;');
console.log('%cTwórca: DomeQ <info@domeq.pw>\nGitHub: https://github.com/DomeQdev/zbiorkom.live\nDiscord: https://discord.gg/QYRswCH6Gw', 'font-weight:bold;color:#5aa159');
register();

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);