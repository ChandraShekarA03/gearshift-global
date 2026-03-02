import { create } from 'zustand';

interface PartItem {
    id: string;
    name: string;
    price: number;
    condition: 'New' | 'Refurbished';
    co2SavingsKg?: number; // Estimated savings for using refurbished
}

interface CartState {
    items: PartItem[];
    ecoShippingActive: boolean;
    setEcoShipping: (active: boolean) => void;
    addItem: (item: PartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;

    // Computed totals
    getCartTotal: () => number;
    getTotalCO2Savings: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [
        // Pre-fill a mock item for demonstration
        { id: 'mock-1', name: 'Refurbished Alternator - Honda Civic', price: 125, condition: 'Refurbished', co2SavingsKg: 45 }
    ],
    ecoShippingActive: false,

    setEcoShipping: (active) => set({ ecoShippingActive: active }),

    addItem: (item) => set((state) => ({ items: [...state.items, item] })),

    removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
    })),

    clearCart: () => set({ items: [] }),

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
