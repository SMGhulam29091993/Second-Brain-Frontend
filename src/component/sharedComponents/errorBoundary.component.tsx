// ErrorBoundary.tsx
import React from 'react';

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h2>Something went wrong.</h2>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
