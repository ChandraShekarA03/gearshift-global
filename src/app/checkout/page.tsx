"use client";

import { useCartStore } from '@/store/useCartStore';
import { Leaf, ShieldCheck, ArrowRight, TreePine, Package } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CheckoutPage() {
    const { items, ecoShippingActive, setEcoShipping, getCartTotal, getTotalCO2Savings, clearCart } = useCartStore();
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    const isCartEmpty = items.length === 0;

    const handleConfirmOrder = () => {
        // Simulate order processing
        setOrderConfirmed(true);
        // Clear cart after a delay
        setTimeout(() => {
            clearCart();
            setOrderConfirmed(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-black pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Secure <span className="text-[var(--color-primary)]">Checkout</span>
                    </h1>
                    <p className="text-gray-400">Review your order and configure shipping.</p>
                </div>

                {isCartEmpty ? (
                    <div className="glass text-center p-12 rounded-3xl">
                        <Package size={64} className="mx-auto mb-6 text-gray-600" />
                        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                        <Link href="/parts" className="inline-block mt-4 px-8 py-3 bg-[var(--color-primary)] hover:bg-blue-600 text-white font-bold rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(0,123,255,0.4)]">
                            Browse Catalog
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Summary & CO2 Impact */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Part Display */}
                            <div className="glass p-6 rounded-3xl">
                                <h3 className="text-xl font-bold border-b border-gray-800 pb-4 mb-4 flex items-center gap-2">
                                    <Package className="text-[var(--color-primary)]" /> Selected Items
                                </h3>

                                {items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-xl mb-4 border border-white/10 hover:border-[var(--color-primary)]/40 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{item.name}</h4>
                                            <span className="text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-1 rounded inline-block">
                                                {item.condition}
                                            </span>
                                            {item.co2SavingsKg && (
                                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded inline-block ml-2 border border-green-500/30">
                                                    +{item.co2SavingsKg}kg CO₂ Saved
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xl font-mono">${item.price.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Eco-Shipping Toggle Section */}
                            <motion.div
                                className={`p-6 rounded-3xl border-2 transition-all duration-300 ${ecoShippingActive ? 'bg-green-900/10 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'glass border-transparent'}`}
                                layout
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl ${ecoShippingActive ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                            <Leaf size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                Opt for Eco-Shipping
                                                {ecoShippingActive && <ShieldCheck size={16} className="text-green-500" />}
                                            </h3>
                                            <p className="text-sm text-gray-400 max-w-md mt-1">
                                                Offset the carbon emissions of this delivery for just <span className="text-white font-bold">$5.00</span>. We bundle routing to minimize impact.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setEcoShipping(!ecoShippingActive)}
                                        className={`shrink-0 px-6 py-3 rounded-full font-bold transition-all border-2 ${ecoShippingActive
                                                ? 'bg-transparent border-green-500 text-green-400 hover:bg-green-500/10'
                                                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                            }`}
                                    >
                                        {ecoShippingActive ? 'Added to Route' : '+ Add for $5.00'}
                                    </button>
                                </div>
                            </motion.div>

                            {/* CO2 Calculation Visualization Dashboard */}
                            <div className="glass p-6 rounded-3xl border border-green-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <TreePine size={120} />
                                </div>
                                <h3 className="text-lg font-bold text-green-400 mb-6 flex items-center gap-2 z-10 relative">
                                    <Leaf size={20} /> Your Sustainability Impact
                                </h3>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-10 relative text-center">
                                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Total Saved</div>
                                        <div className="text-3xl font-mono text-green-400 font-bold">{getTotalCO2Savings()}</div>
                                        <div className="text-xs text-gray-500 mt-1">kg CO₂</div>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Equivalent To</div>
                                        <div className="text-3xl font-mono text-white font-bold">{((getTotalCO2Savings()) / 20).toFixed(1)}</div>
                                        <div className="text-xs text-gray-500 mt-1">Trees Planted</div>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5 md:col-span-2 flex flex-col justify-center items-center text-left md:items-start p-6">
                                        <p className="text-sm text-gray-300">
                                            By selecting refurbished parts and Eco-Shipping, you actively reduced manufacturing emissions and supported sustainable logistics.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Recap Sidebar */}
                        <div className="space-y-6">
                            <div className="glass p-6 rounded-3xl sticky top-24">
                                <h3 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4">Order Total</h3>

                                <div className="space-y-4 mb-6 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Parts Subtotal</span>
                                        <span className="font-mono text-white">${items.reduce((s, i) => s + i.price, 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Standard Shipping</span>
                                        <span className="font-mono text-white">Free</span>
                                    </div>

                                    {ecoShippingActive && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="flex justify-between text-green-400 border-l-2 border-green-500 pl-3"
                                        >
                                            <span>Eco-Shipping Offset</span>
                                            <span className="font-mono">+$5.00</span>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="border-t border-gray-800 pt-4 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-3xl font-mono text-[var(--color-primary)] font-bold">
                                            ${getCartTotal().toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleConfirmOrder}
                                    disabled={orderConfirmed}
                                    className="w-full py-4 bg-[var(--color-primary)] hover:bg-blue-600 disabled:bg-gray-600 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:hover:scale-100 shadow-[0_0_20px_rgba(0,123,255,0.4)]"
                                >
                                    {orderConfirmed ? 'Order Confirmed!' : 'Confirm Order'} <ArrowRight size={20} />
                                </button>

                                {orderConfirmed && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center"
                                    >
                                        <p className="text-green-400 font-semibold">Thank you for your order!</p>
                                        <p className="text-sm text-gray-300 mt-1">Your order has been confirmed and will be processed shortly.</p>
                                    </motion.div>
                                )}

                                <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                                    <ShieldCheck size={14} /> Encrypted & Secure Checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
