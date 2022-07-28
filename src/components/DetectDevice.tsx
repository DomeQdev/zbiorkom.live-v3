import { useEffect, useState } from "react";

export default ({ mobile, desktop }: { mobile: JSX.Element, desktop: JSX.Element }) => {
    const [useDesktop, setUseDesktop] = useState(window.innerWidth >= 600);

    useEffect(() => {
        const handleResize = () => {
            setUseDesktop(window.innerWidth >= 600);
        }

        window.addEventListener("resize", handleResize, false);

        return () => {
            window.removeEventListener("resize", handleResize, false);
        };
    }, []);

    return useDesktop ? desktop : mobile;
};