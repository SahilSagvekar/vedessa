const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setup() {
  console.log('🚀 Setting up database...\n');

  try {
    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@ayurveda.com' },
      update: {},
      create: {
        email: 'admin@ayurveda.com',
        passwordHash: adminPassword,
        fullName: 'Admin User',
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user created (email: admin@ayurveda.com, password: admin123)\n');

    // Create categories
    console.log('📁 Creating categories...');
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'skincare' },
        update: {},
        create: { name: 'Skincare', slug: 'skincare' }
      }),
      prisma.category.upsert({
        where: { slug: 'haircare' },
        update: {},
        create: { name: 'Haircare', slug: 'haircare' }
      }),
      prisma.category.upsert({
        where: { slug: 'bath_body' },
        update: {},
        create: { name: 'Bath & Body', slug: 'bath_body' }
      }),
      prisma.category.upsert({
        where: { slug: 'gifting' },
        update: {},
        create: { name: 'Gifting', slug: 'gifting' }
      })
    ]);
    console.log(`✅ Created ${categories.length} categories\n`);

    // Create collections
    console.log('🎨 Creating collections...');
    const collections = await Promise.all([
      prisma.collection.upsert({
        where: { slug: 'bringaras' },
        update: {},
        create: {
          name: 'Bringaras Collection',
          slug: 'bringaras',
          image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300&h=300&fit=crop'
        }
      }),
      prisma.collection.upsert({
        where: { slug: 'eladhi' },
        update: {},
        create: {
          name: 'Eladhi Collection',
          slug: 'eladhi',
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop'
        }
      }),
      prisma.collection.upsert({
        where: { slug: 'ashwaras' },
        update: {},
        create: {
          name: 'Ashwaras Collection',
          slug: 'ashwaras',
          image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop'
        }
      }),
      prisma.collection.upsert({
        where: { slug: 'kumkumadi' },
        update: {},
        create: {
          name: 'Kumkumadi Collection',
          slug: 'kumkumadi',
          image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=300&h=300&fit=crop'
        }
      })
    ]);
    console.log(`✅ Created ${collections.length} collections\n`);

    console.log('🎉 Database setup completed successfully!\n');
    console.log('📝 Initial data:');
    console.log('   - 1 admin user (admin@ayurveda.com / admin123)');
    console.log('   - 4 categories');
    console.log('   - 4 collections\n');
    console.log('🔜 Next step: Run "npm run db:seed" to add products');

  } catch (error) {
    console.error('❌ Error during setup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setup()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });