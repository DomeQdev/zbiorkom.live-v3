import { City } from "./typings";
import cities from "../cities.json";

export const getData = (type: keyof typeof cities["warsaw"]["api"], city: City, options?: any) => {
    let { api } = cities[city];
    let url = api[type]!;

    if (options) {
        if(typeof options === "string") url = url + options;
        else Object.keys(options).forEach((key, i) => {
            url = url.replace(`{{${key}}}`, options[key]);
        });
    }

    return fetch(url).then(res => res.json());
};