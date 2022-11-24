import { useState, useEffect } from "react";

export default ({ timestamp }: { timestamp: number }) => {
    const [since, setSince] = useState<string>(timeSince(timestamp));

    useEffect(() => {
        setSince(timeSince(timestamp));
        let interval = setInterval(() => setSince(timeSince(timestamp)), 1000);

        return () => clearInterval(interval);
    }, [timestamp]);

    return <>{since}</>;
};

function timeSince(timestamp: number) {
    let secondsSince = Math.floor((Date.now() - timestamp) / 1000);
    let days = Math.floor(secondsSince / 86400);
    let hours = Math.floor((secondsSince - days * 86400) / 3600);
    let minutes = Math.floor((secondsSince - days * 86400 - hours * 3600) / 60);
    let seconds = secondsSince - days * 86400 - hours * 3600 - minutes * 60;

    return `${days > 0 ? `${days}d ` : ""}${hours > 0 ? ` ${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds > 0 ? `${seconds}s ` : ""}`;
}