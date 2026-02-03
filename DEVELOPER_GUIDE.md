# 🚀 Vedessa - Developer Quick Reference Guide

**Last Updated:** February 3, 2026  
**For:** Development Team

---

## 📋 Table of Contents
1. [Quick Commands](#quick-commands)
2. [API Endpoints](#api-endpoints)
3. [Database Queries](#database-queries)
4. [Common Tasks](#common-tasks)
5. [Troubleshooting](#troubleshooting)
6. [Code Snippets](#code-snippets)

---

## ⚡ Quick Commands

### Development Setup
```bash
# Clone and setup
git clone <repo-url>
cd vedessa

# Backend setup
cd backend
npm install
npx prisma generate
cp .env.example .env  # Configure your .env
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env  # Configure your .env
npm run dev
```

### Database Commands
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Open Prisma Studio (Database GUI)
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy
```

### Build Commands
```bash
# Backend
npm run build          # Generate Prisma Client

# Frontend
npm run build          # Production build
npm run build:dev      # Development build
npm run preview        # Preview production build
```

### Testing
```bash
# Frontend
npm run lint           # Run ESLint
npm run type-check     # TypeScript check

# Backend
npm test               # Run tests (if configured)
```

---

## 🔌 API Endpoints Reference

### Authentication
```bash
# Register
POST /api/auth/register
Body: { email, password, fullName }

# Login
POST /api/auth/login
Body: { email, password }

# Get current user
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }

# Update profile
PUT /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Body: { fullName, avatarUrl }

# Change password
PUT /api/auth/password
Headers: { Authorization: "Bearer <token>" }
Body: { currentPassword, newPassword }

# Forgot password
POST /api/auth/forgot-password
Body: { email }

# Reset password
POST /api/auth/reset-password
Body: { token, newPassword }
```

### Products
```bash
# List products (with filters)
GET /api/products?category=<slug>&collection=<slug>&minPrice=<num>&maxPrice=<num>

# Get product by ID
GET /api/products/:id

# Create product (Admin/Vendor)
POST /api/products
Headers: { Authorization: "Bearer <token>" }
Body: { name, description, price, categoryId, stock, ... }

# Update product
PUT /api/products/:id
Headers: { Authorization: "Bearer <token>" }

# Delete product
DELETE /api/products/:id
Headers: { Authorization: "Bearer <token>" }
```

### Cart
```bash
# Get cart
GET /api/cart
Headers: { Authorization: "Bearer <token>" }

# Add to cart
POST /api/cart
Headers: { Authorization: "Bearer <token>" }
Body: { productId, quantity }

# Update cart item
PUT /api/cart/:id
Headers: { Authorization: "Bearer <token>" }
Body: { quantity }

# Remove from cart
DELETE /api/cart/:id
Headers: { Authorization: "Bearer <token>" }

# Clear cart
DELETE /api/cart
Headers: { Authorization: "Bearer <token>" }
```

### Orders
```bash
# Create order
POST /api/orders
Headers: { Authorization: "Bearer <token>" }
Body: { items, shippingAddress, paymentMethod }

# Get user's orders
GET /api/orders
Headers: { Authorization: "Bearer <token>" }

# Get order details
GET /api/orders/:id
Headers: { Authorization: "Bearer <token>" }

# Cancel order
PUT /api/orders/:id/cancel
Headers: { Authorization: "Bearer <token>" }

# Admin: Get all orders
GET /api/orders/admin/all
Headers: { Authorization: "Bearer <admin-token>" }

# Admin: Update order status
PUT /api/orders/admin/:id/status
Headers: { Authorization: "Bearer <admin-token>" }
Body: { status }
```

### Vendors
```bash
# Register as vendor
POST /api/vendors/register
Body: { email, password, companyName, gstNumber, ... }

# Get vendor profile
GET /api/vendors/me
Headers: { Authorization: "Bearer <vendor-token>" }

# Update vendor profile
PUT /api/vendors/me
Headers: { Authorization: "Bearer <vendor-token>" }

# Get vendor's products
GET /api/vendors/products
Headers: { Authorization: "Bearer <vendor-token>" }

# Add product (vendor)
POST /api/vendors/products
Headers: { Authorization: "Bearer <vendor-token>" }

# Get vendor's orders
GET /api/vendors/orders
Headers: { Authorization: "Bearer <vendor-token>" }

# Get vendor analytics
GET /api/vendors/analytics
Headers: { Authorization: "Bearer <vendor-token>" }
```

---

## 🗄️ Database Queries

### Common Prisma Queries

#### Users
```javascript
// Find user by email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    passwordHash: hashedPassword,
    fullName: 'John Doe',
    role: 'CUSTOMER'
  }
});

// Update user
const user = await prisma.user.update({
  where: { id: userId },
  data: { fullName: 'New Name' }
});

// Get vendors pending approval
const vendors = await prisma.user.findMany({
  where: {
    role: 'VENDOR',
    isApproved: false
  }
});
```

#### Products
```javascript
// Get all products with relations
const products = await prisma.product.findMany({
  include: {
    category: true,
    collection: true,
    vendor: true
  }
});

// Get products by category
const products = await prisma.product.findMany({
  where: {
    category: { slug: 'ayurvedic-oils' }
  }
});

// Create product
const product = await prisma.product.create({
  data: {
    name: 'Product Name',
    description: 'Description',
    price: 999.99,
    stock: 100,
    categoryId: categoryId,
    vendorId: vendorId
  }
});
```

#### Orders
```javascript
// Get user's orders
const orders = await prisma.order.findMany({
  where: { userId: userId },
  include: {
    items: {
      include: { product: true }
    }
  },
  orderBy: { createdAt: 'desc' }
});

// Create order
const order = await prisma.order.create({
  data: {
    orderNumber: generateOrderNumber(),
    userId: userId,
    status: 'PENDING',
    totalAmount: total,
    subtotal: subtotal,
    shippingAddress: address,
    items: {
      create: items.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    }
  }
});
```

#### Cart
```javascript
// Get user's cart
const cart = await prisma.cartItem.findMany({
  where: { userId: userId },
  include: { product: true }
});

// Add to cart
const cartItem = await prisma.cartItem.create({
  data: {
    userId: userId,
    productId: productId,
    quantity: quantity
  }
});

// Update cart item
const cartItem = await prisma.cartItem.update({
  where: { id: cartItemId },
  data: { quantity: newQuantity }
});
```

---

## 🛠️ Common Tasks

### 1. Add New API Endpoint

**Step 1:** Create controller function
```javascript
// backend/src/controllers/myController.js
exports.myFunction = async (req, res) => {
  try {
    const data = await prisma.myModel.findMany();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

**Step 2:** Create route
```javascript
// backend/src/routes/myRoutes.js
const express = require('express');
const router = express.Router();
const { myFunction } = require('../controllers/myController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, myFunction);

module.exports = router;
```

**Step 3:** Register route in server.js
```javascript
// backend/src/server.js
const myRoutes = require('./routes/myRoutes');
app.use('/api/my-endpoint', myRoutes);
```

### 2. Add New Frontend Page

**Step 1:** Create page component
```typescript
// frontend/src/pages/MyPage.tsx
import Layout from '@/components/layout/Layout';

const MyPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1>My Page</h1>
      </div>
    </Layout>
  );
};

export default MyPage;
```

**Step 2:** Add route
```typescript
// frontend/src/App.tsx
import MyPage from './pages/MyPage';

// In Routes component
<Route path="/my-page" element={<MyPage />} />
```

### 3. Add New Database Model

**Step 1:** Update schema
```prisma
// backend/prisma/schema.prisma
model MyModel {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now()) @map("created_at")
  
  @@map("my_models")
}
```

**Step 2:** Create migration
```bash
npx prisma migrate dev --name add_my_model
```

**Step 3:** Generate Prisma Client
```bash
npx prisma generate
```

### 4. Add Protected Route

**Frontend:**
```typescript
// Create ProtectedRoute component
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Use in App.tsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <Admin />
    </ProtectedRoute>
  } 
/>
```

**Backend:**
```javascript
// Middleware for role checking
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }
    next();
  };
};

// Use in routes
router.get('/admin-only', authenticate, requireRole('ADMIN'), handler);
```

### 5. Send Email

```javascript
const emailService = require('../services/emailService');

// Send password reset email
await emailService.sendPasswordResetEmail(
  user.email,
  user.fullName,
  resetToken
);

// Send order confirmation
await emailService.sendOrderConfirmationEmail(
  user.email,
  user.fullName,
  order
);

// Send vendor approval
await emailService.sendVendorApprovalEmail(
  vendor.email,
  vendor.fullName
);
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Cannot find module '@prisma/client'"
```bash
# Solution
cd backend
npx prisma generate
```

#### 2. "CORS error"
```javascript
// Check backend/src/server.js
// Ensure frontend URL is in allowedOrigins array
const allowedOrigins = [
  "http://localhost:5173",  // Add your frontend URL
];
```

#### 3. "JWT token expired"
```javascript
// Frontend: Clear localStorage and login again
localStorage.removeItem('token');
localStorage.removeItem('user');
```

#### 4. "Database connection failed"
```bash
# Check DATABASE_URL in backend/.env
# Ensure Neon database is accessible
# Test connection with Prisma Studio
npx prisma studio
```

#### 5. "Port already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in backend/.env
PORT=5001
```

#### 6. "Vendor can't add products"
```sql
-- Check if vendor is approved
SELECT email, role, is_approved FROM users WHERE role = 'VENDOR';

-- Approve vendor
UPDATE users SET is_approved = true WHERE email = 'vendor@example.com';
```

---

## 💡 Code Snippets

### Frontend

#### Fetch with Auth
```typescript
const fetchWithAuth = async (url: string, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error('Request failed');
  }
  
  return response.json();
};
```

#### Form with React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

const MyForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} />
      {form.formState.errors.name && (
        <span>{form.formState.errors.name.message}</span>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};
```

#### Toast Notification
```typescript
import { toast } from 'sonner';

// Success
toast.success('Product added to cart!');

// Error
toast.error('Failed to add product');

// Loading
const toastId = toast.loading('Processing...');
// Later
toast.success('Done!', { id: toastId });
```

### Backend

#### Error Handler Wrapper
```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
router.get('/', asyncHandler(async (req, res) => {
  const data = await prisma.model.findMany();
  res.json({ success: true, data });
}));
```

#### Pagination
```javascript
const getPaginatedResults = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
    }),
    prisma.product.count(),
  ]);
  
  res.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};
```

#### File Upload
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  },
});

// Use in route
router.post('/upload', upload.single('image'), (req, res) => {
  res.json({ 
    success: true, 
    url: `/uploads/${req.file.filename}` 
  });
});
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
# Required
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=5000

# Optional but recommended
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Payment
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend (.env)
```env
# Required
VITE_API_URL=http://localhost:5000/api

# Optional
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

---

## 📚 Useful Resources

### Documentation
- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Router](https://reactrouter.com/en/main)
- [React Query](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools
- [Prisma Studio](http://localhost:5555) - Database GUI
- [Postman](https://www.postman.com/) - API testing
- [DB Diagram](https://dbdiagram.io/) - Database design

---

## 🎯 Best Practices

### Code Style
- Use async/await instead of callbacks
- Always handle errors with try/catch
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Security
- Never commit .env files
- Always validate user input
- Use parameterized queries (Prisma handles this)
- Implement rate limiting for auth endpoints
- Hash passwords before storing
- Validate JWT tokens on protected routes

### Performance
- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize images before upload
- Use lazy loading for components

---

**Need Help?** Check the full documentation in:
- `PROJECT_SCAN_REPORT.md`
- `ARCHITECTURE_OVERVIEW.md`
- `QUICK_START.md`

**Last Updated:** February 3, 2026
