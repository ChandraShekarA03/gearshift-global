"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const testimonials = [
    {
        id: 1,
        name: "Mike Johnson",
        role: "Master Technician",
        company: "BMW Specialist",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        text: "GearShift made finding the right parts for my customer's BMW incredibly easy. The fitment guarantee gave me peace of mind, and the AI-powered search is revolutionary."
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Auto Shop Owner",
        company: "Vancouver, Canada",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        text: "The international shipping is a game-changer. I can now source parts for any vehicle, anywhere in the world. Customer service is exceptional!"
    },
    {
        id: 3,
        name: "Carlos Rodriguez",
        role: "Fleet Manager",
        company: "Mexico City",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        text: "Quality parts at competitive prices with excellent customer service. GearShift is my go-to for all automotive needs. The mobile app makes ordering super convenient."
    },
    {
        id: 4,
        name: "Lisa Patel",
        role: "Independent Mechanic",
        company: "Mumbai, India",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        text: "The technical documentation and installation guides are incredible. Even complex repairs become manageable with their expert support system."
    },
    {
        id: 5,
        name: "David Kim",
        role: "Performance Tuner",
        company: "Seoul, South Korea",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        text: "For performance modifications, GearShift has the most comprehensive catalog. Their compatibility checker prevents costly mistakes."
    }
];

export default function TestimonialSlider() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            
            <div className="max-width container-padding relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 text-sm mb-6"
                    >
                        <Star className="h-4 w-4 text-accent fill-current" />
                        <span className="text-primary font-medium">Trusted Worldwide</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        What Our <span className="text-gradient">Customers</span> Say
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Join thousands of mechanics, shop owners, and automotive professionals who trust GearShift Global
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        modules={[EffectCoverflow, Pagination, Autoplay]}
                        className="testimonial-swiper !pb-16"
                    >
                        {testimonials.map((testimonial) => (
                            <SwiperSlide key={testimonial.id} className="!w-96">
                                <div className="glass p-8 rounded-2xl mx-4 hover:glass-hover transition-all duration-300 group">
                                    {/* Rating Stars */}
                                    <div className="flex items-center justify-center mb-6">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1, duration: 0.3 }}
                                            >
                                                <Star className="h-5 w-5 text-accent fill-current" />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Testimonial Text */}
                                    <p className="text-muted-foreground text-center mb-8 leading-relaxed">
                                        &quot;{testimonial.text}&quot;
                                    </p>

                                    {/* Author Info */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                                            />
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                                                <Star className="h-3 w-3 text-white fill-current" />
                                            </div>
                                        </div>
                                        
                                        <div className="text-center">
                                            <div className="font-semibold text-foreground">{testimonial.name}</div>
                                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                            <div className="text-xs text-primary font-medium">{testimonial.company}</div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
}