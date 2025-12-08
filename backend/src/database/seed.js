const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const products = [
  {
    name: "Ashwaras Body Massage Oil",
    description: "Nourished Skin and Relaxed Mind",
    price: 2295,
    rating: 4.9,
    reviews: 134,
    category: "bath_body",
    collection: "ashwaras",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=500&fit=crop"
  },
  {
    name: "Pure Rose Water Facial Toner",
    description: "Refreshing & Balancing Toner",
    price: 895,
    rating: 4.7,
    reviews: 312,
    category: "skincare",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop"
  },
  {
    name: "Eladhi Nourishing Rich Cream",
    description: "Barrier Repair Cream With Cardamom, Aloe Vera & Glycerin",
    price: 3125,
    rating: 4.8,
    reviews: 112,
    category: "skincare",
    collection: "eladhi",
    isNew: true,
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=500&fit=crop"
  },
  {
    name: "Rejuvenating & Brightening Ayurvedic Night Cream",
    description: "For Radiant Morning Skin",
    price: 2850,
    rating: 4.9,
    reviews: 178,
    category: "skincare",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=500&fit=crop"
  },
  {
    name: "Bringaras Hydrating Conditioner",
    description: "For Balanced Scalp & Shiny Hair",
    price: 2195,
    rating: 4.7,
    reviews: 89,
    category: "haircare",
    collection: "bringaras",
    isNew: true,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=500&fit=crop"
  },
  {
    name: "Bringaraj Hair Oil",
    description: "Promotes Hair Growth & Prevents Premature Greying",
    price: 1295,
    rating: 4.8,
    reviews: 245,
    category: "haircare",
    collection: "bringaras",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=500&fit=crop"
  },
  {
    name: "Saffron & Sandalwood Luxurious Gift Set",
    description: "Premium Ayurvedic Gifting Collection",
    price: 5995,
    rating: 5,
    reviews: 67,
    category: "gifting",
    image: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=500&fit=crop"
  },
  {
    name: "Eladhi Hydrating Fresh Emulsion",
    description: "Lightweight Cream For Dewy Skin",
    price: 3025,
    rating: 4.9,
    reviews: 156,
    category: "skincare",
    collection: "eladhi",
    isNew: true,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop"
  },
  {
    name: "Kumkumadi Brightening Ayurvedic Face Scrub",
    description: "Gentle Exfoliation For Glowing Skin",
    price: 1895,
    rating: 4.6,
    reviews: 198,
    category: "skincare",
    collection: "kumkumadi",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=500&fit=crop"
  },
  {
    name: "Rose & Jasmine Face Cleanser",
    description: "Gentle Daily Cleansing",
    price: 1650,
    rating: 4.8,
    reviews: 276,
    category: "skincare",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop"
  },
  {
    name: "Ashwaras Replenishing Body Oil",
    description: "Leave In Body Oil For Daily Use",
    price: 3395,
    rating: 4.8,
    reviews: 45,
    category: "bath_body",
    collection: "ashwaras",
    isNew: true,
    image: "https://images.unsplash.com/photo-1600428877878-1a0ff561f78a?w=400&h=500&fit=crop"
  },
  {
    name: "Eladhi Restorative Face & Body Oil",
    description: "After Bath Oil For Smooth Skin",
    price: 2050,
    rating: 4.7,
    reviews: 98,
    category: "skincare",
    collection: "eladhi",
    isNew: true,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=500&fit=crop"
  },
  {
    name: "Bringaras Purifying Scalp Scrub",
    description: "Eliminates Buildup For Scalp & Mind Refreshment",
    price: 3195,
    rating: 4.8,
    reviews: 67,
    category: "haircare",
    collection: "bringaras",
    isNew: true,
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=500&fit=crop"
  },
  {
    name: "Kumkumadi Youth-Illuminating Silky Serum",
    description: "The Botanical Alternative to Vitamin C",
    price: 2695,
    rating: 5,
    reviews: 23,
    category: "skincare",
    collection: "kumkumadi",
    isNew: true,
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=400&h=500&fit=crop"
  },
  {
    name: "Bringaras Regenerating Hair Mask",
    description: "For Balanced Scalp & Shiny Hair",
    price: 1525,
    rating: 4.9,
    reviews: 128,
    category: "haircare",
    collection: "bringaras",
    isNew: true,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop"
  },
  {
    name: "Bringaras Smoothing Hair Serum",
    description: "For Frizz-Free Lustrous Hair",
    price: 3125,
    rating: 4.7,
    reviews: 54,
    category: "haircare",
    collection: "bringaras",
    isNew: true,
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=400&h=500&fit=crop"
  }
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Get categories
    const categories = await prisma.category.findMany();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    // Get collections
    const collections = await prisma.collection.findMany();
    const collectionMap = {};
    collections.forEach(col => {
      collectionMap[col.slug] = col.id;
    });

    console.log('📦 Creating products...');
    let productCount = 0;

    for (const productData of products) {
      // Check if product already exists
      const existing = await prisma.product.findFirst({
        where: { name: productData.name }
      });

      if (existing) {
        console.log(`⏭️  Skipping "${productData.name}" (already exists)`);
        continue;
      }

      await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          rating: productData.rating,
          reviews: productData.reviews,
          isNew: productData.isNew || false,
          isBestseller: false,
          stock: 100,
          categoryId: categoryMap[productData.category],
          collectionId: productData.collection ? collectionMap[productData.collection] : null
        }
      });
      
      productCount++;
      console.log(`✅ Created "${productData.name}"`);
    }

    console.log(`\n✅ Created ${productCount} products\n`);

    // Show summary by category
    const summary = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    console.log('📊 Summary:');
    summary.forEach(cat => {
      console.log(`   ${cat.name}: ${cat._count.products} products`);
    });

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('🔜 Next steps:');
    console.log('1. Run: npm run dev (to start the server)');
    console.log('2. Test: http://localhost:5000/api/products\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });