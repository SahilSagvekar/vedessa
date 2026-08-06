/**
 * Vedessa Product Seed Script
 * ----------------------------
 * Uploads 17 product images to Cloudinary and inserts them into the DB.
 *
 * Usage:
 *   1. Copy your 17 images into backend/scripts/images/ with the names listed below
 *   2. Make sure your .env has CLOUDINARY_* and DATABASE_URL set
 *   3. Run: node scripts/seedProducts.js
 */

const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Product definitions ────────────────────────────────────────────────────
// image: filename inside backend/scripts/images/
// category/collection slugs will be created if they don't exist

const products = [
  {
    image: 'vitamin-c-face-wash-ht.png',
    name: 'Vitamin C Face Wash',
    description: 'Insta Glow in Freshings. Brightening face wash with Vitamin C for all skin types. Gently cleanses while promoting a radiant, glowing complexion.',
    price: 249,
    comparePrice: 299,
    category: { name: 'Face Wash', slug: 'face-wash', group: 'SKINCARE' },
    collection: { name: 'Herbal Touch', slug: 'herbal-touch' },
    netQuantity: '200ml',
    countryOfOrigin: 'India',
    manufacturedBy: 'Herbal Touch',
    isNew: true,
    isBestseller: false,
    stock: 100,
  },
  {
    image: 'aloevera-face-wash-ht.png',
    name: 'Aloevera Face Wash',
    description: 'Multi purpose use. Anti acne and pimple formula with Youth Glow Blow for all skin types. Deeply cleanses and refreshes the skin.',
    price: 229,
    comparePrice: 279,
    category: { name: 'Face Wash', slug: 'face-wash', group: 'SKINCARE' },
    collection: { name: 'Herbal Touch', slug: 'herbal-touch' },
    netQuantity: '200ml',
    countryOfOrigin: 'India',
    manufacturedBy: 'Herbal Touch',
    isNew: false,
    isBestseller: true,
    stock: 100,
  },
  {
    image: 'scrub-face-wash-ht.png',
    name: 'Scrub Face Wash',
    description: 'Blackheads and tanning removal scrub face wash for all skin types. Gently exfoliates dead skin cells and unclogs pores.',
    price: 249,
    comparePrice: 299,
    category: { name: 'Face Wash', slug: 'face-wash', group: 'SKINCARE' },
    collection: { name: 'Herbal Touch', slug: 'herbal-touch' },
    netQuantity: '200ml',
    countryOfOrigin: 'India',
    manufacturedBy: 'Herbal Touch',
    isNew: false,
    isBestseller: false,
    stock: 100,
  },
  {
    image: 'de-tan-face-wash-ht.png',
    name: 'De-Tan Face Wash',
    description: 'Glowing and refreshing tanning removal face wash for all skin types. Effectively removes tan and leaves skin bright and refreshed.',
    price: 229,
    comparePrice: 279,
    category: { name: 'Face Wash', slug: 'face-wash', group: 'SKINCARE' },
    collection: { name: 'Herbal Touch', slug: 'herbal-touch' },
    netQuantity: '200ml',
    countryOfOrigin: 'India',
    manufacturedBy: 'Herbal Touch',
    isNew: false,
    isBestseller: false,
    stock: 100,
  },
  {
    image: 'almond-shampoo-ht-pump.png',
    name: 'Almond Shampoo',
    description: 'Creamy protein shampoo enriched with almond extracts. Nourishes hair from root to tip, leaving it soft, smooth, and shiny.',
    price: 299,
    comparePrice: 349,
    category: { name: 'Shampoo', slug: 'shampoo', group: 'HAIRCARE' },
    collection: { name: 'Herbal Touch', slug: 'herbal-touch' },
    netQuantity: '300ml',
    countryOfOrigin: 'India',
    manufacturedBy: 'Herbal Touch',
    isNew: false,
    isBestseller: true,
    stock: 80,
  },
  {
    image: 'almond-shampoo-ht-clear.png',
    name: 'Almond Shampoo (Premium)',
    description: 'Premium creamy protein shampoo with almond oil. Strengthens hair and prevents breakage while adding a natural shine.',
    price: 349,
    comparePrice: 399,
    category: { name: 'Shampoo', slug: 'shampoo', group: 'HAIRCARE' },
    collection: { name: 'Herbal Touch', slug: 'herbal-touch' },
    netQuantity: '300ml',
    countryOfOrigin: 'India',
    manufacturedBy: 'Herbal Touch',
    isNew: true,
    isBestseller: false,
    stock: 80,
  },
  {
    image: 'aloevera-hibiscus-shampoo-ht.png',
    name: 'Aloevera & Hibiscus Shampoo',
    description: 'Herbal shampoo with aloe vera and hibiscus extracts. Promotes hair growth, reduces hair fall, and adds natural volume.',
    price: 299,
    comparePrice: 349,
    category: { name: 'Shampoo', slug: 'shampoo', group: 'HAIRCARE' },
    collection: { name: 'Herbal Touch', slug: 'herbal-touch' },
    netQuantity: '300ml',
    countryOfOrigin: 'India',
    manufacturedBy: 'Herbal Touch',
    isNew: false,
    isBestseller: false,
    stock: 80,
  },
  {
    image: 'skin-radiance-cream-7dn.png',
    name: 'Skin Radiance Cream',
    description: 'With Niacinamide + Alpha Arbutin for instant glow. Dermatologically tested formula for 5X smoother skin texture. Instant radiance, smooth finish, supple skin.',
    price: 499,
    comparePrice: 599,
    category: { name: 'Moisturiser', slug: 'moisturiser', group: 'SKINCARE' },
    collection: { name: '7Days Natural', slug: '7days-natural' },
    netQuantity: '50g',
    countryOfOrigin: 'India',
    manufacturedBy: '7Days Natural',
    ingredients: 'Aqua, Niacinamide, Alpha Arbutin, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Dimethicone, Phenoxyethanol, Fragrance',
    isNew: true,
    isBestseller: true,
    stock: 60,
  },
  {
    image: 'sunblock-matte-finish-7dn.png',
    name: 'Sunblock Matte Finish SPF 50+',
    description: 'With Titanium Dioxide + Zinc Oxide + Vitamin C. Broad spectrum protection against UVA, UVB, and IR-A. Dermatologically tested. Blue light protection with encapsulated technology.',
    price: 549,
    comparePrice: 649,
    category: { name: 'Sunscreen', slug: 'sunscreen', group: 'SKINCARE' },
    collection: { name: '7Days Natural', slug: '7days-natural' },
    netQuantity: '50g',
    countryOfOrigin: 'India',
    manufacturedBy: '7Days Natural',
    ingredients: 'Aqua, Titanium Dioxide, Zinc Oxide, Ascorbic Acid (Vitamin C), Glycerin, Cetearyl Alcohol, Phenoxyethanol, Fragrance',
    isNew: true,
    isBestseller: false,
    stock: 60,
  },
  {
    image: 'salicylic-acid-face-wash-7dn.png',
    name: '2% Salicylic Acid Face Wash',
    description: 'With Limepearl AF + Willow Bark + Allantoin. For active acne — pore purifying, sebum balancing formula for all skin types.',
    price: 349,
    comparePrice: 399,
    category: { name: 'Face Wash', slug: 'face-wash', group: 'SKINCARE' },
    collection: { name: '7Days Natural', slug: '7days-natural' },
    netQuantity: '100ml',
    countryOfOrigin: 'India',
    manufacturedBy: '7Days Natural',
    ingredients: 'Aqua, Salicylic Acid 2%, Cocamidopropyl Betaine, Limepearl AF, Salix Alba (Willow) Bark Extract, Allantoin, Glycerin, Phenoxyethanol',
    isNew: false,
    isBestseller: true,
    stock: 80,
  },
  {
    image: 'niacinamide-face-cleanser-7dn.png',
    name: '2% Niacinamide Gentle Face Cleanser',
    description: 'With Provitamin B5 + Pantolactone for skin hydration. Deep hydration and barrier protection for all skin types.',
    price: 349,
    comparePrice: 399,
    category: { name: 'Face Wash', slug: 'face-wash', group: 'SKINCARE' },
    collection: { name: '7Days Natural', slug: '7days-natural' },
    netQuantity: '100ml',
    countryOfOrigin: 'India',
    manufacturedBy: '7Days Natural',
    ingredients: 'Aqua, Niacinamide 2%, Cocamidopropyl Betaine, Provitamin B5, Pantolactone, Glycerin, Allantoin, Phenoxyethanol',
    isNew: true,
    isBestseller: false,
    stock: 80,
  },
  {
    image: 'sunblock-aqua-gel-7dn.png',
    name: 'Sunblock Aqua Gel SPF 50+',
    description: 'With Ceramide + Vitamin C. Broad spectrum protection with blue light protection. Lightweight aqua gel formula that absorbs quickly without white cast.',
    price: 499,
    comparePrice: 599,
    category: { name: 'Sunscreen', slug: 'sunscreen', group: 'SKINCARE' },
    collection: { name: '7Days Natural', slug: '7days-natural' },
    netQuantity: '30g',
    countryOfOrigin: 'India',
    manufacturedBy: '7Days Natural',
    ingredients: 'Aqua, Zinc Oxide, Titanium Dioxide, Ceramide NP, Ascorbic Acid, Glycerin, Carbomer, Phenoxyethanol',
    isNew: false,
    isBestseller: false,
    stock: 60,
  },
  {
    image: 'cucumber-face-wash-7dn.png',
    name: 'Cucumber Face Wash',
    description: 'With Neem Extract & Vitamin E for instant refreshment. Nourishes and hydrates skin. Cruelty-free formula for all skin types.',
    price: 299,
    comparePrice: 349,
    category: { name: 'Face Wash', slug: 'face-wash', group: 'SKINCARE' },
    collection: { name: '7Days Natural', slug: '7days-natural' },
    netQuantity: '100ml',
    countryOfOrigin: 'India',
    manufacturedBy: '7Days Natural',
    ingredients: 'Aqua, Cucumber Extract, Neem Extract, Tocopheryl Acetate (Vitamin E), Cocamidopropyl Betaine, Glycerin, Allantoin, Phenoxyethanol',
    isNew: false,
    isBestseller: false,
    stock: 80,
  },
  {
    image: 'vitamin-c-face-wash-7dn.png',
    name: 'Vitamin C Face Wash (7Days Natural)',
    description: 'With Orange Peel + Lemon Balm for glowing skin. Exfoliates and deep cleanses for all skin types. Brightens complexion with every wash.',
    price: 299,
    comparePrice: 349,
    category: { name: 'Face Wash', slug: 'face-wash', group: 'SKINCARE' },
    collection: { name: '7Days Natural', slug: '7days-natural' },
    netQuantity: '100ml',
    countryOfOrigin: 'India',
    manufacturedBy: '7Days Natural',
    ingredients: 'Aqua, Ascorbic Acid (Vitamin C), Citrus Sinensis (Orange) Peel Extract, Melissa Officinalis (Lemon Balm) Extract, Cocamidopropyl Betaine, Glycerin, Phenoxyethanol',
    isNew: false,
    isBestseller: false,
    stock: 80,
  },
  {
    image: 'aloe-vera-gel-7dn.png',
    name: 'Aloe Vera Gel',
    description: 'Contains 99% pure aloe vera gel with Aloevera Extract + Basil. For optimal hydration — soothes scalp and hydrates skin.',
    price: 399,
    comparePrice: 449,
    category: { name: 'Gels & Serums', slug: 'gels-serums', group: 'SKINCARE' },
    collection: { name: '7Days Natural', slug: '7days-natural' },
    netQuantity: '200g',
    countryOfOrigin: 'India',
    manufacturedBy: '7Days Natural',
    ingredients: 'Aloe Barbadensis Leaf Juice (99%), Ocimum Basilicum (Basil) Extract, Carbomer, Triethanolamine, Phenoxyethanol',
    isNew: false,
    isBestseller: true,
    stock: 100,
  },
  {
    image: 'kumkumadi-oil-box-7dn.png',
    name: 'Kumkumadi Essential Oil',
    description: 'Made with Kesar for skin healing. Traditional Ayurvedic formulation for skin radiance and healing. Evens skin tone and reduces blemishes.',
    price: 699,
    comparePrice: 849,
    category: { name: 'Oils', slug: 'oils', group: 'SKINCARE' },
    collection: { name: '7Days Natural', slug: '7days-natural' },
    netQuantity: '30ml',
    countryOfOrigin: 'India',
    manufacturedBy: '7Days Natural',
    ingredients: 'Sesamum Indicum (Sesame) Oil, Crocus Sativus (Kesar/Saffron) Extract, Santalum Album (Sandalwood) Oil, Vetiveria Zizanioides Oil, Glycyrrhiza Glabra (Licorice) Root Extract',
    isNew: true,
    isBestseller: false,
    stock: 40,
  },
  {
    image: 'kumkumadi-oil-dropper-7dn.png',
    name: 'Kumkumadi Oil (50ml)',
    description: 'With Kesar & Ratanjot Oil for skin radiance. Reduces fine lines and evens skin tone. Use AM or PM for all skin types.',
    price: 899,
    comparePrice: 1099,
    category: { name: 'Oils', slug: 'oils', group: 'SKINCARE' },
    collection: { name: '7Days Natural', slug: '7days-natural' },
    netQuantity: '50ml',
    countryOfOrigin: 'India',
    manufacturedBy: '7Days Natural',
    ingredients: 'Sesamum Indicum (Sesame) Oil, Crocus Sativus (Kesar/Saffron) Extract, Alkanna Tinctoria (Ratanjot) Root Extract, Santalum Album Oil, Vetiveria Zizanioides Oil',
    isNew: true,
    isBestseller: true,
    stock: 40,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const IMAGES_DIR = path.join(__dirname, 'images');

// Cache of already-uploaded images (filename -> cloudinary url)
// Add any URLs from a previous failed run here to skip re-uploading
const uploadedCache = {
  'vitamin-c-face-wash-ht.png': 'https://res.cloudinary.com/dmigevbpo/image/upload/v1782665522/vedessa/products/product-1782665517433-vitamin-c-face-wash-ht.png',
  'aloevera-face-wash-ht.png': 'https://res.cloudinary.com/dmigevbpo/image/upload/v1782665528/vedessa/products/product-1782665524841-aloevera-face-wash-ht.png',
  'scrub-face-wash-ht.png': 'https://res.cloudinary.com/dmigevbpo/image/upload/v1782665534/vedessa/products/product-1782665530027-scrub-face-wash-ht.png',
  'de-tan-face-wash-ht.png': 'https://res.cloudinary.com/dmigevbpo/image/upload/v1782665538/vedessa/products/product-1782665535242-de-tan-face-wash-ht.png',
  'almond-shampoo-ht-pump.png': 'https://res.cloudinary.com/dmigevbpo/image/upload/v1782665545/vedessa/products/product-1782665540016-almond-shampoo-ht-pump.png',
  'almond-shampoo-ht-clear.png': 'https://res.cloudinary.com/dmigevbpo/image/upload/v1782665556/vedessa/products/product-1782665546953-almond-shampoo-ht-clear.png',
};

async function uploadToCloudinary(filename) {
  if (uploadedCache[filename]) {
    console.log(`  ✓  Using cached URL for ${filename}`);
    return uploadedCache[filename];
  }
  const filePath = path.join(IMAGES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Image file not found: ${filePath}`);
  }
  console.log(`  ☁  Uploading ${filename}...`);
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'vedessa/products',
    public_id: `product-${Date.now()}-${path.basename(filename, path.extname(filename))}`,
    overwrite: false,
  });
  return result.secure_url;
}

async function upsertCategory(category) {
  return prisma.category.upsert({
    where: { slug: category.slug },
    // update group on re-run so existing categories get tagged too
    update: { group: category.group || null },
    create: { name: category.name, slug: category.slug, group: category.group || null },
  });
}

// Categories with no products yet — seeded directly so nav mega-menus
// (Skin Care / Hair Care) have something to show ahead of stock.
const placeholderCategories = [
  { name: 'Conditioner', slug: 'conditioner', group: 'HAIRCARE' },
];

async function upsertCollection(collection) {
  return prisma.collection.upsert({
    where: { slug: collection.slug },
    update: {},
    create: { name: collection.name, slug: collection.slug },
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌿 Vedessa Product Seed Script\n');
  console.log(`Found ${products.length} products to seed.\n`);

  // Seed categories that don't have products yet (nav mega-menu placeholders)
  for (const cat of placeholderCategories) {
    await upsertCategory(cat);
    console.log(`   ✅ Ensured placeholder category: ${cat.name}`);
  }

  // Verify images directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    console.error(`❌ Created images directory at: ${IMAGES_DIR}`);
    console.error('   Please copy your 17 product images into that folder with these exact names:');
    products.forEach(p => console.error(`   - ${p.image}`));
    process.exit(1);
  }

  // Check all images exist before starting
  const missing = products.filter(p => !fs.existsSync(path.join(IMAGES_DIR, p.image)));
  if (missing.length > 0) {
    console.error('❌ Missing image files:');
    missing.forEach(p => console.error(`   - ${p.image}`));
    console.error('\nPlease add these files to backend/scripts/images/ and try again.');
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    console.log(`\n📦 ${product.name}`);

    try {
      // Check if product already exists
      const existing = await prisma.product.findFirst({
        where: { name: product.name },
      });

      if (existing) {
        console.log(`   ⏭  Already exists — skipping`);
        skipped++;
        continue;
      }

      // Upload image
      const imageUrl = await uploadToCloudinary(product.image);

      // Upsert category and collection
      const category = await upsertCategory(product.category);
      const collection = await upsertCollection(product.collection);

      // Insert product
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          image: imageUrl,
          rating: 4.5,
          reviews: 0,
          isNew: product.isNew || false,
          isBestseller: product.isBestseller || false,
          stock: product.stock || 100,
          netQuantity: product.netQuantity || null,
          countryOfOrigin: product.countryOfOrigin || 'India',
          manufacturedBy: product.manufacturedBy || null,
          ingredients: product.ingredients || null,
          categoryId: category.id,
          collectionId: collection.id,
          images: {
            create: [{
              url: imageUrl,
              order: 0,
              isPrimary: true,
            }],
          },
        },
      });

      console.log(`   ✅ Created — ${imageUrl.split('/').pop()}`);
      created++;

    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}`);
      failed++;
    }
  }

  console.log('\n─────────────────────────────────');
  console.log(`✅ Created : ${created}`);
  console.log(`⏭  Skipped : ${skipped}`);
  console.log(`❌ Failed  : ${failed}`);
  console.log('─────────────────────────────────\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());