import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-red-50 p-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
                        <p className="mt-2 text-gray-600">Please check the console for details.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

createRoot(document.getElementById("root")!).render(
    <div className="bg-background text-foreground">
        <ErrorBoundary>
            <GoogleOAuthProvider clientId={clientId}>
                <App />
            </GoogleOAuthProvider>
        </ErrorBoundary>
    </div>
);
