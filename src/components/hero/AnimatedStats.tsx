"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from '@react-spring/web';
import { Shield, Users, Globe, Zap, Award, Truck } from 'lucide-react';

interface StatItemProps {
    icon: React.ReactNode;
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    description: string;
    delay?: number;
}

function AnimatedNumber({ value, suffix = "", prefix = "", duration = 2000 }: { 
    value: number; 
    suffix?: string; 
    prefix?: string; 
    duration?: number; 
}) {
    const { number } = useSpring({
        from: { number: 0 },
        number: value,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });

    return (
        <animated.div className="text-4xl md:text-5xl font-bold text-primary">
            {number.to(n => `${prefix}${n.toFixed(value > 10 ? 0 : 1)}${suffix}`)}
        </animated.div>
    );
}

function StatItem({ icon, value, suffix, prefix, label, description, delay = 0 }: StatItemProps) {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ 
                duration: 0.8, 
                delay: delay,
                type: "spring",
                stiffness: 100
            }}
            className="group relative"
        >
            <div className="glass p-8 rounded-2xl text-center hover:glass-hover transition-all duration-500 hover:scale-105 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {/* Icon container */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={inView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ 
                        duration: 0.8, 
                        delay: delay + 0.3,
                        type: "spring",
                        stiffness: 150 
                    }}
                    className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-500"
                >
                    <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                </motion.div>

                {/* Animated number */}
                <div className="mb-4">
                    {inView && (
                        <AnimatedNumber 
                            value={value} 
                            suffix={suffix} 
                            prefix={prefix}
                        />
                    )}
                </div>

                {/* Label */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: delay + 0.8 }}
                    className="space-y-2"
                >
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {label}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {description}
                    </p>
                </motion.div>

                {/* Decorative element */}
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
        </motion.div>
    );
}

const stats = [
    {
        icon: <Shield className="h-8 w-8" />,
        value: 2.4,
        suffix: "M+",
        label: "Verified Parts",
        description: "Premium quality automotive parts from trusted manufacturers worldwide"
    },
    {
        icon: <Award className="h-8 w-8" />,
        value: 99.8,
        suffix: "%",
        label: "Fit Accuracy",
        description: "Industry-leading precision with our AI-powered compatibility system"
    },
    {
        icon: <Globe className="h-8 w-8" />,
        value: 180,
        suffix: "+",
        label: "Countries Served",
        description: "Global shipping network delivering to mechanics worldwide"
    },
    {
        icon: <Users className="h-8 w-8" />,
        value: 500,
        suffix: "K+",
        label: "Happy Customers",
        description: "Trusted by mechanics, shops, and automotive enthusiasts globally"
    },
    {
        icon: <Zap className="h-8 w-8" />,
        value: 24,
        suffix: "/7",
        label: "Expert Support",
        description: "Round-the-clock technical assistance from certified technicians"
    },
    {
        icon: <Truck className="h-8 w-8" />,
        value: 48,
        suffix: "hrs",
        label: "Average Delivery",
        description: "Lightning-fast shipping with real-time tracking and updates"
    }
];

export default function AnimatedStats() {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <section ref={ref} className="py-24 bg-gradient-to-br from-background to-surface relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
            
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
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                        <span className="text-primary font-medium">Performance Metrics</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Trusted by <span className="text-gradient">Millions</span> Worldwide
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Our numbers speak for themselves - delivering exceptional automotive parts and service across the globe
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <StatItem
                            key={index}
                            icon={stat.icon}
                            value={stat.value}
                            suffix={stat.suffix}
                            label={stat.label}
                            description={stat.description}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}