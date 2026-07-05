const { PrismaClient } = require('@prisma/client');

// Cap pool size so a small free-tier Postgres (Neon free tier: ~a handful of
// concurrent connections) doesn't get exhausted by this single instance.
const withConnectionLimit = (url) => {
  if (!url) return url;
  return url.includes('connection_limit=') ? url : `${url}${url.includes('?') ? '&' : '?'}connection_limit=5`;
};

// Initialize Prisma Client with logging
const prisma = new PrismaClient({
  datasources: {
    db: { url: withConnectionLimit(process.env.DATABASE_URL) },
  },
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

// Test database connection on startup
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to Neon Database (PostgreSQL via Prisma)');
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  });

// Graceful shutdown
const gracefulShutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('beforeExit', gracefulShutdown);

module.exports = prisma;