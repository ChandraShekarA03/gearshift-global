"use client";

import { useState, useEffect } from 'react';
import { Users, Star, MapPin, Mail, Phone, Loader2 } from 'lucide-react';

// Vendor interface
interface Vendor {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
    // Mock additional fields for display
    rating?: number;
    totalParts?: number;
    location?: string;
    phone?: string;
    description?: string;
}

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch vendors from API
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/users?role=Vendor');
                if (!response.ok) {
                    throw new Error('Failed to fetch vendors');
                }
                const data = await response.json();
                // Handle both array response and object response
                const vendorData = Array.isArray(data) ? data : data.users || [];

                // Add mock data for better display
                const enhancedVendors = vendorData.map((vendor: Vendor) => ({
                    ...vendor,
                    rating: Math.round((4 + Math.random()) * 10) / 10, // Random rating between 4.0-5.0
                    totalParts: Math.floor(Math.random() * 500) + 50, // Random parts count
                    location: ['Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA'][Math.floor(Math.random() * 5)],
                    phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
                    description: 'Trusted automotive parts supplier specializing in quality components and exceptional service.'
                }));

                setVendors(enhancedVendors);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load vendors');
                console.error('Error fetching vendors:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header & Title */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Our Vendors</h1>
                <p className="text-gray-400 text-sm mt-1">Connect with trusted automotive parts suppliers and manufacturers.</p>
            </div>

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.length > 0 ? (
                    vendors.map((vendor) => (
                        <div key={vendor.id} className="glass group overflow-hidden flex flex-col hover:border-[var(--color-primary)]/50 transition-all hover:-translate-y-1">
                            {/* Vendor Header */}
                            <div className="p-6 border-b border-white/5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {vendor.name.charAt(0)}
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star size={14} fill="currentColor" />
                                        <span className="text-sm font-medium">{vendor.rating}</span>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-xl mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                                    {vendor.name}
                                </h3>
                                <p className="text-sm text-gray-400 mb-3">{vendor.description}</p>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Users size={12} />
                                        {vendor.totalParts} parts
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        {vendor.location}
                                    </span>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail size={16} className="text-gray-400" />
                                        <span className="text-gray-300">{vendor.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone size={16} className="text-gray-400" />
                                        <span className="text-gray-300">{vendor.phone}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-auto">
                                    <button className="flex-1 bg-white/10 hover:bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                        View Profile
                                    </button>
                                    <button className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                        Contact
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : loading ? (
                    <div className="col-span-full text-center py-12">
                        <Loader2 className="mx-auto mb-4 animate-spin" size={48} />
                        <p className="text-gray-400">Loading vendors...</p>
                    </div>
                ) : error ? (
                    <div className="col-span-full text-center py-12">
                        <div className="text-red-400 mb-4">
                            <p className="text-lg font-semibold mb-2">Error loading vendors</p>
                            <p className="text-sm">{error}</p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="col-span-full text-center py-12">
                        <Users size={48} className="mx-auto mb-4 opacity-50 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-400">No vendors found</h3>
                        <p className="text-sm text-gray-500">Check back later for new vendor partnerships.</p>
                    </div>
                )}
            </div>

            {/* Call to Action */}
            {vendors.length > 0 && (
                <div className="mt-12 text-center">
                    <div className="glass p-8 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Become a Vendor</h2>
                        <p className="text-gray-400 mb-6">
                            Join our network of trusted automotive parts suppliers and reach thousands of customers.
                        </p>
                        <button className="bg-[var(--color-primary)] hover:bg-[var(--color-accent)] text-white px-8 py-3 rounded-lg font-medium transition-colors">
                            Apply to Become a Vendor
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}