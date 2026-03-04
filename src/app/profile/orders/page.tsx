"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, Warehouse, ShoppingBag, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  part: {
    name: string;
    sku: string;
    description?: string;
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  trackingNumber?: string;
  items: OrderItem[];
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function CustomerOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = (currentStatus: string) => {
    const steps = [
      { name: 'Pending', icon: Clock, color: 'text-yellow-500' },
      { name: 'Processing', icon: Package, color: 'text-blue-500' },
      { name: 'Ready at Warehouse', icon: Warehouse, color: 'text-indigo-500' },
      { name: 'Shipped', icon: Truck, color: 'text-purple-500' },
      { name: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
    ];

    const currentIndex = steps.findIndex(s => s.name.toLowerCase() === currentStatus.toLowerCase());
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-lg">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground mb-2">No orders yet</p>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Link
              href="/parts"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block"
            >
              Browse Parts
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusSteps = getStatusSteps(order.status);
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface rounded-lg border border-border overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-background/50 p-6 border-b border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          Order #{order.id.substring(0, 8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-primary mt-1">
                            Tracking: <span className="font-mono">{order.trackingNumber}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-foreground">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Status Timeline */}
                  <div className="p-6 border-b border-border">
                    <h4 className="text-sm font-semibold text-foreground mb-4">Order Status</h4>
                    <div className="flex items-center justify-between">
                      {statusSteps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                          <div key={step.name} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                                  step.completed
                                    ? 'bg-primary border-primary text-white'
                                    : 'bg-background border-border text-muted-foreground'
                                }`}
                              >
                                <Icon size={20} />
                              </div>
                              <p
                                className={`text-xs mt-2 text-center max-w-[80px] ${
                                  step.completed ? 'text-foreground font-medium' : 'text-muted-foreground'
                                }`}
                              >
                                {step.name}
                              </p>
                            </div>
                            {index < statusSteps.length - 1 && (
                              <div
                                className={`flex-1 h-0.5 mx-2 ${
                                  step.completed ? 'bg-primary' : 'bg-border'
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-foreground mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-foreground font-medium">{item.part.name}</p>
                            <p className="text-xs text-muted-foreground">SKU: {item.part.sku}</p>
                            <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-foreground font-semibold">
                              ${(item.quantity * item.price).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ${item.price} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="bg-background/50 p-6 border-t border-border">
                      <div className="flex items-start gap-2">
                        <MapPin className="text-muted-foreground mt-1" size={16} />
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">Shipping Address</p>
                          <p className="text-sm text-muted-foreground">
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
