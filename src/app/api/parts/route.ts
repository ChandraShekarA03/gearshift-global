import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Temporary mock data for development until database permissions are resolved
const mockParts = [
  {
    id: '1',
    sku: 'BOSCH-12345',
    name: 'Bosch Premium Spark Plugs',
    description: 'High-performance iridium spark plugs for optimal engine performance',
    price: 89.99,
    condition: 'New',
    carbonFootprint: 2.5,
    manufacturer: { name: 'Bosch' },
    categories: [{ category: { name: 'Engine Parts' } }, { category: { name: 'Electrical' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } }
    ],
    inventory: { quantity: 150, location: 'Warehouse A-12' },
    reviews: [
      { rating: 5, verified: true },
      { rating: 4, verified: true },
      { rating: 5, verified: false }
    ]
  },
  {
    id: '2',
    sku: 'NGK-67890',
    name: 'NGK Iridium IX Spark Plugs',
    description: 'Premium iridium spark plugs with excellent durability and performance',
    price: 79.99,
    condition: 'New',
    carbonFootprint: 2.2,
    manufacturer: { name: 'NGK' },
    categories: [{ category: { name: 'Engine Parts' } }, { category: { name: 'Electrical' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 200, location: 'Warehouse B-8' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '3',
    sku: 'MIC-11111',
    name: 'Michelin Pilot Sport 4S Tires',
    description: 'Ultra-high performance tires for sporty driving and all-season grip',
    price: 189.99,
    condition: 'New',
    carbonFootprint: 15.8,
    manufacturer: { name: 'Michelin' },
    categories: [{ category: { name: 'Suspension' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } }
    ],
    inventory: { quantity: 50, location: 'Warehouse C-15' },
    reviews: [
      { rating: 5, verified: true },
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '4',
    sku: 'ACD-22222',
    name: 'ACDelco Professional Brake Pads',
    description: 'Premium ceramic brake pads with excellent stopping power and reduced dust',
    price: 65.99,
    condition: 'New',
    carbonFootprint: 8.5,
    manufacturer: { name: 'ACDelco' },
    categories: [{ category: { name: 'Brake System' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 120, location: 'Warehouse A-5' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true },
      { rating: 4, verified: false }
    ]
  },
  {
    id: '5',
    sku: 'DEN-33333',
    name: 'Denso Oxygen Sensor',
    description: 'High-quality oxygen sensor for accurate emissions monitoring',
    price: 45.99,
    condition: 'New',
    carbonFootprint: 3.2,
    manufacturer: { name: 'Denso' },
    categories: [{ category: { name: 'Electrical' } }, { category: { name: 'Exhaust' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 180, location: 'Warehouse B-12' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '6',
    sku: 'CON-44444',
    name: 'Continental ContiProContact Tires',
    description: 'All-season touring tires with excellent wet and dry performance',
    price: 129.99,
    condition: 'New',
    carbonFootprint: 12.3,
    manufacturer: { name: 'Continental' },
    categories: [{ category: { name: 'Suspension' } }],
    fitments: [
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 75, location: 'Warehouse C-8' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true },
      { rating: 4, verified: true }
    ]
  },
  {
    id: '7',
    sku: 'MON-55555',
    name: 'Monroe Quick-Strut Assembly',
    description: 'Complete strut assembly with coil spring for improved ride comfort',
    price: 149.99,
    condition: 'New',
    carbonFootprint: 11.2,
    manufacturer: { name: 'Monroe' },
    categories: [{ category: { name: 'Suspension' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } }
    ],
    inventory: { quantity: 85, location: 'Warehouse D-3' },
    reviews: [
      { rating: 5, verified: true },
      { rating: 4, verified: true }
    ]
  },
  {
    id: '8',
    sku: 'FRAM-66666',
    name: 'Fram Extra Guard Oil Filter',
    description: 'High-efficiency oil filter with 99% filtration efficiency',
    price: 12.99,
    condition: 'New',
    carbonFootprint: 1.8,
    manufacturer: { name: 'Fram' },
    categories: [{ category: { name: 'Engine Parts' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 300, location: 'Warehouse A-1' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '9',
    sku: 'MOBIL-77777',
    name: 'Mobil 1 High Mileage Synthetic Oil',
    description: 'Advanced synthetic motor oil for engines with over 75,000 miles',
    price: 34.99,
    condition: 'New',
    carbonFootprint: 6.8,
    manufacturer: { name: 'Mobil 1' },
    categories: [{ category: { name: 'Engine Parts' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 200, location: 'Warehouse B-15' },
    reviews: [
      { rating: 5, verified: true },
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '10',
    sku: 'BREM-88888',
    name: 'Brembo Cross-Drilled Brake Rotors',
    description: 'High-performance cross-drilled rotors for improved heat dissipation',
    price: 199.99,
    condition: 'New',
    carbonFootprint: 14.5,
    manufacturer: { name: 'Brembo' },
    categories: [{ category: { name: 'Brake System' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } }
    ],
    inventory: { quantity: 45, location: 'Warehouse C-20' },
    reviews: [
      { rating: 5, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '11',
    sku: 'KN-99999',
    name: 'K&N High-Flow Air Filter',
    description: 'Washable and reusable high-flow air filter for increased horsepower',
    price: 59.99,
    condition: 'New',
    carbonFootprint: 4.2,
    manufacturer: { name: 'K&N' },
    categories: [{ category: { name: 'Engine Parts' } }],
    fitments: [
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 120, location: 'Warehouse D-7' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '12',
    sku: 'MAGNA-10101',
    name: 'MagnaFlow Stainless Steel Exhaust System',
    description: 'Complete stainless steel exhaust system with improved flow and sound',
    price: 349.99,
    condition: 'New',
    carbonFootprint: 18.9,
    manufacturer: { name: 'MagnaFlow' },
    categories: [{ category: { name: 'Exhaust' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } }
    ],
    inventory: { quantity: 25, location: 'Warehouse E-5' },
    reviews: [
      { rating: 5, verified: true },
      { rating: 4, verified: true }
    ]
  },
  {
    id: '13',
    sku: 'BOSCH-20202',
    name: 'Bosch Wiper Blades - 22"',
    description: 'All-season wiper blades with aerodynamic design for streak-free visibility',
    price: 24.99,
    condition: 'New',
    carbonFootprint: 2.1,
    manufacturer: { name: 'Bosch' },
    categories: [{ category: { name: 'Electrical' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 180, location: 'Warehouse A-18' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '14',
    sku: 'DENSO-30303',
    name: 'Denso Radiator',
    description: 'Aluminum radiator with plastic tanks for efficient engine cooling',
    price: 189.99,
    condition: 'New',
    carbonFootprint: 9.8,
    manufacturer: { name: 'Denso' },
    categories: [{ category: { name: 'Cooling System' } }],
    fitments: [
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 60, location: 'Warehouse B-22' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '15',
    sku: 'ACD-40404',
    name: 'ACDelco Fuel Pump Assembly',
    description: 'Electric fuel pump with integrated fuel filter for reliable fuel delivery',
    price: 89.99,
    condition: 'New',
    carbonFootprint: 5.5,
    manufacturer: { name: 'ACDelco' },
    categories: [{ category: { name: 'Fuel System' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } }
    ],
    inventory: { quantity: 95, location: 'Warehouse C-12' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '16',
    sku: 'CON-50505',
    name: 'Continental Automatic Transmission Filter Kit',
    description: 'Complete transmission filter kit with gasket for fluid filtration',
    price: 39.99,
    condition: 'New',
    carbonFootprint: 3.8,
    manufacturer: { name: 'Continental' },
    categories: [{ category: { name: 'Transmission' } }],
    fitments: [
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 140, location: 'Warehouse D-10' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '17',
    sku: 'NGK-60606',
    name: 'NGK Glow Plugs - Set of 4',
    description: 'Ceramic glow plugs for diesel engines with fast heat-up time',
    price: 119.99,
    condition: 'New',
    carbonFootprint: 2.9,
    manufacturer: { name: 'NGK' },
    categories: [{ category: { name: 'Engine Parts' } }, { category: { name: 'Electrical' } }],
    fitments: [
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } } // Diesel version
    ],
    inventory: { quantity: 75, location: 'Warehouse A-25' },
    reviews: [
      { rating: 5, verified: true },
      { rating: 4, verified: true }
    ]
  },
  {
    id: '18',
    sku: 'MIC-70707',
    name: 'Michelin Defender T+H Tires',
    description: 'All-season tires with MaxTouch Construction for longer tread life',
    price: 149.99,
    condition: 'Refurbished',
    carbonFootprint: 8.2,
    manufacturer: { name: 'Michelin' },
    categories: [{ category: { name: 'Suspension' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 35, location: 'Warehouse C-18' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '19',
    sku: 'FRAM-80808',
    name: 'Fram Tough Guard Air Filter',
    description: 'Heavy-duty air filter designed for extreme conditions and dusty environments',
    price: 19.99,
    condition: 'New',
    carbonFootprint: 2.4,
    manufacturer: { name: 'Fram' },
    categories: [{ category: { name: 'Engine Parts' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 220, location: 'Warehouse B-5' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '20',
    sku: 'MON-90909',
    name: 'Monroe Sensa-Trac Shock Absorbers',
    description: 'Gas-charged shock absorbers with velocity-sensitive valving',
    price: 79.99,
    condition: 'New',
    carbonFootprint: 7.1,
    manufacturer: { name: 'Monroe' },
    categories: [{ category: { name: 'Suspension' } }],
    fitments: [
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } }
    ],
    inventory: { quantity: 110, location: 'Warehouse D-12' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '21',
    sku: 'BREM-01010',
    name: 'Brembo Brake Fluid - DOT 4',
    description: 'High-performance brake fluid with excellent boiling point and corrosion protection',
    price: 16.99,
    condition: 'New',
    carbonFootprint: 1.5,
    manufacturer: { name: 'Brembo' },
    categories: [{ category: { name: 'Brake System' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 250, location: 'Warehouse A-8' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  },
  {
    id: '22',
    sku: 'KN-11111',
    name: 'K&N Oil Filter',
    description: 'High-flow oil filter with 1" nut for easy removal',
    price: 14.99,
    condition: 'New',
    carbonFootprint: 1.9,
    manufacturer: { name: 'K&N' },
    categories: [{ category: { name: 'Engine Parts' } }],
    fitments: [
      { vehicle: { make: 'Honda', model: 'Civic', year: 2020 } },
      { vehicle: { make: 'Ford', model: 'Focus', year: 2015 } },
      { vehicle: { make: 'Mazda', model: 'Mazda3', year: 2013 } },
      { vehicle: { make: 'Nissan', model: 'Altima', year: 2015 } },
      { vehicle: { make: 'Toyota', model: 'Corolla', year: 2015 } }
    ],
    inventory: { quantity: 280, location: 'Warehouse B-18' },
    reviews: [
      { rating: 4, verified: true },
      { rating: 5, verified: true }
    ]
  }
];

// GET /api/parts - Get all parts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let filteredParts = [...mockParts];

    // Apply filters
    if (search) {
      filteredParts = filteredParts.filter(part =>
        part.name.toLowerCase().includes(search.toLowerCase()) ||
        part.description.toLowerCase().includes(search.toLowerCase()) ||
        part.sku.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredParts = filteredParts.filter(part =>
        part.categories.some(cat => cat.category.name.toLowerCase().includes(category.toLowerCase()))
      );
    }

    if (minPrice) {
      filteredParts = filteredParts.filter(part => part.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filteredParts = filteredParts.filter(part => part.price <= parseFloat(maxPrice));
    }

    // Apply pagination
    const paginatedParts = filteredParts.slice(offset, offset + limit);

    return NextResponse.json(paginatedParts);
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}

// POST /api/parts - Create a new part
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sku, 
      name, 
      description, 
      price, 
      condition, 
      categories, 
      fitments, 
      carbonFootprint, 
      weight, 
      dimensions, 
      warrantyPeriod, 
      vendorId, 
      manufacturerId, 
      supplierId,
      inventory 
    } = body;

    // Validate required fields
    if (!sku || !name || !price || !vendorId) {
      return NextResponse.json(
        { error: 'Missing required fields: sku, name, price, vendorId' },
        { status: 400 }
      );
    }

    const { data: part, error } = await supabase
      .from('Part')
      .insert({
        sku,
        name,
        description,
        price: parseFloat(price),
        condition: condition || 'New',
        carbonFootprint: carbonFootprint ? parseFloat(carbonFootprint) : 0,
        weight: weight ? parseFloat(weight) : null,
        dimensions,
        warrantyPeriod: warrantyPeriod ? parseInt(warrantyPeriod) : null,
        vendorId,
        manufacturerId,
        supplierId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating part:', error);
      return NextResponse.json({ error: 'Failed to create part' }, { status: 500 });
    }

    // Insert categories
    if (categories && categories.length > 0) {
      const partCategories = categories.map((catId: string, index: number) => ({
        partId: part.id,
        categoryId: catId,
        isPrimary: index === 0
      }));
      await supabase.from('PartCategory').insert(partCategories);
    }

    // Insert fitments
    if (fitments && fitments.length > 0) {
      const partFitments = fitments.map((vehicleId: string) => ({
        partId: part.id,
        vehicleId
      }));
      await supabase.from('Fitment').insert(partFitments);
    }

    // Insert inventory
    if (inventory) {
      await supabase.from('Inventory').insert({
        partId: part.id,
        quantity: inventory.quantity || 0,
        location: inventory.location,
        minStock: inventory.minStock || 0,
        maxStock: inventory.maxStock
      });
    }

    return NextResponse.json(part, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}