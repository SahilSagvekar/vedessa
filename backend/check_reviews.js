const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const reviews = await prisma.review.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { fullName: true } },
                product: { select: { name: true } }
            }
        });
        console.log('Recent reviews:', JSON.stringify(reviews, null, 2));

        const count = await prisma.review.count();
        console.log('Total reviews:', count);
    } catch (err) {
        console.error('Error querying reviews:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
