import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <Layout>
                    <div className="min-h-[70vh] flex items-center justify-center px-4">
                        <div className="max-w-md w-full text-center">
                            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600">
                                <AlertCircle className="w-10 h-10" />
                            </div>
                            <h1 className="text-3xl font-display text-foreground mb-4">Something went wrong</h1>
                            <p className="text-muted-foreground mb-8">
                                We encountered an unexpected error. Don't worry, your progress is safe. Please try refreshing the page or return to the storefront.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full py-3 bg-kama-olive text-kama-cream rounded-full flex items-center justify-center gap-2 hover:bg-kama-olive-light transition-all"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Refresh Page
                                </button>
                                <button
                                    onClick={this.handleReset}
                                    className="w-full py-3 bg-white border border-border text-foreground rounded-full flex items-center justify-center gap-2 hover:bg-muted transition-all"
                                >
                                    <Home className="w-4 h-4" />
                                    Return Home
                                </button>
                            </div>
                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-8 p-4 bg-red-50 text-red-800 text-left rounded-lg text-xs overflow-auto max-h-40">
                                    <p className="font-bold mb-2">Error Details:</p>
                                    <pre>{this.state.error?.toString()}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                </Layout>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
