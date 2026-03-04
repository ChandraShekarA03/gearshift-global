"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
    Search, 
    ShoppingCart, 
    Truck, 
    Shield, 
    Smartphone, 
    Globe, 
    Zap, 
    Award,
    ArrowRight,
    CheckCircle,
    Star
} from 'lucide-react';

const features = [
    {
        id: 1,
        icon: <Search className="h-8 w-8" />,
        title: "AI-Powered Search",
        subtitle: "Smart Part Finder",
        description: "Advanced machine learning algorithms analyze your vehicle specifications and find the perfect parts with 99.8% accuracy. No more guesswork or compatibility issues.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
        benefits: [
            "Instant compatibility checking",
            "Visual part recognition",
            "Smart recommendations",
            "Real-time availability"
        ],
        color: "from-blue-500/20 to-cyan-500/20",
        accentColor: "text-blue-500"
    },
    {
        id: 2,
        icon: <ShoppingCart className="h-8 w-8" />,
        title: "One-Click Ordering",
        subtitle: "Streamlined Experience",
        description: "Intuitive shopping cart with bulk ordering capabilities, saved vehicle profiles, and intelligent part bundling suggestions for complete repair solutions.",
        image: "https://images.unsplash.com/photo-1556742049-0c0b8b5ce59d?w=600&h=400&fit=crop",
        benefits: [
            "Bulk order discounts",
            "Saved vehicle profiles",
            "Smart bundles",
            "Quick reordering"
        ],
        color: "from-purple-500/20 to-pink-500/20",
        accentColor: "text-purple-500"
    },
    {
        id: 3,
        icon: <Truck className="h-8 w-8" />,
        title: "Global Logistics",
        subtitle: "Worldwide Delivery",
        description: "Sophisticated supply chain network ensuring fast, reliable delivery to 180+ countries. Real-time tracking and expedited shipping options available.",
        image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&h=400&fit=crop",
        benefits: [
            "180+ countries served",
            "Real-time tracking",
            "Expedited options",
            "Local warehouses"
        ],
        color: "from-green-500/20 to-emerald-500/20",
        accentColor: "text-green-500"
    },
    {
        id: 4,
        icon: <Shield className="h-8 w-8" />,
        title: "Quality Assurance",
        subtitle: "Premium Standards",
        description: "Rigorous 127-point quality inspection process ensures every part meets or exceeds OEM specifications. Comprehensive warranties and quality guarantees.",
        image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop",
        benefits: [
            "127-point inspection",
            "OEM specifications",
            "Extended warranties",
            "Quality certificates"
        ],
        color: "from-orange-500/20 to-red-500/20",
        accentColor: "text-orange-500"
    },
    {
        id: 5,
        icon: <Smartphone className="h-8 w-8" />,
        title: "Mobile Integration",
        subtitle: "On-the-Go Access",
        description: "Native mobile apps with augmented reality part identification, voice search, barcode scanning, and offline catalog access for field mechanics.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
        benefits: [
            "AR part identification",
            "Voice search",
            "Barcode scanning",
            "Offline access"
        ],
        color: "from-teal-500/20 to-blue-500/20",
        accentColor: "text-teal-500"
    },
    {
        id: 6,
        icon: <Award className="h-8 w-8" />,
        title: "Expert Support",
        subtitle: "24/7 Technical Help",
        description: "Certified technicians provide installation guidance, troubleshooting support, and technical consultation. Video calls, AR assistance, and detailed documentation available.",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
        benefits: [
            "Certified technicians",
            "Video consultations",
            "AR guidance",
            "Installation videos"
        ],
        color: "from-indigo-500/20 to-purple-500/20",
        accentColor: "text-indigo-500"
    }
];

export default function FeatureShowcase() {
    const [activeFeature, setActiveFeature] = useState(0);
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    return (
        <section ref={ref} className="py-32 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl"></div>
            
            <div className="max-width container-padding relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-6 py-3 text-sm mb-8"
                    >
                        <Zap className="h-4 w-4 text-accent" />
                        <span className="text-primary font-medium">Advanced Features</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Technology That <span className="text-gradient">Powers</span> Excellence
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Discover the cutting-edge features that make GearShift Global the most advanced automotive parts platform
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Feature Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="space-y-4"
                    >
                        {features.map((feature, index) => (
                            <motion.button
                                key={feature.id}
                                onClick={() => setActiveFeature(index)}
                                className={`w-full text-left p-6 rounded-2xl transition-all duration-500 group ${
                                    activeFeature === index
                                        ? 'glass-active border-primary/40 shadow-lg scale-[1.02]'
                                        : 'glass hover:glass-hover'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} transition-all duration-300 ${
                                        activeFeature === index ? 'scale-110' : 'group-hover:scale-105'
                                    }`}>
                                        <div className={feature.accentColor}>
                                            {feature.icon}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {feature.title}
                                            </h3>
                                            <ArrowRight className={`h-4 w-4 transition-all duration-300 ${
                                                activeFeature === index 
                                                    ? 'text-primary translate-x-1 opacity-100' 
                                                    : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                                            }`} />
                                        </div>
                                        <p className="text-sm text-muted-foreground">{feature.subtitle}</p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Feature Display */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="relative"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFeature}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                                className="glass p-8 rounded-3xl"
                            >
                                {/* Feature Image */}
                                <div className="relative mb-8 overflow-hidden rounded-xl group">
                                    <img
                                        src={features[activeFeature].image}
                                        alt={features[activeFeature].title}
                                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                    <div className={`absolute top-4 left-4 p-3 rounded-xl bg-white/10 backdrop-blur-md`}>
                                        <div className={features[activeFeature].accentColor}>
                                            {features[activeFeature].icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Feature Content */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground mb-2">
                                            {features[activeFeature].title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {features[activeFeature].description}
                                        </p>
                                    </div>

                                    {/* Benefits List */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {features[activeFeature].benefits.map((benefit, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center space-x-2"
                                            >
                                                <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                                                <span className="text-sm text-muted-foreground">{benefit}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Action Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full btn-primary flex items-center justify-center space-x-2 py-4"
                                    >
                                        <span>Learn More</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}