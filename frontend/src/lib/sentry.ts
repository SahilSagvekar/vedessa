import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for React
 */
export const initSentry = () => {
    // Only initialize if DSN is provided
    const dsn = import.meta.env.VITE_SENTRY_DSN;

    if (!dsn) {
        console.log('⚠️  Sentry DSN not configured. Error tracking disabled.');
        return;
    }

    Sentry.init({
        dsn,
        environment: import.meta.env.MODE || 'development',
        integrations: [
            new Sentry.BrowserTracing({
                // Set sampling rate for performance monitoring
                tracePropagationTargets: [
                    'localhost',
                    /^https:\/\/vedessa\.vercel\.app/,
                    /^https:\/\/.*\.vedessa\.in/,
                ],
            }),
            new Sentry.Replay({
                maskAllText: true,
                blockAllMedia: true,
            }),
        ],
        // Performance Monitoring
        tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
        // Session Replay
        replaysSessionSampleRate: 0.1, // 10% of sessions
        replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
        // Release tracking
        release: import.meta.env.VITE_APP_VERSION,
        // Before send hook
        beforeSend(event, hint) {
            // Don't send events in development unless explicitly enabled
            if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_SENTRY_ENABLE_DEV) {
                return null;
            }

            // Filter out sensitive data
            if (event.request) {
                delete event.request.cookies;
                if (event.request.headers) {
                    delete event.request.headers.authorization;
                    delete event.request.headers.cookie;
                }
            }

            return event;
        },
    });

    console.log('✅ Sentry initialized for error tracking');
};

/**
 * Capture exception manually
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
    if (!import.meta.env.VITE_SENTRY_DSN) {
        console.error('Error:', error);
        return;
    }

    Sentry.captureException(error, {
        extra: context,
    });
};

/**
 * Capture message manually
 */
export const captureMessage = (
    message: string,
    level: Sentry.SeverityLevel = 'info',
    context?: Record<string, any>
) => {
    if (!import.meta.env.VITE_SENTRY_DSN) {
        console.log(`[${level.toUpperCase()}]`, message);
        return;
    }

    Sentry.captureMessage(message, {
        level,
        extra: context,
    });
};

/**
 * Set user context
 */
export const setUser = (user: { id: string; email: string; fullName?: string; role?: string }) => {
    if (!import.meta.env.VITE_SENTRY_DSN) return;

    Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.fullName,
        role: user.role,
    });
};

/**
 * Clear user context
 */
export const clearUser = () => {
    if (!import.meta.env.VITE_SENTRY_DSN) return;
    Sentry.setUser(null);
};

/**
 * Add breadcrumb
 */
export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
    if (!import.meta.env.VITE_SENTRY_DSN) return;
    Sentry.addBreadcrumb(breadcrumb);
};

/**
 * Error Boundary component
 */
export const ErrorBoundary = Sentry.ErrorBoundary;

export default Sentry;
