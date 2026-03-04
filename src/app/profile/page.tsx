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
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock orders data - in real app, fetch from API
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        status: 'Delivered',
        totalAmount: 245.99,
        createdAt: '2024-03-01',
        items: [
          { name: 'Brake Pads - Honda Civic', quantity: 1, price: 89.99 },
          { name: 'Oil Filter', quantity: 1, price: 15.99 },
          { name: 'Spark Plugs', quantity: 4, price: 140.01 }
        ]
      },
      {
        id: 'ORD-002',
        status: 'Shipped',
        totalAmount: 125.50,
        createdAt: '2024-02-28',
        items: [
          { name: 'Air Filter', quantity: 1, price: 45.50 },
          { name: 'Cabin Filter', quantity: 1, price: 80.00 }
        ]
      }
    ];
    setOrders(mockOrders);
    setLoading(false);
  }, []);

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
              <h1 className="text-3xl font-bold">{user.name || 'User'}</h1>
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
                  onClick={logout}
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
                  <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} items • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.totalAmount}</p>
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
                <h2 className="text-2xl font-bold">Order History</h2>

                {loading ? (
                  <div className="text-center py-8">Loading orders...</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-surface rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${order.totalAmount}</p>
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
                              <span>{item.name} (x{item.quantity})</span>
                              <span>${item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
                        defaultValue={user.name || ''}
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