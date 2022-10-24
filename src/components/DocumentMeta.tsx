import { useEffect } from "react";

export default ({ title, description, children }: { title: string, description?: string, children?: React.ReactNode }) => {
    useEffect(() => {
        document.title = title;
        document.querySelector("meta[name='description']")?.setAttribute("content", description || "");
        document.querySelector("meta[property='og:description']")?.setAttribute("content", description || "");
    }, [title, description]);

    return <>{children}</>;
};