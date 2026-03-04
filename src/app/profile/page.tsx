"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, ShoppingBag, MapPin, CreditCard, Truck, Star, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  trackingNumber?: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    part: {
      name: string;
      sku: string;
    };
  }>;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders');
        // Fallback to empty orders array
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback to empty orders array
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
          <Link href="/" className="text-primary hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-width container-padding py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.user_metadata?.name || 'User'}</h1>
              <p className="text-white/80">{user.email}</p>
              <p className="text-sm text-white/60 mt-1">Member since {new Date().getFullYear()}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-width container-padding py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-surface rounded-lg p-4 sticky top-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-surface-elevated text-foreground'
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-4 border-t border-border">
                <button
                  onClick={signOut}
                  className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Account Overview</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-surface rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ShoppingBag className="text-primary" size={24} />
                      <h3 className="font-semibold">Total Orders</h3>
                    </div>
                    <p className="text-3xl font-bold">{orders.length}</p>
                  </div>

                  <div className="bg-surface rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Truck className="text-green-500" size={24} />
                      <h3 className="font-semibold">Delivered</h3>
                    </div>
                    <p className="text-3xl font-bold">
                      {orders.filter(o => o.status === 'Delivered').length}
                    </p>
                  </div>

                  <div className="bg-surface rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="text-yellow-500" size={24} />
                      <h3 className="font-semibold">Eco Savings</h3>
                    </div>
                    <p className="text-3xl font-bold">$127.50</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-surface rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Recent Orders</h3>
                    <Link
                      href="/profile/orders"
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      View All Orders →
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id.substring(0, 8).toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} items • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No orders yet</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Order History</h2>
                  <Link
                    href="/profile/orders"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    View Detailed Tracking
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-8">Loading orders...</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-surface rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Order #{order.id.substring(0, 8).toUpperCase()}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            {order.trackingNumber && (
                              <p className="text-sm text-primary mt-1">
                                Tracking: {order.trackingNumber}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</p>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.part.name} (x{item.quantity})</span>
                              <span>${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No orders yet</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Address Book</h2>
                <div className="bg-surface rounded-lg p-6 text-center">
                  <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No addresses saved yet.</p>
                  <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Add New Address
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'payment' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Payment Methods</h2>
                <div className="bg-surface rounded-lg p-6 text-center">
                  <CreditCard size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No payment methods saved yet.</p>
                  <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Add Payment Method
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Account Settings</h2>
                <div className="bg-surface rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        defaultValue={user.user_metadata?.name || ''}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      />
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}