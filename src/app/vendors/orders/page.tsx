"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Clock, CheckCircle, XCircle, Truck, Warehouse, Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
  user: {
    name: string;
    email: string;
  };
}

export default function VendorOrdersPage() {
  const { user, loading: authLoading, isVendor } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isVendor)) {
      router.push('/vendors/login');
    }
  }, [user, authLoading, isVendor, router]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      // Fetch orders that contain products from this vendor
      const response = await fetch(`/api/orders?vendorId=${user?.id}`);
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

  const handleStatusUpdate = async (orderId: string) => {
    if (!newStatus) return;
    
    setUpdating(true);
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'Shipped' && trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // Refresh orders
        await fetchOrders();
        setEditingOrder(null);
        setNewStatus('');
        setTrackingNumber('');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdating(false);
    }
  };

  const startEditing = (order: Order) => {
    setEditingOrder(order.id);
    setNewStatus(order.status);
    setTrackingNumber(order.trackingNumber || '');
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'processing':
        return <Package className="text-blue-500" size={20} />;
      case 'ready at warehouse':
        return <Warehouse className="text-indigo-500" size={20} />;
      case 'shipped':
        return <Truck className="text-purple-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'ready at warehouse':
        return 'bg-indigo-100 text-indigo-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage orders containing your products
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No orders yet</p>
            <p className="text-muted-foreground mt-2">Orders will appear here when customers purchase your products</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface rounded-lg border border-border p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(order.status)}
                      <h3 className="text-lg font-semibold text-foreground">
                        Order #{order.id.substring(0, 8)}
                      </h3>
                      {editingOrder === order.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="px-3 py-1 rounded-full text-xs font-medium border border-border bg-background"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Ready at Warehouse">Ready at Warehouse</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleStatusUpdate(order.id)}
                            disabled={updating}
                            className="px-3 py-1 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
                          >
                            {updating ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingOrder(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <button
                            onClick={() => startEditing(order)}
                            className="p-1 text-muted-foreground hover:text-primary transition-colors"
                            title="Update status"
                          >
                            <Edit2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer: {order.user.name || order.user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm text-muted-foreground">
                        Tracking: <span className="font-mono">{order.trackingNumber}</span>
                      </p>
                    )}
                    {editingOrder === order.id && newStatus === 'Shipped' && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number"
                          className="px-3 py-1 text-sm border border-border rounded bg-background"
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Order Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="text-foreground">{item.part.name}</p>
                          <p className="text-muted-foreground text-xs">SKU: {item.part.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground">
                            {item.quantity} x ${item.price}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
