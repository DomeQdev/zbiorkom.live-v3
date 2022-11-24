import { City } from "./typings";

const endpoints = {
    trip: "https://transitapi.me/{{city}}/trip?trip={{trip}}",
    vehicle: "https://transitapi.me/{{city}}/vehicle?vehicle={{type}}/{{tab}}",
    stops: "https://transitapi.me/{{city}}/stops",
    stopGroups: "https://transitapi.me/{{city}}/stopGroups",
    stopGroup: "https://transitapi.me/{{city}}/getStopGroup?name={{name}}",
    stop: "https://transitapi.me/{{city}}/stopDepartures?stop={{stop}}",
    routes: "https://transitapi.me/{{city}}/routes",
    brigades: "https://transitapi.me/{{city}}/brigades?route={{line}}",
    brigade: "https://transitapi.me/{{city}}/brigade?route={{line}}&brigade={{brigade}}",
    alerts: "https://transitapi.me/{{city}}/alerts",
    alert: "https://transitapi.me/{{city}}/alert?alert={{id}}",
    search: "https://transitapi.me/{{city}}/search?search={{search}}"
};

export const getData = (type: keyof typeof endpoints, city: City, options?: any) => {
    let url = endpoints[type].replace("{{city}}", city);

    if (options) {
        if (typeof options === "string") url = url + options;
        else Object.keys(options).forEach((key, i) => {
            url = url.replace(`{{${key}}}`, options[key]);
        });
    }

    return fetch(url).then(res => res.json());
};