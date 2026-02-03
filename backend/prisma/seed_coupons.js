const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const coupons = [
        {
            code: 'WELCOME10',
            description: '10% off on your first order',
            discountType: 'PERCENTAGE',
            discountValue: 10,
            minOrderAmount: 500,
            maxDiscountAmount: 200,
            isActive: true,
            startDate: new Date(),
        },
        {
            code: 'VEDESSA50',
            description: 'Flat ₹50 off on orders above ₹499',
            discountType: 'FIXED_AMOUNT',
            discountValue: 50,
            minOrderAmount: 499,
            isActive: true,
            startDate: new Date(),
        },
        {
            code: 'SAVE20',
            description: '20% off up to ₹500',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            minOrderAmount: 1000,
            maxDiscountAmount: 500,
            isActive: true,
            startDate: new Date(),
        }
    ];

    console.log('Seeding coupons...');

    for (const coupon of coupons) {
        await prisma.coupon.upsert({
            where: { code: coupon.code },
            update: coupon,
            create: coupon,
        });
    }

    console.log('Coupons seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
