const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixRoles() {
    console.log('--- Role Fix Utility ---');

    // Example: Update specific users by email
    // Add the emails and desired roles here
    const updates = [
        { email: 'admin@pms.com', role: 'ADMIN' },
        { email: 'manager@pms.com', role: 'MANAGER' },
        { email: 'cus@pms.com', role: 'CUSTOMER' },
        // Add more as needed
    ];

    for (const update of updates) {
        try {
            const user = await prisma.user.update({
                where: { email: update.email },
                data: { role: update.role }
            });
            console.log(`✅ Updated ${user.email} to ${user.role}`);
        } catch (error) {
            console.error(`❌ Failed to update ${update.email}:`, error.message);
        }
    }

    await prisma.$disconnect();
    console.log('--- Done ---');
}

fixRoles();
