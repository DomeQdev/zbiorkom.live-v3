import { toast } from "react-toastify";

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '[::1]' || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/);

export function register() {
    if ('serviceWorker' in navigator) {
        const publicUrl = new URL(process.env.PUBLIC_URL!, window.location.href);
        if (publicUrl.origin !== window.location.origin) return;

        window.addEventListener('load', () => {
            if (isLocalhost) return;
            registerValidSW(`${process.env.PUBLIC_URL}/service-worker.js`);
        });
    }
}

function registerValidSW(swUrl: string) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (!installingWorker) return;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) toast.info("Nowa wersja zbiorkom.live jest dostępna. Kliknij tutaj aby użyć nowej wersji.", { autoClose: false, onClick: () => window.location.reload() });
                        else toast.success("Używasz aktualnej wersji zbiorkom.live.");
                    }
                };
            };
        })
        .catch((error) => {
            toast.error(`Service Worker error: ${error.message}`);
            console.error(error);
        });
}