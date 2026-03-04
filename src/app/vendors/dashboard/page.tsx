"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, BarChart3, DollarSign, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface VendorProduct {
  id: string;
  sku: string;
  name: string;
  price: number;
  condition: string;
  createdAt: string;
  inventory?: {
    quantity: number;
  };
  _count?: {
    reviews: number;
  };
}

interface DashboardStats {
  totalProducts: number;
  totalRevenue: number;
  totalOrders: number;
  averageRating: number;
}

export default function VendorDashboard() {
  const { user, loading: authLoading, isVendor } = useAuth();
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (!authLoading && (!user || !isVendor)) {
      router.push('/vendors/login');
    }
  }, [user, authLoading, isVendor, router]);

  useEffect(() => {
    if (user?.id) {
      fetchVendorData();
    }
  }, [user]);

  const fetchVendorData = async () => {
    try {
      // Fetch vendor's products
      const productsResponse = await fetch(`/api/parts?vendorId=${user?.id}`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.parts || []);
        
        // Calculate basic stats
        const totalProducts = productsData.parts?.length || 0;
        const totalRevenue = productsData.parts?.reduce((sum: number, product: any) => 
          sum + (product.price * (product.inventory?.quantity || 0)), 0) || 0;
        
        setStats({
          totalProducts,
          totalRevenue,
          totalOrders: 0, // This would come from orders API
          averageRating: 4.2 // This would be calculated from reviews
        });
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/parts/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vendor dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isVendor) {
    return null; // Will redirect
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
              <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
              <p className="text-white/80 mt-1">
                Welcome back, {user.user_metadata?.name || user.email || 'Vendor'}
              </p>
            </div>
            <Link
              href="/vendors/products/new"
              className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-width container-padding py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Package className="text-primary" size={24} />
              <h3 className="font-semibold">Total Products</h3>
            </div>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-green-500" size={24} />
              <h3 className="font-semibold">Inventory Value</h3>
            </div>
            <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="text-blue-500" size={24} />
              <h3 className="font-semibold">Orders</h3>
            </div>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-yellow-500" size={24} />
              <h3 className="font-semibold">Avg Rating</h3>
            </div>
            <p className="text-3xl font-bold">{stats.averageRating}</p>
          </motion.div>
        </div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface rounded-lg overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Products</h2>
              <Link
                href="/vendors/products/new"
                className="text-primary hover:underline flex items-center gap-2"
              >
                <Plus size={16} />
                Add New Product
              </Link>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first product to the marketplace
              </p>
              <Link
                href="/vendors/products/new"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Product</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">SKU</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Stock</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Condition</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t border-border hover:bg-background/50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Added {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground font-mono text-sm">
                        {product.sku}
                      </td>
                      <td className="p-4 font-semibold">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          (product.inventory?.quantity || 0) > 10 
                            ? 'bg-green-100 text-green-800'
                            : (product.inventory?.quantity || 0) > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inventory?.quantity || 0} units
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {product.condition}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/parts/${product.id}`}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            title="View Product"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/vendors/products/${product.id}/edit`}
                            className="p-2 text-muted-foreground hover:text-blue-500 transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}