"use client";

import { useState } from 'react';
import { Search, Car, Settings2, Info, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartFitmentSearch() {
    const [activeTab, setActiveTab] = useState<'vin' | 'select'>('vin');

    return (
        <div className="glass p-3 max-w-4xl w-full mx-auto shadow-2xl relative overflow-hidden border border-[var(--color-glass-border)] hover:border-[var(--color-primary)]/30 transition-all">
            {/* Enhanced Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-3 bg-[var(--color-gradient-primary)] blur-3xl opacity-30" />
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-[var(--color-accent)] rounded-full blur-2xl opacity-20" />

            {/* Header */}
            <div className="relative z-10 mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                    <span className="text-sm font-semibold text-[var(--color-foreground-muted)] uppercase tracking-wider">Smart Fitment Engine</span>
                    <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-[var(--color-foreground)] mb-2">
                    Find Your Perfect Match
                </h2>
                <p className="text-center text-[var(--color-foreground-muted)] text-sm">
                    Search by VIN for guaranteed fitment or browse by vehicle details
                </p>
            </div>

            {/* Enhanced Tabs */}
            <div className="flex border-b border-[var(--color-glass-border)] mb-6 px-4">
                <button
                    onClick={() => setActiveTab('vin')}
                    className={`flex-1 px-6 py-4 font-semibold text-sm flex items-center justify-center gap-3 border-b-3 transition-all rounded-t-lg ${
                        activeTab === 'vin'
                            ? 'border-[var(--color-primary)] text-[var(--color-foreground)] bg-[var(--color-primary)]/10'
                            : 'border-transparent text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]/50'
                    }`}
                >
                    <Search size={18} />
                    VIN Search
                    <span className="text-xs bg-[var(--color-success)] text-white px-2 py-1 rounded-full font-bold">99.8%</span>
                </button>
                <button
                    onClick={() => setActiveTab('select')}
                    className={`flex-1 px-6 py-4 font-semibold text-sm flex items-center justify-center gap-3 border-b-3 transition-all rounded-t-lg ${
                        activeTab === 'select'
                            ? 'border-[var(--color-primary)] text-[var(--color-foreground)] bg-[var(--color-primary)]/10'
                            : 'border-transparent text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]/50'
                    }`}
                >
                    <Car size={18} />
                    Make & Model
                </button>
            </div>

            <div className="p-6 min-h-[140px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'vin' && (
                        <div
                            key="vin"
                            className="flex flex-col md:flex-row gap-6 h-full"
                        >
                            <div className="flex-1 relative">
                                <label className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">Vehicle Identification Number (VIN)</label>
                                <input
                                    type="text"
                                    placeholder="Enter 17-character VIN (e.g., 1HGBH41JXMN109186)"
                                    className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-glass-border)] rounded-xl px-6 py-4 text-[var(--color-foreground)] placeholder-[var(--color-foreground-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all uppercase tracking-widest text-sm font-mono"
                                    maxLength={17}
                                />
                                <div className="absolute right-4 top-12 text-[var(--color-foreground-muted)] cursor-help hover:text-[var(--color-primary)] transition-colors">
                                    <Info size={16} />
                                </div>
                            </div>
                            <div className="flex flex-col justify-end">
                                <button className="bg-[var(--color-gradient-primary)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(59,123,255,0.4)]">
                                    <Settings2 size={20} />
                                    Find Parts
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'select' && (
                        <div
                            key="select"
                            className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full"
                        >
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">Year</label>
                                <select className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-glass-border)] rounded-xl px-4 py-4 text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all appearance-none">
                                    <option value="">Select Year</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">Make</label>
                                <select className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-glass-border)] rounded-xl px-4 py-4 text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all appearance-none disabled:opacity-50" disabled>
                                    <option value="">Select Make</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">Model</label>
                                <select className="w-full bg-[var(--color-surface)]/50 border border-[var(--color-glass-border)] rounded-xl px-4 py-4 text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all appearance-none disabled:opacity-50" disabled>
                                    <option value="">Select Model</option>
                                </select>
                            </div>

                            <div className="flex flex-col justify-end">
                                <button className="bg-[var(--color-gradient-primary)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(59,123,255,0.4)]">
                                    <Search size={18} />
                                    Search
                                </button>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div className="px-6 pb-6 text-center">
                <div className="flex items-center justify-center gap-4 text-sm text-[var(--color-foreground-muted)]">
                    <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                        <span>Verified fitment guaranteed</span>
                    </div>
                    <span className="text-[var(--color-glass-border)]">•</span>
                    <span>2.4M+ parts spanning 1996 - {new Date().getFullYear()}</span>
                    <span className="text-[var(--color-glass-border)]">•</span>
                    <span>Global shipping available</span>
                </div>
            </div>
        </div>
    );
}
