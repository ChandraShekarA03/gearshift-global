"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Upload, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface Manufacturer {
  id: string;
  name: string;
}

interface FormData {
  sku: string;
  name: string;
  description: string;
  price: string;
  condition: string;
  weight: string;
  dimensions: string;
  carbonFootprint: string;
  warrantyPeriod: string;
  manufacturerId: string;
  categories: string[];
  initialStock: string;
  location: string;
}

export default function AddProductPage() {
  const { user, loading: authLoading, isVendor } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    sku: '',
    name: '',
    description: '',
    price: '',
    condition: 'New',
    weight: '',
    dimensions: '',
    carbonFootprint: '',
    warrantyPeriod: '',
    manufacturerId: '',
    categories: [],
    initialStock: '',
    location: ''
  });

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (!authLoading && (!user || !isVendor)) {
      router.push('/vendors/login');
    }
  }, [user, authLoading, isVendor, router]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [categoriesResponse, manufacturersResponse] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/manufacturers')
      ]);

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);
      }

      if (manufacturersResponse.ok) {
        const manufacturersData = await manufacturersResponse.json();
        setManufacturers(manufacturersData.manufacturers || []);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user?.id) {
        setError('You must be logged in to add products');
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        carbonFootprint: formData.carbonFootprint ? parseFloat(formData.carbonFootprint) : 0,
        warrantyPeriod: formData.warrantyPeriod ? parseInt(formData.warrantyPeriod) : null,
        initialStock: formData.initialStock ? parseInt(formData.initialStock) : 0,
        vendorId: user.id
      };

      const response = await fetch('/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/vendors/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create product');
      }
    } catch (error) {
      setError('An error occurred while creating the product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isVendor) {
    return null; // Will redirect
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-surface p-8 rounded-lg"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Product Added Successfully!</h2>
          <p className="text-muted-foreground">Redirecting you to the dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-width container-padding py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <Link
                href="/vendors/dashboard"
                className="flex items-center gap-2 text-white/80 hover:text-white mb-2 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold">Add New Product</h1>
              <p className="text-white/80 mt-1">
                List a new automotive part in the marketplace
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-width container-padding py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    SKU (Stock Keeping Unit) *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                    placeholder="e.g., BOSCH-SP001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                    placeholder="e.g., Bosch Premium Spark Plugs"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                  placeholder="Detailed description of the product, its features, and benefits..."
                  required
                />
              </div>
            </div>

            {/* Pricing and Condition */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Pricing & Condition</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                    required
                  >
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Physical Details */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Physical Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                    placeholder='e.g., 4.5" x 2.1" x 2.1"'
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Carbon Footprint (kg CO2)
                  </label>
                  <input
                    type="number"
                    name="carbonFootprint"
                    value={formData.carbonFootprint}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            {/* Categories and Manufacturer */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Classification</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Manufacturer
                  </label>
                  <select
                    name="manufacturerId"
                    value={formData.manufacturerId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                  >
                    <option value="">Select Manufacturer</option>
                    {manufacturers.map((manufacturer) => (
                      <option key={manufacturer.id} value={manufacturer.id}>
                        {manufacturer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Warranty Period (months)
                  </label>
                  <input
                    type="number"
                    name="warrantyPeriod"
                    value={formData.warrantyPeriod}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                    placeholder="12"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Categories
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Initial Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="initialStock"
                    value={formData.initialStock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Warehouse Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
                    placeholder="e.g., Warehouse A-12"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}