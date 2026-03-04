import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/parts/[id] - Get a specific part
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: part, error } = await supabase
      .from('Part')
      .select(`
        *,
        vendor:User(name, email),
        manufacturer:Manufacturer(name),
        supplier:Supplier(name),
        categories:PartCategory(
          category:Category(name)
        ),
        fitments:Fitment(
          vehicle:Vehicle(make, model, year)
        ),
        inventory:Inventory(quantity, location),
        reviews:Review(rating, verified),
        warranties:Warranty(type, duration)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Part not found' }, { status: 404 });
      }
      console.error('Error fetching part:', error);
      return NextResponse.json({ error: 'Failed to fetch part' }, { status: 500 });
    }

    return NextResponse.json(part);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/parts/[id] - Update a specific part
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updateData: Record<string, unknown> = {};
    if (sku !== undefined) updateData.sku = sku;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (condition !== undefined) updateData.condition = condition;
    if (carbonFootprint !== undefined) updateData.carbonFootprint = parseFloat(carbonFootprint);
    if (weight !== undefined) updateData.weight = parseFloat(weight);
    if (dimensions !== undefined) updateData.dimensions = dimensions;
    if (warrantyPeriod !== undefined) updateData.warrantyPeriod = parseInt(warrantyPeriod);
    if (vendorId !== undefined) updateData.vendorId = vendorId;
    if (manufacturerId !== undefined) updateData.manufacturerId = manufacturerId;
    if (supplierId !== undefined) updateData.supplierId = supplierId;

    const { data: part, error } = await supabase
      .from('Part')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Part not found' }, { status: 404 });
      }
      console.error('Error updating part:', error);
      return NextResponse.json({ error: 'Failed to update part' }, { status: 500 });
    }

    // Update categories if provided
    if (categories !== undefined) {
      // Delete existing categories
      await supabase.from('PartCategory').delete().eq('partId', id);
      // Insert new categories
      if (categories.length > 0) {
        const partCategories = categories.map((catId: string, index: number) => ({
          partId: id,
          categoryId: catId,
          isPrimary: index === 0
        }));
        await supabase.from('PartCategory').insert(partCategories);
      }
    }

    // Update fitments if provided
    if (fitments !== undefined) {
      // Delete existing fitments
      await supabase.from('Fitment').delete().eq('partId', id);
      // Insert new fitments
      if (fitments.length > 0) {
        const partFitments = fitments.map((vehicleId: string) => ({
          partId: id,
          vehicleId
        }));
        await supabase.from('Fitment').insert(partFitments);
      }
    }

    // Update inventory if provided
    if (inventory !== undefined) {
      const existingInventory = await supabase.from('Inventory').select('id').eq('partId', id).single();
      if (existingInventory.data) {
        await supabase.from('Inventory').update({
          quantity: inventory.quantity || 0,
          location: inventory.location,
          minStock: inventory.minStock || 0,
          maxStock: inventory.maxStock
        }).eq('partId', id);
      } else {
        await supabase.from('Inventory').insert({
          partId: id,
          quantity: inventory.quantity || 0,
          location: inventory.location,
          minStock: inventory.minStock || 0,
          maxStock: inventory.maxStock
        });
      }
    }

    return NextResponse.json(part);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/parts/[id] - Delete a specific part
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('Part')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting part:', error);
      return NextResponse.json({ error: 'Failed to delete part' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Part deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}