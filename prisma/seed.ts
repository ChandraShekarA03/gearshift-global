import { supabase } from '../src/lib/supabase';

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create manufacturers
  const manufacturers = [
    {
      name: 'Bosch',
      description: 'Leading automotive technology and services company',
      website: 'https://www.bosch.com',
      logo: '/manufacturers/bosch.png'
    },
    {
      name: 'NGK',
      description: 'World leader in spark plugs and oxygen sensors',
      website: 'https://www.ngk.com',
      logo: '/manufacturers/ngk.png'
    },
    {
      name: 'Michelin',
      description: 'Premium tire manufacturer',
      website: 'https://www.michelin.com',
      logo: '/manufacturers/michelin.png'
    },
    {
      name: 'ACDelco',
      description: 'GM Genuine Parts and ACDelco',
      website: 'https://www.acdelco.com',
      logo: '/manufacturers/acdelco.png'
    },
    {
      name: 'Denso',
      description: 'Global automotive components manufacturer',
      website: 'https://www.denso.com',
      logo: '/manufacturers/denso.png'
    },
    {
      name: 'Continental',
      description: 'Technology company for mobility industries',
      website: 'https://www.continental.com',
      logo: '/manufacturers/continental.png'
    },
    {
      name: 'Monroe',
      description: 'Shock absorbers and suspension components',
      website: 'https://www.monroe.com',
      logo: '/manufacturers/monroe.png'
    },
    {
      name: 'Fram',
      description: 'Oil filters and automotive filtration products',
      website: 'https://www.fram.com',
      logo: '/manufacturers/fram.png'
    },
    {
      name: 'Mobil 1',
      description: 'Premium synthetic motor oils and lubricants',
      website: 'https://www.mobil1.com',
      logo: '/manufacturers/mobil1.png'
    },
    {
      name: 'Brembo',
      description: 'High-performance braking systems',
      website: 'https://www.brembo.com',
      logo: '/manufacturers/brembo.png'
    },
    {
      name: 'K&N',
      description: 'Performance air filters and intake systems',
      website: 'https://www.kandn.com',
      logo: '/manufacturers/kandn.png'
    },
    {
      name: 'MagnaFlow',
      description: 'Exhaust systems and catalytic converters',
      website: 'https://www.magnaflow.com',
      logo: '/manufacturers/magnaflow.png'
    }
  ];

  const manufacturerInserts = [];
  for (const manufacturer of manufacturers) {
    // Check if manufacturer already exists
    const { data: existing } = await supabase
      .from('Manufacturer')
      .select('id')
      .eq('name', manufacturer.name)
      .single();

    let manufacturerData;
    if (existing) {
      manufacturerData = existing;
    } else {
      const { data, error } = await supabase
        .from('Manufacturer')
        .insert(manufacturer)
        .select()
        .single();

      if (error) {
        console.error('Error creating manufacturer:', error);
        continue;
      }
      manufacturerData = data;
    }
    manufacturerInserts.push(manufacturerData);
  }

  // Create suppliers
  const suppliers = [
    {
      name: 'AutoZone',
      contactEmail: 'suppliers@autozone.com',
      contactPhone: '+1-800-288-6966',
      address: '1234 Supplier Way, Memphis, TN 38118',
      rating: 4.5
    },
    {
      name: 'NAPA Auto Parts',
      contactEmail: 'suppliers@napa.com',
      contactPhone: '+1-800-362-6627',
      address: '4725 Industrial Park Dr, Memphis, TN 38118',
      rating: 4.3
    },
    {
      name: 'O\'Reilly Auto Parts',
      contactEmail: 'suppliers@oreillyauto.com',
      contactPhone: '+1-888-327-7156',
      address: '233 S Patterson Ave, Springfield, MO 65802',
      rating: 4.4
    }
  ];

  const supplierInserts = [];
  for (const supplier of suppliers) {
    // Check if supplier already exists
    const { data: existing } = await supabase
      .from('Supplier')
      .select('id')
      .eq('name', supplier.name)
      .single();

    let supplierData;
    if (existing) {
      supplierData = existing;
    } else {
      const { data, error } = await supabase
        .from('Supplier')
        .insert(supplier)
        .select()
        .single();

      if (error) {
        console.error('Error creating supplier:', error);
        continue;
      }
      supplierData = data;
    }
    supplierInserts.push(supplierData);
  }

  // Create categories
  const categories = [
    { name: 'Engine Parts', description: 'Internal combustion engine components' },
    { name: 'Brake System', description: 'Braking system components' },
    { name: 'Suspension', description: 'Suspension and steering components' },
    { name: 'Electrical', description: 'Electrical and electronic components' },
    { name: 'Exhaust', description: 'Exhaust system components' },
    { name: 'Cooling System', description: 'Engine cooling components' },
    { name: 'Fuel System', description: 'Fuel delivery components' },
    { name: 'Transmission', description: 'Transmission and drivetrain components' }
  ];

  const categoryInserts = [];
  for (const category of categories) {
    // Check if category already exists
    const { data: existing } = await supabase
      .from('Category')
      .select('id')
      .eq('name', category.name)
      .single();

    let categoryData;
    if (existing) {
      categoryData = existing;
    } else {
      const { data, error } = await supabase
        .from('Category')
        .insert(category)
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        continue;
      }
      categoryData = data;
    }
    categoryInserts.push(categoryData);
  }

  // Get existing vendor user or create one
  let { data: vendor } = await supabase
    .from('User')
    .select('*')
    .eq('role', 'Vendor')
    .single();

  if (!vendor) {
    const { data, error } = await supabase
      .from('User')
      .insert({
        email: 'vendor@gearshift.com',
        name: 'GearShift Vendor',
        role: 'Vendor'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating vendor:', error);
      return;
    }
    vendor = data;
  }

  // Create sample vehicles
  const vehicles = [
    {
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      vin: '1HGBH41JXMN109186',
      engine: '2.0L 4-Cylinder',
      transmission: 'CVT',
      drivetrain: 'FWD',
      userId: vendor.id
    },
    {
      make: 'Ford',
      model: 'Focus',
      year: 2015,
      vin: '1FAHP2F8XFG123456',
      engine: '2.0L 4-Cylinder',
      transmission: 'Manual',
      drivetrain: 'FWD',
      userId: vendor.id
    },
    {
      make: 'Mazda',
      model: 'Mazda3',
      year: 2013,
      vin: 'JM1BL1U7XD1789012',
      engine: '2.0L 4-Cylinder',
      transmission: 'Automatic',
      drivetrain: 'FWD',
      userId: vendor.id
    },
    {
      make: 'Nissan',
      model: 'Altima',
      year: 2015,
      vin: '1N4AL3AP9FC123456',
      engine: '2.5L 4-Cylinder',
      transmission: 'CVT',
      drivetrain: 'FWD',
      userId: vendor.id
    },
    {
      make: 'Toyota',
      model: 'Corolla',
      year: 2015,
      vin: '2T1BURHE0FC123456',
      engine: '1.8L 4-Cylinder',
      transmission: 'Automatic',
      drivetrain: 'FWD',
      userId: vendor.id
    }
  ];

  const vehicleInserts = [];
  for (const vehicle of vehicles) {
    // Check if vehicle already exists
    const { data: existing } = await supabase
      .from('Vehicle')
      .select('id')
      .eq('vin', vehicle.vin)
      .single();

    let vehicleData;
    if (existing) {
      vehicleData = existing;
    } else {
      const { data, error } = await supabase
        .from('Vehicle')
        .insert(vehicle)
        .select()
        .single();

      if (error) {
        console.error('Error creating vehicle:', error);
        continue;
      }
      vehicleData = data;
    }
    vehicleInserts.push(vehicleData);
  }

  // Create sample parts
  const sampleParts = [
    {
      sku: 'BOSCH-12345',
      name: 'Bosch Premium Spark Plugs',
      description: 'High-performance iridium spark plugs for optimal engine performance',
      price: 89.99,
      condition: 'New',
      weight: 0.5,
      dimensions: '{"length": "3.5", "width": "1.2", "height": "1.2"}',
      carbonFootprint: 2.5,
      warrantyPeriod: 24,
      manufacturerId: manufacturerInserts[0]?.id,
      supplierId: supplierInserts[0]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[0]?.id, categoryInserts[3]?.id], // Engine Parts, Electrical
      fitments: [vehicleInserts[0]?.id, vehicleInserts[1]?.id, vehicleInserts[2]?.id], // Honda Civic, Ford Focus, Mazda3
      inventory: { quantity: 150, location: 'Warehouse A-12', minStock: 20, maxStock: 200 }
    },
    {
      sku: 'NGK-67890',
      name: 'NGK Iridium IX Spark Plugs',
      description: 'Premium iridium spark plugs with excellent durability and performance',
      price: 79.99,
      condition: 'New',
      weight: 0.4,
      dimensions: '{"length": "3.2", "width": "1.1", "height": "1.1"}',
      carbonFootprint: 2.2,
      warrantyPeriod: 36,
      manufacturerId: manufacturerInserts[1]?.id,
      supplierId: supplierInserts[1]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[0]?.id, categoryInserts[3]?.id],
      fitments: [vehicleInserts[0]?.id, vehicleInserts[3]?.id, vehicleInserts[4]?.id],
      inventory: { quantity: 200, location: 'Warehouse B-8', minStock: 25, maxStock: 250 }
    },
    {
      sku: 'MIC-11111',
      name: 'Michelin Pilot Sport 4S Tires',
      description: 'Ultra-high performance tires for sporty driving and all-season grip',
      price: 189.99,
      condition: 'New',
      weight: 25.0,
      dimensions: '{"diameter": "18", "width": "225", "aspect_ratio": "40"}',
      carbonFootprint: 15.8,
      warrantyPeriod: 60,
      manufacturerId: manufacturerInserts[2]?.id,
      supplierId: supplierInserts[2]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[2]?.id],
      fitments: [vehicleInserts[0]?.id, vehicleInserts[1]?.id, vehicleInserts[3]?.id],
      inventory: { quantity: 50, location: 'Warehouse C-15', minStock: 10, maxStock: 100 }
    },
    {
      sku: 'ACD-22222',
      name: 'ACDelco Professional Brake Pads',
      description: 'Premium ceramic brake pads with excellent stopping power and reduced dust',
      price: 65.99,
      condition: 'New',
      weight: 3.2,
      dimensions: '{"length": "6.5", "width": "4.2", "height": "2.1"}',
      carbonFootprint: 8.5,
      warrantyPeriod: 12,
      manufacturerId: manufacturerInserts[3]?.id,
      supplierId: supplierInserts[0]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[1]?.id],
      fitments: vehicleInserts.map(v => v.id),
      inventory: { quantity: 120, location: 'Warehouse A-5', minStock: 15, maxStock: 150 }
    },
    {
      sku: 'DEN-33333',
      name: 'Denso Oxygen Sensor',
      description: 'High-quality oxygen sensor for accurate emissions monitoring',
      price: 45.99,
      condition: 'New',
      weight: 0.8,
      dimensions: '{"length": "4.5", "width": "2.2", "height": "2.2"}',
      carbonFootprint: 3.2,
      warrantyPeriod: 24,
      manufacturerId: manufacturerInserts[4]?.id,
      supplierId: supplierInserts[1]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[3]?.id, categoryInserts[4]?.id],
      fitments: vehicleInserts.map(v => v.id),
      inventory: { quantity: 180, location: 'Warehouse B-12', minStock: 20, maxStock: 220 }
    },
    {
      sku: 'CON-44444',
      name: 'Continental ContiProContact Tires',
      description: 'All-season touring tires with excellent wet and dry performance',
      price: 129.99,
      condition: 'New',
      weight: 22.5,
      dimensions: '{"diameter": "16", "width": "205", "aspect_ratio": "55"}',
      carbonFootprint: 12.3,
      warrantyPeriod: 72,
      manufacturerId: manufacturerInserts[5]?.id,
      supplierId: supplierInserts[2]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[2]?.id],
      fitments: [vehicleInserts[2]?.id, vehicleInserts[3]?.id, vehicleInserts[4]?.id],
      inventory: { quantity: 75, location: 'Warehouse C-8', minStock: 12, maxStock: 120 }
    },
    // Additional parts for expanded catalog
    {
      sku: 'MON-55555',
      name: 'Monroe Quick-Strut Assembly',
      description: 'Complete strut assembly with coil spring for improved ride comfort',
      price: 149.99,
      condition: 'New',
      weight: 18.5,
      dimensions: '{"length": "24", "width": "8", "height": "8"}',
      carbonFootprint: 11.2,
      warrantyPeriod: 36,
      manufacturerId: manufacturerInserts[6]?.id,
      supplierId: supplierInserts[0]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[2]?.id],
      fitments: [vehicleInserts[0]?.id, vehicleInserts[1]?.id],
      inventory: { quantity: 85, location: 'Warehouse D-3', minStock: 10, maxStock: 100 }
    },
    {
      sku: 'FRAM-66666',
      name: 'Fram Extra Guard Oil Filter',
      description: 'High-efficiency oil filter with 99% filtration efficiency',
      price: 12.99,
      condition: 'New',
      weight: 0.6,
      dimensions: '{"length": "4", "width": "3.5", "height": "3.5"}',
      carbonFootprint: 1.8,
      warrantyPeriod: 12,
      manufacturerId: manufacturerInserts[7]?.id,
      supplierId: supplierInserts[1]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[0]?.id],
      fitments: vehicleInserts.map(v => v.id),
      inventory: { quantity: 300, location: 'Warehouse A-1', minStock: 50, maxStock: 400 }
    },
    {
      sku: 'MOBIL-77777',
      name: 'Mobil 1 High Mileage Synthetic Oil',
      description: 'Advanced synthetic motor oil for engines with over 75,000 miles',
      price: 34.99,
      condition: 'New',
      weight: 8.5,
      dimensions: '{"length": "8", "width": "4", "height": "12"}',
      carbonFootprint: 6.8,
      warrantyPeriod: 24,
      manufacturerId: manufacturerInserts[8]?.id,
      supplierId: supplierInserts[2]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[0]?.id],
      fitments: vehicleInserts.map(v => v.id),
      inventory: { quantity: 200, location: 'Warehouse B-15', minStock: 30, maxStock: 250 }
    },
    {
      sku: 'BREM-88888',
      name: 'Brembo Cross-Drilled Brake Rotors',
      description: 'High-performance cross-drilled rotors for improved heat dissipation',
      price: 199.99,
      condition: 'New',
      weight: 12.8,
      dimensions: '{"diameter": "12.5", "thickness": "1.1"}',
      carbonFootprint: 14.5,
      warrantyPeriod: 24,
      manufacturerId: manufacturerInserts[9]?.id,
      supplierId: supplierInserts[0]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[1]?.id],
      fitments: [vehicleInserts[0]?.id, vehicleInserts[3]?.id],
      inventory: { quantity: 45, location: 'Warehouse C-20', minStock: 8, maxStock: 80 }
    },
    {
      sku: 'KN-99999',
      name: 'K&N High-Flow Air Filter',
      description: 'Washable and reusable high-flow air filter for increased horsepower',
      price: 59.99,
      condition: 'New',
      weight: 1.2,
      dimensions: '{"length": "8", "width": "6", "height": "2"}',
      carbonFootprint: 4.2,
      warrantyPeriod: 120,
      manufacturerId: manufacturerInserts[10]?.id,
      supplierId: supplierInserts[1]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[0]?.id],
      fitments: [vehicleInserts[1]?.id, vehicleInserts[2]?.id, vehicleInserts[4]?.id],
      inventory: { quantity: 120, location: 'Warehouse D-7', minStock: 15, maxStock: 150 }
    },
    {
      sku: 'MAGNA-10101',
      name: 'MagnaFlow Stainless Steel Exhaust System',
      description: 'Complete stainless steel exhaust system with improved flow and sound',
      price: 349.99,
      condition: 'New',
      weight: 28.5,
      dimensions: '{"length": "96", "width": "12", "height": "8"}',
      carbonFootprint: 18.9,
      warrantyPeriod: 60,
      manufacturerId: manufacturerInserts[11]?.id,
      supplierId: supplierInserts[2]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[4]?.id],
      fitments: [vehicleInserts[0]?.id, vehicleInserts[3]?.id],
      inventory: { quantity: 25, location: 'Warehouse E-5', minStock: 5, maxStock: 50 }
    },
    {
      sku: 'BOSCH-20202',
      name: 'Bosch Wiper Blades - 22"',
      description: 'All-season wiper blades with aerodynamic design for streak-free visibility',
      price: 24.99,
      condition: 'New',
      weight: 0.8,
      dimensions: '{"length": "22", "width": "2", "height": "1"}',
      carbonFootprint: 2.1,
      warrantyPeriod: 12,
      manufacturerId: manufacturerInserts[0]?.id,
      supplierId: supplierInserts[0]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[3]?.id],
      fitments: vehicleInserts.map(v => v.id),
      inventory: { quantity: 180, location: 'Warehouse A-18', minStock: 25, maxStock: 200 }
    },
    {
      sku: 'DENSO-30303',
      name: 'Denso Radiator',
      description: 'Aluminum radiator with plastic tanks for efficient engine cooling',
      price: 189.99,
      condition: 'New',
      weight: 15.2,
      dimensions: '{"length": "28", "width": "18", "height": "6"}',
      carbonFootprint: 9.8,
      warrantyPeriod: 36,
      manufacturerId: manufacturerInserts[4]?.id,
      supplierId: supplierInserts[1]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[5]?.id],
      fitments: [vehicleInserts[1]?.id, vehicleInserts[2]?.id, vehicleInserts[4]?.id],
      inventory: { quantity: 60, location: 'Warehouse B-22', minStock: 8, maxStock: 100 }
    },
    {
      sku: 'ACD-40404',
      name: 'ACDelco Fuel Pump Assembly',
      description: 'Electric fuel pump with integrated fuel filter for reliable fuel delivery',
      price: 89.99,
      condition: 'New',
      weight: 2.8,
      dimensions: '{"length": "12", "width": "6", "height": "4"}',
      carbonFootprint: 5.5,
      warrantyPeriod: 24,
      manufacturerId: manufacturerInserts[3]?.id,
      supplierId: supplierInserts[0]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[6]?.id],
      fitments: [vehicleInserts[0]?.id, vehicleInserts[3]?.id],
      inventory: { quantity: 95, location: 'Warehouse C-12', minStock: 12, maxStock: 120 }
    },
    {
      sku: 'CON-50505',
      name: 'Continental Automatic Transmission Filter Kit',
      description: 'Complete transmission filter kit with gasket for fluid filtration',
      price: 39.99,
      condition: 'New',
      weight: 1.5,
      dimensions: '{"length": "8", "width": "6", "height": "2"}',
      carbonFootprint: 3.8,
      warrantyPeriod: 24,
      manufacturerId: manufacturerInserts[5]?.id,
      supplierId: supplierInserts[2]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[7]?.id],
      fitments: [vehicleInserts[2]?.id, vehicleInserts[4]?.id],
      inventory: { quantity: 140, location: 'Warehouse D-10', minStock: 18, maxStock: 180 }
    },
    {
      sku: 'NGK-60606',
      name: 'NGK Glow Plugs - Set of 4',
      description: 'Ceramic glow plugs for diesel engines with fast heat-up time',
      price: 119.99,
      condition: 'New',
      weight: 0.6,
      dimensions: '{"length": "4", "width": "2", "height": "2"}',
      carbonFootprint: 2.9,
      warrantyPeriod: 36,
      manufacturerId: manufacturerInserts[1]?.id,
      supplierId: supplierInserts[1]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[0]?.id, categoryInserts[3]?.id],
      fitments: [vehicleInserts[1]?.id], // Diesel vehicles only
      inventory: { quantity: 75, location: 'Warehouse A-25', minStock: 10, maxStock: 100 }
    },
    {
      sku: 'MIC-70707',
      name: 'Michelin Defender T+H Tires',
      description: 'All-season tires with MaxTouch Construction for longer tread life',
      price: 149.99,
      condition: 'Refurbished',
      weight: 24.2,
      dimensions: '{"diameter": "17", "width": "215", "aspect_ratio": "55"}',
      carbonFootprint: 8.2, // Lower carbon footprint due to refurbishing
      warrantyPeriod: 48,
      manufacturerId: manufacturerInserts[2]?.id,
      supplierId: supplierInserts[2]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[2]?.id],
      fitments: [vehicleInserts[0]?.id, vehicleInserts[3]?.id, vehicleInserts[4]?.id],
      inventory: { quantity: 35, location: 'Warehouse C-18', minStock: 6, maxStock: 70 }
    },
    {
      sku: 'FRAM-80808',
      name: 'Fram Tough Guard Air Filter',
      description: 'Heavy-duty air filter designed for extreme conditions and dusty environments',
      price: 19.99,
      condition: 'New',
      weight: 0.9,
      dimensions: '{"length": "12", "width": "8", "height": "2"}',
      carbonFootprint: 2.4,
      warrantyPeriod: 18,
      manufacturerId: manufacturerInserts[7]?.id,
      supplierId: supplierInserts[1]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[0]?.id],
      fitments: vehicleInserts.map(v => v.id),
      inventory: { quantity: 220, location: 'Warehouse B-5', minStock: 30, maxStock: 280 }
    },
    {
      sku: 'MON-90909',
      name: 'Monroe Sensa-Trac Shock Absorbers',
      description: 'Gas-charged shock absorbers with velocity-sensitive valving',
      price: 79.99,
      condition: 'New',
      weight: 6.8,
      dimensions: '{"length": "22", "width": "3", "height": "3"}',
      carbonFootprint: 7.1,
      warrantyPeriod: 36,
      manufacturerId: manufacturerInserts[6]?.id,
      supplierId: supplierInserts[0]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[2]?.id],
      fitments: [vehicleInserts[2]?.id, vehicleInserts[3]?.id],
      inventory: { quantity: 110, location: 'Warehouse D-12', minStock: 14, maxStock: 140 }
    },
    {
      sku: 'BREM-01010',
      name: 'Brembo Brake Fluid - DOT 4',
      description: 'High-performance brake fluid with excellent boiling point and corrosion protection',
      price: 16.99,
      condition: 'New',
      weight: 1.0,
      dimensions: '{"length": "6", "width": "4", "height": "8"}',
      carbonFootprint: 1.5,
      warrantyPeriod: 24,
      manufacturerId: manufacturerInserts[9]?.id,
      supplierId: supplierInserts[0]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[1]?.id],
      fitments: vehicleInserts.map(v => v.id),
      inventory: { quantity: 250, location: 'Warehouse A-8', minStock: 40, maxStock: 300 }
    },
    {
      sku: 'KN-11111',
      name: 'K&N Oil Filter',
      description: 'High-flow oil filter with 1" nut for easy removal',
      price: 14.99,
      condition: 'New',
      weight: 0.7,
      dimensions: '{"length": "4.5", "width": "3.5", "height": "3.5"}',
      carbonFootprint: 1.9,
      warrantyPeriod: 12,
      manufacturerId: manufacturerInserts[10]?.id,
      supplierId: supplierInserts[1]?.id,
      vendorId: vendor.id,
      categories: [categoryInserts[0]?.id],
      fitments: vehicleInserts.map(v => v.id),
      inventory: { quantity: 280, location: 'Warehouse B-18', minStock: 35, maxStock: 350 }
    }
  ];

  // Create parts with relationships
  for (const partData of sampleParts) {
    const { categories: partCategories, fitments: partFitments, inventory: partInventory, ...partInfo } = partData;

    // Check if part already exists
    const { data: existing } = await supabase
      .from('Part')
      .select('id')
      .eq('sku', partInfo.sku)
      .single();

    let part;
    if (existing) {
      part = existing;
    } else {
      // Insert part
      const { data, error: partError } = await supabase
        .from('Part')
        .insert(partInfo)
        .select()
        .single();

      if (partError) {
        console.error('Error creating part:', partError);
        continue;
      }
      part = data;
    }

    // Add categories
    if (partCategories && partCategories.length > 0) {
      for (let i = 0; i < partCategories.length; i++) {
        const categoryId = partCategories[i];
        if (categoryId) {
          // Check if relationship already exists
          const { data: existingRelation } = await supabase
            .from('PartCategory')
            .select('id')
            .eq('partId', part.id)
            .eq('categoryId', categoryId)
            .single();

          if (!existingRelation) {
            await supabase
              .from('PartCategory')
              .insert({
                partId: part.id,
                categoryId,
                isPrimary: i === 0
              });
          }
        }
      }
    }

    // Add fitments
    if (partFitments && partFitments.length > 0) {
      for (const vehicleId of partFitments) {
        if (vehicleId) {
          // Check if relationship already exists
          const { data: existingRelation } = await supabase
            .from('Fitment')
            .select('id')
            .eq('partId', part.id)
            .eq('vehicleId', vehicleId)
            .single();

          if (!existingRelation) {
            await supabase
              .from('Fitment')
              .insert({
                partId: part.id,
                vehicleId
              });
          }
        }
      }
    }

    // Add inventory
    if (partInventory) {
      // Check if inventory already exists
      const { data: existingInventory } = await supabase
        .from('Inventory')
        .select('id')
        .eq('partId', part.id)
        .single();

      if (!existingInventory) {
        await supabase
          .from('Inventory')
          .insert({
            partId: part.id,
            ...partInventory
          });
      }
    }
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${manufacturerInserts.length} manufacturers`);
  console.log(`🏢 Created ${supplierInserts.length} suppliers`);
  console.log(`📂 Created ${categoryInserts.length} categories`);
  console.log(`🚗 Created ${vehicleInserts.length} vehicles`);
  console.log(`🔧 Created ${sampleParts.length} parts`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  });