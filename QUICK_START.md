# 🚀 Quick Start Guide - Vedessa E-commerce Platform

## ⚡ IMMEDIATE ACTIONS REQUIRED

### 1. Run Database Migration (CRITICAL - DO THIS FIRST!)
```bash
cd d:\vedessa\backend
npx prisma migrate dev --name add_vendor_support
npx prisma generate
```

### 2. Start the Application
```bash
# Terminal 1 - Backend
cd d:\vedessa\backend
npm run dev

# Terminal 2 - Frontend
cd d:\vedessa\frontend
npm run dev
```

### 3. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health

---

## 🎯 KEY URLS TO TEST

### Customer Features
- Home: `/`
- Products: `/products`
- Product Detail: `/products/:slug`
- Cart: `/cart`
- Checkout: `/checkout`
- Wishlist: `/wishlist`
- Login/Register: `/auth`
- Customer Dashboard: `/dashboard`
- Order Detail: `/orders/:id`

### Vendor Features
- Vendor Registration: `/vendor/register`
- Vendor Dashboard: `/vendor/dashboard`

### Admin Features
- Admin Dashboard: `/admin`

### Information Pages
- About: `/about`
- Contact: `/contact`
- FAQ: `/faq`
- Shipping & Returns: `/shipping` or `/returns`
- Forgot Password: `/forgot-password`
- Reset Password: `/reset-password`

---

## 👤 TEST ACCOUNTS

### Create Test Accounts:

**Customer Account:**
1. Go to `/auth`
2. Click "Create Account"
3. Fill in details
4. Role: CUSTOMER (default)

**Vendor Account:**
1. Go to `/vendor/register`
2. Complete 4-step registration
3. Role: VENDOR (auto-assigned)
4. Status: Pending approval

**Admin Account:**
```sql
-- Manually update a user to admin in database
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@vedessa.com';
```

---

## 🔧 TROUBLESHOOTING

### Issue: Migration fails
**Solution:**
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Then run migration again
npx prisma migrate dev --name add_vendor_support
```

### Issue: "Cannot find module" errors
**Solution:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Issue: CORS errors
**Solution:** Check that frontend .env has correct API URL:
```
VITE_API_URL=http://localhost:5000/api
```

### Issue: Vendor can't add products
**Solution:** Vendor needs approval. Update database:
```sql
UPDATE users SET is_approved = true WHERE role = 'VENDOR';
```

---

## 📊 VENDOR WORKFLOW

1. **Registration:**
   - Navigate to `/vendor/register`
   - Complete 4-step form
   - Submit application

2. **Pending Approval:**
   - See "Pending Approval" message
   - Wait for admin approval

3. **Admin Approval (Manual for now):**
   ```sql
   UPDATE users SET is_approved = true WHERE email = 'vendor@example.com';
   ```

4. **Access Dashboard:**
   - Login and go to `/vendor/dashboard`
   - View analytics

5. **Add Products:**
   - Click "Products" tab
   - Click "Add Product"
   - Fill in details
   - Submit

6. **Manage Orders:**
   - Click "Orders" tab
   - View orders with your products
   - Mark as fulfilled

---

## 🎨 ADMIN TASKS (TODO)

### Add Vendor Approval to Admin Dashboard:

**File:** `d:\vedessa\frontend\src\pages\Admin.tsx`

Add a new tab:
```tsx
// Add to tabs array
{ id: 'vendors', label: 'Vendors' }

// Add vendor list component
{activeTab === 'vendors' && <VendorApprovalList />}
```

Create approval endpoint call:
```javascript
const approveVendor = async (vendorId) => {
  await fetch(`${API_URL}/admin/vendors/${vendorId}/approve`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};
```

---

## 📧 EMAIL SERVICE SETUP (TODO)

### Install nodemailer:
```bash
cd backend
npm install nodemailer
```

### Create email service:
**File:** `backend/src/services/emailService.js`
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a>`
  });
};
```

### Add to .env:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

---

## 🔐 PRODUCTION CHECKLIST

### Before Deploying:

- [ ] Run database migration
- [ ] Change JWT_SECRET to strong random value
- [ ] Replace Razorpay test keys with live keys
- [ ] Update VITE_API_URL to production backend URL
- [ ] Set up email service
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up error logging
- [ ] Add rate limiting
- [ ] Optimize images
- [ ] Test all features end-to-end
- [ ] Create admin account
- [ ] Test vendor registration and approval
- [ ] Test payment flow with real payment

---

## 📁 IMPORTANT FILES

### Configuration:
- `backend/.env` - Backend environment variables
- `frontend/.env` - Frontend environment variables
- `backend/prisma/schema.prisma` - Database schema

### Documentation:
- `COMPLETE_IMPLEMENTATION_SUMMARY.md` - Full feature list
- `IMPLEMENTATION_STATUS.md` - Original audit and progress
- `README.md` - Project overview

### Key Backend Files:
- `backend/src/server.js` - Main server file
- `backend/src/controllers/vendorController.js` - Vendor logic
- `backend/src/routes/vendor.routes.js` - Vendor routes

### Key Frontend Files:
- `frontend/src/App.tsx` - All routes
- `frontend/src/pages/VendorDashboard.tsx` - Vendor dashboard
- `frontend/src/pages/VendorRegistration.tsx` - Vendor registration
- `frontend/src/components/vendor/` - Vendor components

---

## 🆘 NEED HELP?

### Common Commands:

**View Database:**
```bash
cd backend
npx prisma studio
```

**Reset Database:**
```bash
cd backend
npx prisma migrate reset
```

**Generate Prisma Client:**
```bash
cd backend
npx prisma generate
```

**Check Backend Logs:**
```bash
cd backend
npm run dev
# Watch console for errors
```

**Build Frontend:**
```bash
cd frontend
npm run build
```

---

## ✅ VERIFICATION STEPS

After migration, verify everything works:

1. ✅ Backend starts without errors
2. ✅ Frontend starts without errors
3. ✅ Can register as customer
4. ✅ Can login as customer
5. ✅ Can browse products
6. ✅ Can add to cart
7. ✅ Can checkout (test mode)
8. ✅ Can register as vendor
9. ✅ Vendor sees pending approval
10. ✅ After approval, vendor can add products
11. ✅ Search works
12. ✅ All pages load correctly

---

**🎉 You're all set! Start with the database migration and test the vendor flow!**

Last Updated: January 21, 2026
