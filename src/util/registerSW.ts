import { toast } from "react-hot-toast";

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
    let toastId: any;
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (!installingWorker) return;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installing') {
                        toastId = toast.loading("Pobieram nową wersję zbiorkom.live...");
                    }
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            toast.success('Pobrano nową wersję zbiorkom.live, odświeżam...', {
                                id: toastId
                            });
                            
                            setTimeout(() => {
                                registration.installing?.postMessage({ action: 'skipWaiting' });
                                window.location.reload();
                            }, 2000);
                        }
                    }
                };
            };
        })
        .catch((error) => {
            toast.error(`Service Worker error: ${error.message}`);
            console.error(error);
        });
}