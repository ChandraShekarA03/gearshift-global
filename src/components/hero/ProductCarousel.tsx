"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCards, EffectCreative } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
    Star, 
    ArrowRight, 
    ShoppingCart, 
    Eye, 
    Heart,
    Zap,
    Award,
    Package
} from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-creative';

const featuredProducts = [
    {
        id: 1,
        name: "Premium Brake Pads",
        category: "Brake System",
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.9,
        reviews: 1247,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        badge: "Best Seller",
        badgeColor: "bg-accent",
        compatibility: "Universal Fit",
        shipping: "Free 2-Day",
        inStock: true,
        features: ["Ceramic Compound", "Low Dust", "Quiet Operation"],
        discount: 31
    },
    {
        id: 2,
        name: "Performance Air Filter",
        category: "Engine",
        price: 45.99,
        originalPrice: null,
        rating: 4.8,
        reviews: 892,
        image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
        badge: "New Arrival",
        badgeColor: "bg-primary",
        compatibility: "2015-2023 Models",
        shipping: "Free Shipping",
        inStock: true,
        features: ["High Flow", "Washable", "5-Year Warranty"]
    },
    {
        id: 3,
        name: "LED Headlight Kit",
        category: "Lighting",
        price: 199.99,
        originalPrice: 299.99,
        rating: 4.9,
        reviews: 2156,
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        badge: "Editor's Choice",
        badgeColor: "bg-purple-500",
        compatibility: "Plug & Play",
        shipping: "Express Available",
        inStock: true,
        features: ["6000K Cool White", "50,000hr Lifespan", "IP67 Rated"],
        discount: 33
    },
    {
        id: 4,
        name: "Sport Suspension Kit",
        category: "Suspension",
        price: 899.99,
        originalPrice: 1199.99,
        rating: 4.7,
        reviews: 634,
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
        badge: "Limited Time",
        badgeColor: "bg-red-500",
        compatibility: "Professional Install",
        shipping: "Free Freight",
        inStock: false,
        features: ["Adjustable Height", "Performance Tuned", "2-Year Warranty"],
        discount: 25
    },
    {
        id: 5,
        name: "Cold Air Intake System",
        category: "Engine",
        price: 329.99,
        originalPrice: 429.99,
        rating: 4.8,
        reviews: 1089,
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
        badge: "Performance",
        badgeColor: "bg-orange-500",
        compatibility: "Bolt-on Installation",
        shipping: "Free 2-Day",
        inStock: true,
        features: ["+15HP Gain", "Improved Sound", "CARB Legal"],
        discount: 23
    },
    {
        id: 6,
        name: "Premium Oil Filter",
        category: "Engine",
        price: 24.99,
        originalPrice: null,
        rating: 4.9,
        reviews: 3421,
        image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
        badge: "Top Rated",
        badgeColor: "bg-green-500",
        compatibility: "OEM Replacement",
        shipping: "Same Day",
        inStock: true,
        features: ["Synthetic Media", "Anti-Drainback", "Premium Quality"]
    }
];

interface ProductCardProps {
    product: typeof featuredProducts[0];
    index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group h-full"
        >
            <div className="glass rounded-2xl overflow-hidden hover:glass-hover transition-all duration-500 hover:scale-[1.02] h-full flex flex-col">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                        >
                            <Eye className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                        >
                            <Heart className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-primary/80 backdrop-blur-sm rounded-full text-white hover:bg-primary transition-colors"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </motion.button>
                    </div>

                    {/* Badge */}
                    <div className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                        {product.badge}
                    </div>

                    {/* Discount Badge */}
                    {product.discount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{product.discount}%
                        </div>
                    )}

                    {/* Stock Status */}
                    <div className={`absolute bottom-3 right-3 ${product.inStock ? 'bg-green-500' : 'bg-red-500'} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                        {product.inStock ? 'In Stock' : 'Pre-Order'}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    {/* Category */}
                    <div className="text-sm text-primary font-medium mb-2">{product.category}</div>
                    
                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                    </h3>

                    {/* Rating & Reviews */}
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                        i < Math.floor(product.rating) 
                                            ? 'text-accent fill-current' 
                                            : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {product.rating} ({product.reviews.toLocaleString()} reviews)
                        </span>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-4 flex-1">
                        {product.features.slice(0, 2).map((feature, i) => (
                            <div key={i} className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Zap className="h-3 w-3 text-accent flex-shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Compatibility & Shipping */}
                    <div className="space-y-2 mb-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Compatibility:</span>
                            <span className="text-foreground font-medium">{product.compatibility}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Shipping:</span>
                            <span className="text-primary font-medium">{product.shipping}</span>
                        </div>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-auto">
                        <div className="flex items-baseline justify-between mb-4">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-2xl font-bold text-foreground">
                                    ${product.price}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-lg text-muted-foreground line-through">
                                        ${product.originalPrice}
                                    </span>
                                )}
                            </div>
                            {product.discount && (
                                <span className="text-sm text-green-600 font-bold">
                                    Save ${((product.originalPrice || 0) - product.price).toFixed(2)}
                                </span>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Add to Cart</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ProductCarousel() {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <section ref={ref} className="py-24 bg-gradient-to-br from-background to-surface relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="max-width container-padding relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-6 py-3 text-sm mb-8"
                    >
                        <Package className="h-4 w-4 text-accent" />
                        <span className="text-primary font-medium">Featured Products</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Top <span className="text-gradient">Quality</span> Parts
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Discover our most popular and highest-rated automotive parts, trusted by professionals worldwide
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        loop={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={true}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="product-swiper !pb-16"
                    >
                        {featuredProducts.map((product, index) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>

                {/* View All Products CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-secondary px-8 py-4 text-lg flex items-center space-x-2 mx-auto"
                    >
                        <span>View All Products</span>
                        <ArrowRight className="h-5 w-5" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}