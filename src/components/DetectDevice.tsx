import { useEffect, useState } from "react";

export default ({ mobile, desktop, diff = 600 }: { mobile: JSX.Element, desktop: JSX.Element, diff?: number }) => {
    const [useDesktop, setUseDesktop] = useState(window.innerWidth >= diff);

    useEffect(() => {
        const handleResize = () => {
            setUseDesktop(window.innerWidth >= diff);
        }

        window.addEventListener("resize", handleResize, false);

        return () => {
            window.removeEventListener("resize", handleResize, false);
        };
    }, []);

    return useDesktop ? desktop : mobile;
};