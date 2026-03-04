"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function ToastNotification() {
    const { successMessage, setSuccessMessage } = useCartStore();

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage, setSuccessMessage]);

    return (
        <AnimatePresence>
            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed top-4 right-4 z-50"
                >
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg border border-green-600 flex items-center gap-3 max-w-md">
                        <CheckCircle size={20} className="flex-shrink-0" />
                        <span className="font-medium">{successMessage}</span>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="ml-auto hover:bg-green-600 rounded-full p-1 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}