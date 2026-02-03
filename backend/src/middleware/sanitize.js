const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const validator = require('validator');

// Create a JSDOM window for DOMPurify to use in Node.js
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitize HTML content to prevent XSS attacks
 */
const sanitizeHTML = (dirty) => {
    if (typeof dirty !== 'string') return dirty;
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: []
    });
};

/**
 * Sanitize plain text (remove all HTML)
 */
const sanitizeText = (text) => {
    if (typeof text !== 'string') return text;
    return DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
};

/**
 * Sanitize email
 */
const sanitizeEmail = (email) => {
    if (typeof email !== 'string') return email;
    const sanitized = validator.normalizeEmail(email);
    return validator.isEmail(sanitized) ? sanitized : email;
};

/**
 * Sanitize phone number (remove non-numeric characters except +)
 */
const sanitizePhone = (phone) => {
    if (typeof phone !== 'string') return phone;
    return phone.replace(/[^\d+\-\s()]/g, '');
};

/**
 * Sanitize URL
 */
const sanitizeURL = (url) => {
    if (typeof url !== 'string') return url;
    try {
        const sanitized = validator.trim(url);
        return validator.isURL(sanitized, {
            protocols: ['http', 'https'],
            require_protocol: true
        }) ? sanitized : '';
    } catch (error) {
        return '';
    }
};

/**
 * Recursively sanitize an object
 */
const sanitizeObject = (obj, options = {}) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item, options));
    }

    const sanitized = {};

    for (const [key, value] of Object.entries(obj)) {
        // Skip certain fields that shouldn't be sanitized
        if (options.skipFields && options.skipFields.includes(key)) {
            sanitized[key] = value;
            continue;
        }

        // Sanitize based on field name patterns
        if (key.toLowerCase().includes('email')) {
            sanitized[key] = sanitizeEmail(value);
        } else if (key.toLowerCase().includes('phone')) {
            sanitized[key] = sanitizePhone(value);
        } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('image')) {
            sanitized[key] = typeof value === 'string' ? sanitizeURL(value) || value : value;
        } else if (key.toLowerCase().includes('description') || key.toLowerCase().includes('content')) {
            sanitized[key] = sanitizeHTML(value);
        } else if (typeof value === 'string') {
            sanitized[key] = sanitizeText(value);
        } else if (typeof value === 'object') {
            sanitized[key] = sanitizeObject(value, options);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
};

/**
 * Middleware to sanitize request body
 */
const sanitizeBody = (options = {}) => {
    return (req, res, next) => {
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeObject(req.body, {
                skipFields: options.skipFields || ['password', 'passwordHash', 'token', 'bankDetails'],
                ...options
            });
        }
        next();
    };
};

/**
 * Middleware to sanitize query parameters
 */
const sanitizeQuery = (options = {}) => {
    return (req, res, next) => {
        if (req.query && typeof req.query === 'object') {
            req.query = sanitizeObject(req.query, options);
        }
        next();
    };
};

/**
 * Middleware to sanitize params
 */
const sanitizeParams = (options = {}) => {
    return (req, res, next) => {
        if (req.params && typeof req.params === 'object') {
            req.params = sanitizeObject(req.params, options);
        }
        next();
    };
};

/**
 * Combined sanitization middleware
 */
const sanitizeAll = (options = {}) => {
    return (req, res, next) => {
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeObject(req.body, {
                skipFields: options.skipFields || ['password', 'passwordHash', 'token', 'bankDetails'],
                ...options
            });
        }
        if (req.query && typeof req.query === 'object') {
            req.query = sanitizeObject(req.query, options);
        }
        if (req.params && typeof req.params === 'object') {
            req.params = sanitizeObject(req.params, options);
        }
        next();
    };
};

module.exports = {
    sanitizeHTML,
    sanitizeText,
    sanitizeEmail,
    sanitizePhone,
    sanitizeURL,
    sanitizeObject,
    sanitizeBody,
    sanitizeQuery,
    sanitizeParams,
    sanitizeAll
};
