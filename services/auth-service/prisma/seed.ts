import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@security.com' },
    update: {},
    create: {
      email: 'admin@security.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create dispatcher user
  const dispatcherPassword = await bcrypt.hash('dispatcher123', 12);
  
  const dispatcher = await prisma.user.upsert({
    where: { email: 'dispatcher@security.com' },
    update: {},
    create: {
      email: 'dispatcher@security.com',
      password: dispatcherPassword,
      role: UserRole.DISPATCHER,
    },
  });

  console.log('Seeded users:', { admin, dispatcher });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
