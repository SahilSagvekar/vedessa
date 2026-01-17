require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const collectionsRouter = require('./routes/collections');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const wishlistRouter = require('./routes/wishlist');
const ordersRouter = require('./routes/orders');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://vedessa.vercel.app",
  "https://www.vedessa.in",
  "https://vedessa.in",
];

// Add any additional origins from environment variable
if (process.env.CORS_ORIGINS) {
  const extraOrigins = process.env.CORS_ORIGINS.split(',').map(o => o.trim());
  allowedOrigins.push(...extraOrigins);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/orders', ordersRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Ayurveda Essentials API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Ayurveda Essentials API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me (protected)',
        updateProfile: 'PUT /api/auth/profile (protected)',
        changePassword: 'PUT /api/auth/password (protected)'
      },
      products: {
        list: 'GET /api/products',
        get: 'GET /api/products/:id',
        create: 'POST /api/products (admin)',
        update: 'PUT /api/products/:id (admin)',
        delete: 'DELETE /api/products/:id (admin)'
      },
      categories: {
        list: 'GET /api/categories',
        get: 'GET /api/categories/:slug'
      },
      collections: {
        list: 'GET /api/collections',
        get: 'GET /api/collections/:slug'
      },
      cart: {
        get: 'GET /api/cart (protected)',
        add: 'POST /api/cart (protected)',
        update: 'PUT /api/cart/:id (protected)',
        remove: 'DELETE /api/cart/:id (protected)',
        clear: 'DELETE /api/cart (protected)'
      },
      wishlist: {
        get: 'GET /api/wishlist (protected)',
        add: 'POST /api/wishlist (protected)',
        check: 'GET /api/wishlist/check/:productId (protected)',
        remove: 'DELETE /api/wishlist/:productId (protected)'
      },
      orders: {
        create: 'POST /api/orders (protected)',
        list: 'GET /api/orders (protected)',
        get: 'GET /api/orders/:id (protected)',
        cancel: 'PUT /api/orders/:id/cancel (protected)',
        adminList: 'GET /api/orders/admin/all (admin)',
        adminUpdateStatus: 'PUT /api/orders/admin/:id/status (admin)'
      }
    }
  });
});

app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});



// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Ayurveda Essentials API Server');
  console.log('================================');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log('================================\n');
});

module.exports = app;