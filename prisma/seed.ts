import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create Users
  console.log('Creating users...');
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      role: 'Customer',
      phone: '+1234567890'
    }
  });

  const vendor = await prisma.user.upsert({
    where: { email: 'vendor@gearshift.com' },
    update: {},
    create: {
      email: 'vendor@gearshift.com',
      name: 'GearShift Vendor',
      role: 'Vendor'
    }
  });

  // Create the real vendor account
  const realVendor = await prisma.user.upsert({
    where: { email: 'achandrashekara03@gmail.com' },
    update: { role: 'Vendor' },
    create: {
      email: 'achandrashekara03@gmail.com',
      name: 'Chandrasekhar',
      role: 'Vendor'
    }
  });

  // Create Addresses
  console.log('Creating addresses...');
  const shippingAddress = await prisma.address.create({
    data: {
      userId: testUser.id,
      type: 'Shipping',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      isDefault: true
    }
  });

  // Create Payment Method
  console.log('Creating payment methods...');
  const paymentMethod = await prisma.paymentMethod.create({
    data: {
      userId: testUser.id,
      type: 'Credit Card',
      provider: 'Visa',
      lastFour: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true
    }
  });

  // Create Manufacturers
  console.log('Creating manufacturers...');
  const bosch = await prisma.manufacturer.upsert({
    where: { name: 'Bosch' },
    update: {},
    create: {
      name: 'Bosch',
      description: 'German multinational engineering and technology company',
      website: 'https://www.bosch.com'
    }
  });

  const ngk = await prisma.manufacturer.upsert({
    where: { name: 'NGK' },
    update: {},
    create: {
      name: 'NGK',
      description: 'Japanese manufacturer of spark plugs and related products',
      website: 'https://www.ngk.com'
    }
  });

  const acDelco = await prisma.manufacturer.upsert({
    where: { name: 'ACDelco' },
    update: {},
    create: {
      name: 'ACDelco',
      description: 'Automotive replacement parts division of General Motors',
      website: 'https://www.acdelco.com'
    }
  });

  // Create Suppliers
  console.log('Creating suppliers...');
  const autoPartsSupplier = await prisma.supplier.upsert({
    where: { name: 'AutoParts Direct' },
    update: {},
    create: {
      name: 'AutoParts Direct',
      contactEmail: 'orders@autopartsdirect.com',
      contactPhone: '+1-800-AUTO-123',
      address: '456 Industrial Blvd, Detroit, MI 48201',
      rating: 4.5
    }
  });

  // Create Categories
  console.log('Creating categories...');
  const engineParts = await prisma.category.upsert({
    where: { name: 'Engine Parts' },
    update: {},
    create: {
      name: 'Engine Parts',
      description: 'Components for engine operation and maintenance'
    }
  });

  const electrical = await prisma.category.upsert({
    where: { name: 'Electrical' },
    update: {},
    create: {
      name: 'Electrical',
      description: 'Electrical components and ignition system parts'
    }
  });

  const brakes = await prisma.category.upsert({
    where: { name: 'Brakes' },
    update: {},
    create: {
      name: 'Brakes',
      description: 'Brake system components and accessories'
    }
  });

  // Create Vehicles
  console.log('Creating vehicles...');
  const hondaCivic = await prisma.vehicle.create({
    data: {
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      vin: 'JHMFC1F30KX000001',
      engine: '2.0L 4-cylinder',
      transmission: 'CVT',
      drivetrain: 'FWD',
      userId: testUser.id
    }
  });

  const fordFocus = await prisma.vehicle.create({
    data: {
      make: 'Ford',
      model: 'Focus',
      year: 2015,
      engine: '2.0L 4-cylinder',
      transmission: 'Manual 6-speed',
      drivetrain: 'FWD',
      userId: testUser.id
    }
  });

  // Create Parts
  console.log('Creating parts...');
  const sparkPlugs = await prisma.part.create({
    data: {
      sku: 'BOSCH-SP001',
      name: 'Bosch Premium Spark Plugs',
      description: 'High-performance iridium spark plugs for optimal engine performance and fuel efficiency',
      price: 89.99,
      condition: 'New',
      weight: 0.5,
      dimensions: '4.5" x 2.1" x 2.1"',
      carbonFootprint: 2.5,
      warrantyPeriod: 12,
      vendorId: vendor.id,
      manufacturerId: bosch.id,
      supplierId: autoPartsSupplier.id
    }
  });

  const brakePads = await prisma.part.create({
    data: {
      sku: 'ACDELCO-BP002',
      name: 'ACDelco Professional Brake Pads',
      description: 'Premium ceramic brake pads with excellent stopping power and reduced dust',
      price: 65.99,
      condition: 'New',
      weight: 2.8,
      dimensions: '6.2" x 4.1" x 0.6"',
      carbonFootprint: 8.5,
      warrantyPeriod: 24,
      vendorId: vendor.id,
      manufacturerId: acDelco.id,
      supplierId: autoPartsSupplier.id
    }
  });

  const oilFilter = await prisma.part.create({
    data: {
      sku: 'BOSCH-OF003',
      name: 'Bosch Premium Oil Filter',
      description: 'High-quality oil filter for superior engine protection and performance',
      price: 15.99,
      condition: 'New',
      weight: 0.8,
      dimensions: '3.9" x 3.9" x 4.6"',
      carbonFootprint: 1.2,
      warrantyPeriod: 6,
      vendorId: vendor.id,
      manufacturerId: bosch.id,
      supplierId: autoPartsSupplier.id
    }
  });

  // Create Part Categories
  console.log('Creating part categories...');
  await prisma.partCategory.createMany({
    data: [
      { partId: sparkPlugs.id, categoryId: engineParts.id, isPrimary: true },
      { partId: sparkPlugs.id, categoryId: electrical.id, isPrimary: false },
      { partId: brakePads.id, categoryId: brakes.id, isPrimary: true },
      { partId: oilFilter.id, categoryId: engineParts.id, isPrimary: true }
    ]
  });

  // Create Fitments
  console.log('Creating part fitments...');
  await prisma.fitment.createMany({
    data: [
      { partId: sparkPlugs.id, vehicleId: hondaCivic.id, notes: 'Direct fit for 2.0L engine' },
      { partId: sparkPlugs.id, vehicleId: fordFocus.id, notes: 'Compatible with 2.0L engine' },
      { partId: brakePads.id, vehicleId: hondaCivic.id, notes: 'Front brake pads' },
      { partId: oilFilter.id, vehicleId: hondaCivic.id, notes: 'Standard oil change filter' },
      { partId: oilFilter.id, vehicleId: fordFocus.id, notes: 'Standard oil change filter' }
    ]
  });

  // Create Inventory
  console.log('Creating inventory records...');
  await prisma.inventory.createMany({
    data: [
      { partId: sparkPlugs.id, quantity: 150, location: 'Warehouse A-12', minStock: 25 },
      { partId: brakePads.id, quantity: 85, location: 'Warehouse B-8', minStock: 15 },
      { partId: oilFilter.id, quantity: 300, location: 'Warehouse C-5', minStock: 50 }
    ]
  });

  // Create Promotions
  console.log('Creating promotions...');
  const winterSale = await prisma.promotion.create({
    data: {
      code: 'WINTER2024',
      description: '15% off all brake parts',
      type: 'Percentage',
      value: 15,
      minOrder: 50,
      maxDiscount: 100,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      usageLimit: 1000,
      usageCount: 0,
      isActive: true
    }
  });

  // Create Reviews
  console.log('Creating reviews...');
  await prisma.review.createMany({
    data: [
      {
        partId: sparkPlugs.id,
        userId: testUser.id,
        rating: 5,
        title: 'Excellent Performance',
        comment: 'These spark plugs improved my car\'s performance noticeably. Great quality!',
        verified: true
      },
      {
        partId: brakePads.id,
        userId: testUser.id,
        rating: 4,
        title: 'Good stopping power',
        comment: 'Much better than the original pads. Less dust too.',
        verified: true
      }
    ]
  });

  // Create Sample Order
  console.log('Creating sample orders...');
  const sampleOrder = await prisma.order.create({
    data: {
      userId: testUser.id,
      status: 'Delivered',
      currency: 'USD',
      subtotal: 171.97,
      taxAmount: 13.76,
      shippingAmount: 9.99,
      totalAmount: 195.72,
      shippingRoute: 'Standard Ground',
      ecoShipping: false,
      carbonSaved: 0,
      shippingAddressId: shippingAddress.id,
      billingAddressId: shippingAddress.id,
      paymentMethodId: paymentMethod.id,
      trackingNumber: 'GS1234567890',
      notes: 'Test order for seeding'
    }
  });

  // Create Order Items
  await prisma.orderItem.createMany({
    data: [
      { orderId: sampleOrder.id, partId: sparkPlugs.id, quantity: 1, price: 89.99 },
      { orderId: sampleOrder.id, partId: brakePads.id, quantity: 1, price: 65.99 },
      { orderId: sampleOrder.id, partId: oilFilter.id, quantity: 1, price: 15.99 }
    ]
  });

  // Create a second order
  const secondOrder = await prisma.order.create({
    data: {
      userId: testUser.id,
      status: 'Shipped',
      currency: 'USD',
      subtotal: 65.99,
      taxAmount: 5.28,
      shippingAmount: 9.99,
      totalAmount: 81.26,
      shippingRoute: 'Express',
      ecoShipping: true,
      carbonSaved: 2.5,
      shippingAddressId: shippingAddress.id,
      billingAddressId: shippingAddress.id,
      paymentMethodId: paymentMethod.id,
      trackingNumber: 'GS0987654321'
    }
  });

  await prisma.orderItem.create({
    data: {
      orderId: secondOrder.id,
      partId: brakePads.id,
      quantity: 1,
      price: 65.99
    }
  });

  console.log('Database seeding completed successfully!');
  console.log(`Created:
  - ${await prisma.user.count()} users
  - ${await prisma.manufacturer.count()} manufacturers  
  - ${await prisma.supplier.count()} suppliers
  - ${await prisma.category.count()} categories
  - ${await prisma.vehicle.count()} vehicles
  - ${await prisma.part.count()} parts
  - ${await prisma.order.count()} orders
  - ${await prisma.review.count()} reviews`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });