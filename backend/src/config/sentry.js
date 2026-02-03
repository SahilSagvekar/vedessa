const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

/**
 * Initialize Sentry for error tracking
 */
const initSentry = (app) => {
    // Only initialize if DSN is provided
    if (!process.env.SENTRY_DSN) {
        console.log('⚠️  Sentry DSN not configured. Error tracking disabled.');
        return;
    }

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        integrations: [
            // Enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // Enable Express.js middleware tracing
            new Sentry.Integrations.Express({ app }),
            // Enable profiling
            new ProfilingIntegration(),
        ],
        // Performance Monitoring
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        // Profiling
        profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        // Release tracking
        release: process.env.npm_package_version,
        // Before send hook to filter sensitive data
        beforeSend(event, hint) {
            // Don't send events in development unless explicitly enabled
            if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLE_DEV) {
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
 * Get Sentry request handler middleware
 */
const requestHandler = () => {
    if (!process.env.SENTRY_DSN) {
        return (req, res, next) => next();
    }
    return Sentry.Handlers.requestHandler();
};

/**
 * Get Sentry tracing middleware
 */
const tracingHandler = () => {
    if (!process.env.SENTRY_DSN) {
        return (req, res, next) => next();
    }
    return Sentry.Handlers.tracingHandler();
};

/**
 * Get Sentry error handler middleware
 */
const errorHandler = () => {
    if (!process.env.SENTRY_DSN) {
        return (err, req, res, next) => next(err);
    }
    return Sentry.Handlers.errorHandler();
};

/**
 * Capture exception manually
 */
const captureException = (error, context = {}) => {
    if (!process.env.SENTRY_DSN) {
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
const captureMessage = (message, level = 'info', context = {}) => {
    if (!process.env.SENTRY_DSN) {
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
const setUser = (user) => {
    if (!process.env.SENTRY_DSN) return;

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
const clearUser = () => {
    if (!process.env.SENTRY_DSN) return;
    Sentry.setUser(null);
};

/**
 * Add breadcrumb
 */
const addBreadcrumb = (breadcrumb) => {
    if (!process.env.SENTRY_DSN) return;
    Sentry.addBreadcrumb(breadcrumb);
};

module.exports = {
    initSentry,
    requestHandler,
    tracingHandler,
    errorHandler,
    captureException,
    captureMessage,
    setUser,
    clearUser,
    addBreadcrumb,
    Sentry,
};
