"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';

export default function CartNavButton() {
    const itemsCount = useCartStore((state) => state.items.length);

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Link href="/checkout" className="relative p-3 text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-all group rounded-xl hover:bg-[var(--color-surface)]/50">
                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />

                {itemsCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 bg-[var(--color-gradient-primary)] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-[0_0_15px_rgba(59,130,246,0.6)] border-2 border-[var(--color-background)]"
                    >
                        {itemsCount}
                    </span>
                )}

                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-[var(--color-glass-border)] shadow-lg">
                    Shopping Cart
                    {itemsCount > 0 && <span className="ml-1">({itemsCount} items)</span>}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--color-surface-elevated)] border-l border-t border-[var(--color-glass-border)] rotate-45"></div>
                </div>
            </Link>
        </motion.div>
    );
}
