import { create } from 'zustand';

interface PartItem {
    id: string;
    name: string;
    price: number;
    condition: 'New' | 'Refurbished' | 'Used';
    co2SavingsKg?: number; // Estimated savings for using refurbished
    sku?: string;
    description?: string;
    carbonFootprint?: number;
}

interface CartState {
    items: PartItem[];
    ecoShippingActive: boolean;
    successMessage: string | null;
    setEcoShipping: (active: boolean) => void;
    addItem: (item: PartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    setSuccessMessage: (message: string | null) => void;

    // Computed totals
    getCartTotal: () => number;
    getTotalCO2Savings: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [], // Start with empty cart - will be populated from real data
    ecoShippingActive: false,
    successMessage: null,

    setEcoShipping: (active) => set({ ecoShippingActive: active }),

    addItem: (item) => set((state) => ({ 
        items: [...state.items, item],
        successMessage: `${item.name} added to cart!`
    })),

    removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
    })),

    clearCart: () => set({ items: [] }),

    setSuccessMessage: (message) => set({ successMessage: message }),

    getCartTotal: () => {
        const itemTotal = get().items.reduce((sum, item) => sum + item.price, 0);
        // Add $5 premium for eco-shipping if active
        const shipping = get().ecoShippingActive ? 5 : 0;
        return itemTotal + shipping;
    },

    getTotalCO2Savings: () => {
        // Base savings from refurbished parts
        const partsSavings = get().items.reduce((sum, item) => sum + (item.co2SavingsKg || 0), 0);
        // Estimated savings from carbon-neutral shipping (15kg approx relative to standard air)
        const shippingSavings = get().ecoShippingActive ? 15 : 0;

        return partsSavings + shippingSavings;
    }
}));
