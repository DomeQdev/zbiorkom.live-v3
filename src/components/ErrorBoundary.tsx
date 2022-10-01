import { Component, ErrorInfo, lazy, ReactNode } from "react";
import { Suspense } from "./Suspense";

const Error = lazy(() => import("../pages/Error"));

interface Props {
    children?: ReactNode;
}

interface State {
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {};

    public static getDerivedStateFromError(err: Error): State {
        return { error: err };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error, errorInfo);
    }

    public render() {
        if (this.state.error) return <Suspense><Error text={`500 - ${this.state.error.name}`} message={"Strona nieoczekiwanie zwróciła błąd."} error={this.state.error} /></Suspense>;

        return this.props.children;
    }
}

export default ErrorBoundary;