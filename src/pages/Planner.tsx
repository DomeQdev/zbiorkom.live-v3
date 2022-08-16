import { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { City, PlannerOptions } from "../util/typings";

const PlannerPicker = lazy(() => import("../components/PlannerPicker"));
const PlannerResults = lazy(() => import("../components/PlannerResults"));

export default ({ city }: { city: City }) => {
    const [options, setOptions] = useState<PlannerOptions>({
        from: undefined,
        fromName: "Miejsce początkowe",
        to: undefined,
        toName: "Miejsce docelowe",
        transfers: 4,
        facilities: [],
        type: "optimised"
    });

    return <>
        <Routes>
            {(options.from && options.to) && <Route path="results" element={<Suspense><PlannerResults city={city} options={options} /></Suspense>} />}
            <Route path="*" element={<Suspense><PlannerPicker city={city} options={options} setOptions={setOptions} /></Suspense>} />
        </Routes>
    </>;
};