# 📝 Product Reviews - Usage Guide

## Overview
The Product Reviews system allows customers to rate and review products they've purchased. It includes verified purchase badges, helpful votes, rating distribution, and comprehensive filtering/sorting options.

---

## 🎯 Features

### For Customers:
- ⭐ Rate products from 1-5 stars
- 📝 Write detailed reviews with optional title
- ✅ Verified purchase badges for confirmed buyers
- 👍 Vote on helpful reviews
- 🔍 Filter reviews by star rating
- 📊 Sort reviews by date, rating, or helpfulness
- ✏️ Edit or delete your own reviews
- 📱 Fully responsive design

### For Admins:
- 🛡️ Moderation capabilities (approve/flag reviews)
- 📊 Automatic product rating updates
- 🔒 One review per user per product enforcement

---

## 🚀 How to Use

### Adding Reviews to Product Pages

1. **Import the Component:**
```tsx
import ProductReviews from '@/components/product/ProductReviews';
```

2. **Add to Your Product Page:**
```tsx
<ProductReviews 
  productId={product.id} 
  productName={product.name} 
/>
```

### Example Integration in ProductDetail.tsx:

```tsx
import ProductReviews from '@/components/product/ProductReviews';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // ... fetch product logic ...

  return (
    <Layout>
      {/* Product Info Section */}
      <div className="product-info">
        {/* ... product details ... */}
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <ProductReviews 
          productId={product.id} 
          productName={product.name} 
        />
      </div>
    </Layout>
  );
};
```

---

## 📡 API Endpoints

### Public Endpoints:
```
GET /api/reviews/product/:productId
  - Get all reviews for a product
  - Query params: page, limit, rating, sort
```

### Protected Endpoints (Require Authentication):
```
POST /api/reviews/product/:productId
  - Create a new review
  - Body: { rating, title?, comment }

PUT /api/reviews/:id
  - Update your review
  - Body: { rating?, title?, comment? }

DELETE /api/reviews/:id
  - Delete your review

POST /api/reviews/:id/helpful
  - Vote on review helpfulness
  - Body: { helpful: true/false }

GET /api/reviews/user/me
  - Get your reviews
  - Query params: page, limit
```

---

## 🎨 Customization

### Styling:
The component uses Tailwind CSS and shadcn/ui components. You can customize:
- Colors via Tailwind config
- Component styles in the ProductReviews.tsx file
- Badge variants in badge.tsx

### Behavior:
Edit `reviewController.js` to customize:
- Minimum review length (currently 10 characters)
- Auto-approval settings
- Rating calculation logic

---

## 🔧 Database Schema

```prisma
model Review {
  id              String   @id @default(uuid())
  productId       String
  userId          String
  rating          Int      // 1-5 stars
  title           String?
  comment         String
  isVerified      Boolean  @default(false)
  helpfulCount    Int      @default(0)
  notHelpfulCount Int      @default(0)
  isApproved      Boolean  @default(true)
  isFlagged       Boolean  @default(false)
  adminResponse   String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  product         Product  @relation(...)
  user            User     @relation(...)

  @@unique([productId, userId])
}
```

---

## 🎯 Best Practices

1. **Verified Purchases:**
   - Only customers who purchased and received the product get the verified badge
   - Checks for DELIVERED order status

2. **One Review Per Product:**
   - Users can only submit one review per product
   - They can edit or delete their existing review

3. **Automatic Rating Updates:**
   - Product ratings update automatically when reviews are added/edited/deleted
   - Calculated as average of all approved reviews

4. **Moderation:**
   - Reviews are auto-approved by default
   - Admins can flag inappropriate reviews
   - Flagged reviews can be hidden from public view

---

## 🐛 Troubleshooting

### Reviews Not Showing:
- Check if `isApproved` is true in database
- Verify productId matches
- Check browser console for errors

### Can't Submit Review:
- Ensure user is logged in
- Check if user already reviewed this product
- Verify comment is at least 10 characters

### Rating Not Updating:
- Check `updateProductRating()` function
- Verify database connection
- Check server logs for errors

---

## 📊 Performance Tips

1. **Pagination:**
   - Default limit is 10 reviews per page
   - Adjust in query params if needed

2. **Caching:**
   - Consider caching product ratings
   - Cache rating distribution for popular products

3. **Indexing:**
   - Database indexes are already set on:
     - productId
     - userId
     - rating
     - isApproved

---

## 🔮 Future Enhancements

- [ ] Image uploads in reviews
- [ ] Admin response to reviews
- [ ] Review moderation dashboard
- [ ] Email notifications for new reviews
- [ ] Review incentives/rewards
- [ ] AI-powered review summarization
- [ ] Sentiment analysis

---

**Last Updated:** February 4, 2026
