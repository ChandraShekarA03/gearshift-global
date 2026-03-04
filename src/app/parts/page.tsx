"use client";

import { useState, useMemo, useEffect } from 'react';
import { Filter, ChevronDown, Star, Loader2 } from 'lucide-react';
import CarWireframe3D from '@/components/hero/CarWireframe3D';
import { useCartStore } from '@/store/useCartStore';

// Part interface matching the database schema
interface Part {
    id: string;
    sku: string;
    name: string;
    description: string;
    price: number;
    condition: string;
    carbonFootprint: number;
    manufacturer?: {
        name: string;
    };
    categories?: Array<{
        category: {
            name: string;
        };
    }>;
    fitments?: Array<{
        vehicle: {
            make: string;
            model: string;
            year: number;
        };
    }>;
    inventory?: {
        quantity: number;
    };
    reviews?: Array<{
        rating: number;
        verified: boolean;
    }>;
}

export default function PartsPage() {
    const addItem = useCartStore((state) => state.addItem);

    // State for parts data and loading
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [ecoOnly, setEcoOnly] = useState(false);
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch parts from API
    useEffect(() => {
        const fetchParts = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/parts');
                if (!response.ok) {
                    throw new Error('Failed to fetch parts');
                }
                const data = await response.json();
                // Handle both array response (mock) and object response (real API)
                setParts(Array.isArray(data) ? data : data.parts || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load parts');
                console.error('Error fetching parts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchParts();
    }, []);

    const handleAddToCart = (part: Part) => {
        addItem({
            id: part.id,
            name: part.name,
            price: part.price,
            condition: part.condition as 'New' | 'Refurbished',
            co2SavingsKg: part.carbonFootprint > 0 ? Math.round(part.carbonFootprint * 10) : undefined, // Convert carbon footprint to CO2 savings
        });
    };

    // Filter and sort parts
    const filteredParts = useMemo(() => {
        if (!parts.length) return [];

        const filtered = parts.filter(part => {
            // Search filter
            if (searchQuery && !part.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !part.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !part.sku.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Condition filter
            if (selectedConditions.length > 0 && !selectedConditions.includes(part.condition)) {
                return false;
            }

            // Manufacturer filter
            if (selectedManufacturers.length > 0 && !selectedManufacturers.includes(part.manufacturer?.name || '')) {
                return false;
            }

            // Price range filter
            const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
            const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
            if (part.price < minPrice || part.price > maxPrice) {
                return false;
            }

            // Eco filter (based on carbon footprint - lower footprint = more eco)
            if (ecoOnly && part.carbonFootprint >= 5) {
                return false;
            }

            return true;
        });

        // Sort
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            default:
                // Keep original order for featured
                break;
        }

        return filtered;
    }, [parts, selectedConditions, selectedManufacturers, priceRange, ecoOnly, sortBy, searchQuery]);

    // Get unique manufacturers for filter
    const availableManufacturers = useMemo(() => {
        const manufacturers = new Set<string>();
        parts.forEach(part => {
            if (part.manufacturer?.name) {
                manufacturers.add(part.manufacturer.name);
            }
        });
        return Array.from(manufacturers).sort();
    }, [parts]);

    const clearFilters = () => {
        setSelectedConditions([]);
        setSelectedManufacturers([]);
        setPriceRange({ min: '', max: '' });
        setEcoOnly(false);
        setSortBy('featured');
        setSearchQuery('');
    };

    const handleConditionChange = (condition: string, checked: boolean) => {
        if (checked) {
            setSelectedConditions(prev => [...prev, condition]);
        } else {
            setSelectedConditions(prev => prev.filter(c => c !== condition));
        }
    };

    const handleManufacturerChange = (manufacturer: string, checked: boolean) => {
        if (checked) {
            setSelectedManufacturers(prev => [...prev, manufacturer]);
        } else {
            setSelectedManufacturers(prev => prev.filter(m => m !== manufacturer));
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header & Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Parts Directory</h1>
                    <p className="text-gray-400 text-sm mt-1">Browse our inventory of new and certified refurbished auto parts.</p>
                </div>

                {/* Active Vehicle Badge (Placeholder for Zustand state) */}
                <div className="glass px-4 py-2 border border-[var(--color-primary)]/30 rounded-full flex items-center gap-3">
                    <span className="text-xs text-gray-400">Filtering for:</span>
                    <span className="text-sm font-semibold text-[var(--color-primary)]">2023 Honda Civic</span>
                    <button className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors">Clear</button>
                </div>
            </div>

            {/* 3D Interactive Model */}
            <div className="mb-8">
                <CarWireframe3D />
            </div>

            {/* Search Bar */}
            <div className="mb-6 max-w-md">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search parts by name, SKU, or compatibility..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-[var(--color-primary)] outline-none transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="glass p-5 sticky top-28">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                            <Filter size={18} />
                            <h2 className="font-semibold">Filters</h2>
                            <button
                                onClick={clearFilters}
                                className="ml-auto text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Condition Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-3 flex justify-between items-center cursor-pointer">
                                Condition <ChevronDown size={14} className="text-gray-400" />
                            </h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer transition-colors">
                                    <input 
                                        type="checkbox" 
                                        className="accent-[var(--color-primary)] w-4 h-4 bg-transparent border-white/20"
                                        checked={selectedConditions.includes('New')}
                                        onChange={(e) => handleConditionChange('New', e.target.checked)}
                                    /> New
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer transition-colors">
                                    <input 
                                        type="checkbox" 
                                        className="accent-[var(--color-primary)] w-4 h-4 bg-transparent border-white/20"
                                        checked={selectedConditions.includes('Refurbished')}
                                        onChange={(e) => handleConditionChange('Refurbished', e.target.checked)}
                                    /> Refurbished
                                </label>
                            </div>
                        </div>

                        {/* Manufacturer Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-3 flex justify-between items-center cursor-pointer">
                                Manufacturer <ChevronDown size={14} className="text-gray-400" />
                            </h3>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {availableManufacturers.map(manufacturer => (
                                    <label key={manufacturer} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="accent-[var(--color-primary)] w-4 h-4 bg-transparent border-white/20"
                                            checked={selectedManufacturers.includes(manufacturer)}
                                            onChange={(e) => handleManufacturerChange(manufacturer, e.target.checked)}
                                        /> {manufacturer}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-3 flex justify-between items-center cursor-pointer">
                                Price Range <ChevronDown size={14} className="text-gray-400" />
                            </h3>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm focus:border-[var(--color-primary)] outline-none" 
                                />
                                <span className="text-gray-500">-</span>
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm focus:border-[var(--color-primary)] outline-none" 
                                />
                            </div>
                        </div>

                        {/* Eco Filter */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-green-400 hover:text-green-300 cursor-pointer transition-colors p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <input 
                                    type="checkbox" 
                                    className="accent-green-500 w-4 h-4"
                                    checked={ecoOnly}
                                    onChange={(e) => setEcoOnly(e.target.checked)}
                                /> Eco-Certified Only
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
                        <span>Showing {filteredParts.length} Results</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent border-none text-white focus:outline-none cursor-pointer"
                        >
                            <option value="featured" className="bg-[#121212]">Sort by: Featured</option>
                            <option value="price-low" className="bg-[#121212]">Price: Low to High</option>
                            <option value="price-high" className="bg-[#121212]">Price: High to Low</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredParts.length > 0 ? (
                            filteredParts.map((part) => (
                                <div key={part.id} className="glass group overflow-hidden flex flex-col hover:border-[var(--color-primary)]/50 transition-all hover:-translate-y-1">
                                    {/* Image Placeholder */}
                                    <div className="aspect-video bg-[#1a1a1a] relative flex items-center justify-center border-b border-white/5 overflow-hidden">
                                        {part.carbonFootprint < 3 && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider z-10">
                                                Eco Savings
                                            </div>
                                        )}
                                        <img
                                            src={`https://via.placeholder.com/400x300/1a1a1a/ffffff?text=${encodeURIComponent(part.sku)}`}
                                            alt={part.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-sm border ${part.condition === 'New' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 'border-orange-500/30 text-orange-400 bg-orange-500/10'}`}>
                                                {part.condition}
                                            </span>
                                            <div className="flex items-center gap-1 text-yellow-500 text-xs">
                                                <Star size={12} fill="currentColor" />
                                                {part.reviews && part.reviews.length > 0
                                                    ? (part.reviews.reduce((sum, review) => sum + review.rating, 0) / part.reviews.length).toFixed(1)
                                                    : '4.5'
                                                }
                                            </div>
                                        </div>

                                        <h3 className="font-semibold text-lg line-clamp-2 mb-1 group-hover:text-[var(--color-primary)] transition-colors">{part.name}</h3>
                                        <p className="text-xs text-gray-500 mb-2 flex-1">
                                            {part.manufacturer?.name && `By ${part.manufacturer.name}`}
                                        </p>
                                        <p className="text-xs text-gray-400 mb-4">
                                            {part.fitments && part.fitments.length > 0
                                                ? `Fits: ${part.fitments.slice(0, 2).map(f => `${f.vehicle.year} ${f.vehicle.make} ${f.vehicle.model}`).join(', ')}${part.fitments.length > 2 ? ' +' + (part.fitments.length - 2) + ' more' : ''}`
                                                : 'Universal Fit'
                                            }
                                        </p>

                                        <div className="flex items-end justify-between mt-auto">
                                            <div>
                                                <span className="text-2xl font-bold">${part.price.toFixed(2)}</span>
                                                {part.inventory && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {part.inventory.quantity > 0 ? `${part.inventory.quantity} in stock` : 'Out of stock'}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(part)}
                                                disabled={!part.inventory || part.inventory.quantity === 0}
                                                className="bg-white/10 hover:bg-[var(--color-primary)] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                {part.inventory && part.inventory.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : loading ? (
                            <div className="col-span-full text-center py-12">
                                <Loader2 className="mx-auto mb-4 animate-spin" size={48} />
                                <p className="text-gray-400">Loading parts...</p>
                            </div>
                        ) : error ? (
                            <div className="col-span-full text-center py-12">
                                <div className="text-red-400 mb-4">
                                    <p className="text-lg font-semibold mb-2">Error loading parts</p>
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
                                <div className="text-gray-400 mb-4">
                                    <Filter size={48} className="mx-auto mb-4 opacity-50" />
                                    <h3 className="text-xl font-semibold mb-2">No parts found</h3>
                                    <p className="text-sm">Try adjusting your filters or search terms</p>
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
