import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserRole() {
  const email = 'achandrashekara03@gmail.com';
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'Vendor' }
    });
    
    console.log('✅ User role updated successfully!');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Role:', user.role);
  } catch (error) {
    console.error('❌ Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRole();
